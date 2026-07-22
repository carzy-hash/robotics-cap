# 1. 推理架构

## 1.1 双原语 + Mode 头

每个**决策点**（不是每个控制步）看当前上下文，输出：

```text
mode ∈ {CODE, CHUNK}
CODE  → 结构化 ops[]（可很长）
CHUNK → 定长 H 步稠密动作（如 H=30）
```

| | CODE | CHUNK |
|--|------|-------|
| 表征 | 小词汇 ops：`move_l` / `move_j` / `via` / `open` / `close`（可选 `compliant`） | EEF/关节 delta 或 FAST tokens |
| 本 turn commit | 最多 **\(x\)** 控制步（\(x\) 可 ≪ gen 展开长度） | **\(H\)** 步 |
| 参数习惯 | 优先 `target_ref` + `offset` | 与主流 VLA 一致 |

不是任务阶段状态机：选 CODE 还是 CHUNK 由「当前是否值得用可压缩几何表示」决定，由 mode 头（或隐式 type token）输出。

---

## 1.2 异步双时钟（部署形态）

```text
控制线程                         策略线程
────────                         ────────
消费 action queue 的 a_t         快环：采图 / tracker / 力
…                                慢环：在延迟 d 内出下一决策
queue 将尽 → swap 新段           冻前缀、改后缀（RTC / blend）
```

**时间线**

1. **发出**：`action` 入 queue，立即执行，不等推理结束。  
2. **边走边看**：执行期间快环持续；慢环在约 \(H-d\)（或 \(x-d\)）启动下一次决策。  
3. **思考**：`task + history + 观测(+进度)` → thought? + mode + action。  
4. **截断**：丢掉未执行尾，或冻住「推理期间必跑」的前缀再接新后缀；接触/力异常可抢占。

决策触发：固定步长 \(s\)（常 \(\approx d\)）、或事件（接触突变、力超限、跟踪丢失）。

**参数**：\(\{H, x, d, s\}\)。\(x\) 与 \(H\) 都是「再决策前的最大 commit」，差别只在表征。

---

## 1.3 单次决策的上下文（逻辑）

```text
[system]  原语 API + 安全约束
[user]    task
          视觉通道（见 04：像素 或 图文）
          proprio / exec_progress / last truncate
          （可选）短 history：过往 action 摘要 + 进度
[assistant] thought? + {mode, action}
```

History **默认**只保留最近少数决策的文本摘要；视觉是否进 history 见 04。

---

## 1.4 衔接与安全

- CODE↔CHUNK 换段：queue 残段作冻结前缀，新段从衔接点生成。  
- Flow/diffusion chunk：可用 RTC 式 inpainting；AR/连续回归：前缀条件或短 blend。  
- 故障：清空 queue 尾 → 强制 CHUNK 或停机。

采集侧用**同一语义的伪时间主进程**（见 03）；RL 直接部署本架构并记 trace（见 02）。

---

## 1.5 CoT / Thought 如何接入

对齐主流 **code agent = ReAct**：每轮先自然语言推理，再 tool/action；observation 进下一轮。CoT **不是**单独系统，而是 turn 内、action 前的一段可开关文本。

### 当前 code agent 怎么做（业界惯例）

| 形态 | 做法 | 代表 |
|------|------|------|
| **隐式 CoT** | assistant 文本里先写理由，再发 tool_call；文本挂在该 action 的 `thought` 上 | OpenHands CodeAct：`content` → `combine_thought` 进第一个 tool |
| **显式 Think tool** | 单独 `think` / `AgentThinkAction`，不改环境，只记推理 | OpenHands Think tool；部分 scaffold |
| **结构化字段** | 协议里强制 `thought` 再 `action`（XML/JSON） | 早期 ReAct 日志；部分 SWE scaffold |
| **隐藏 reasoning** | 模型内部 reasoning，对外只暴露 action（或摘要） | 带 reasoning channel 的 API |

共同循环：

```text
Thought → Action(tool) → Observation → Thought → …
```

环境只执行 **Action**；Thought 进 history，供后续轮次条件化。RL/过程监督通常主打 action 对错；thought 可辅训或忽略。

### 本设计怎么挂

```text
observation(+progress, 视觉/图文)
  →  [CoT / thought]          ← 可选
  →  mode + action(emit)      ← 必监督
  →  伪/真时间推进 → truncate?
```

| 层 | 建议 |
|----|------|
| **推理 (01)** | 同一 decode：先采样 thought tokens，再 mode/action；或两段生成（thought 短、可截断）。latency 紧时 **关 CoT**，只出 mode+action。 |
| **Trace** | `turn.thought: string \| null`；history 里可只留最近 1～K 条 thought 摘要，防爆长。 |
| **SFT (03)** | 冷启动默认 **关**：专家 trace 可不写 thought。若开：用规则模板蒸馏（「偏离前截断→重规划」「接触→CHUNK」）或弱标注，勿强求长篇散文。 |
| **RL (02)** | 优势打在 **action/mode/truncate**；thought **stop-grad** 或不进策略头。需要时可加短 KL，使 thought 与最终 action 一致（防「说一套做一套」）。 |

**与截断/异步**：CoT 只在**决策点**跑（慢环），不在每个控制步跑。内容宜绑定 progress：`e_k`、接触、queue 剩余、选 CODE 还是 CHUNK、是否 truncate——与 03 偏离启发式同一套语言。

**最小落地顺序**：无 CoT 先跑通异步双原语 → 再开短 thought（1～3 句）→ 再考虑显式 `think` tool（无环境副作用，仅记盘）。
# 2. RL：数据构造与监督

RL 与推理共用同一 runtime（01）。不另造「同步 turn 环境」。

---

## 2.1 On-policy 数据长什么样

每条 episode 落盘为 agent trace（见 schema）：

```text
turn: observation(+progress) → thought? → action(emit)
      → 时间推进 → progress + observation_after → truncate?
terminal: success, subgoals, fault, reward?
```

字段要点：

- `action`：发出的 CODE ops 或 CHUNK（可长于本 turn 实际执行长度）  
- `exec_progress`：`steps_executed` / `queue_remaining` / `d` / `s` / `program_cursor`  
- `truncate`：`reason` ∈ {replan, stride, contact, force, …}, `at_step`, `kept_prefix`  
- `exec_status`：含 `truncated`  
- 视觉：引用外存（04），不 inline 像素  

**RL 阶段**：部署 01 的异步环 → 每决策点写 turn → episode 结束算 \(R(\tau)\) → 进 replay。

---

## 2.2 回报 \(R(\tau)\)

整段标量（可加权）：

| 项 | 含义 |
|----|------|
| \(R_{\mathrm{succ}}\) | 任务成功 / 子目标 |
| \(R_{\mathrm{safe}}\) | 碰撞、力超限、fault → 重罚 |
| \(R_{\mathrm{eff}}\) | 时间 / 步数；少无效重规划 |
| \(R_{\mathrm{comp}}\) | 合法 CODE 占比、压缩比（鼓励该用 code 时用 code） |
| \(R_{\mathrm{fit}}\) | CODE 段 replay 与实际/示教 RMSE（过差则罚） |
| \(R_{\mathrm{gate}}\) | 可压却全程 CHUNK、或不可压硬 CODE → 罚 |

无 \(R_{\mathrm{comp}}\)/\(R_{\mathrm{gate}}\) 时模型易塌成纯 CHUNK。

**逐步 \(r_t\)（可选）**

- 决策点 / truncate 边界：给进度、安全、fit/comp  
- 窗口内控制步：可近似 0（或只留安全 shaping）  
- Episode 末：成功大奖励  

优势打在各 turn 的 **`action`（及 mode）** 上；`thought` 可 stop-grad 或不进策略。

---

## 2.3 监督办法

### A. On-policy RL（主）

- 算法不绑定：PPO / GRPO / Cap-RL 风格均可。  
- 条件：与推理相同的 ctx（含进度报告）。  
- 动作空间：离散/结构化 CODE + 连续或 tokenized CHUNK；可先 mode 再参数。  
- 截断本身可作为动作的一部分（显式 truncate 头）或由「新 action 覆盖 queue」隐式完成。

### B. 冷启动（推荐顺序）

1. 用 03 改造后的专家异步 trace 做 **SFT**（只训 action，thought 可关）  
2. 过滤：`success`、无 `fault`、CODE 的 replay RMSE \(<\varepsilon\)  
3. 再上 RL；SFT 分布已是「发出→进度→思考→截断」，与部署对齐  

### C. Preference（可选）

同初态 \(\tau^+ \succ \tau^-\)：成功优先；同成功比 \(R_{\mathrm{eff}}+R_{\mathrm{comp}}\) → DPO/IPO。

---

## 2.4 与采集数据的关系

| 来源 | 用途 |
|------|------|
| 03 离线伪时间专家 trace | SFT / 过滤 / 参考策略 |
| RL 在线 rollout trace | 主优化数据；格式与专家相同 |

禁止：专家用同步「跑完再想」、RL 用异步——时序鸿沟会毁迁移。
# 3. 采集数据：构造与改造

目标：把示教/日志改造成与 **01 推理、02 RL** 同构的异步 agent trace。

---

## 3.1 总体管线

```text
原始采集（稠密 τ、多相机、力/接触）
        ↓
① 分段 + 可压缩性检测
        ↓
② 可压 → 拟合 code（replay RMSE < ε）
   不可压 / 拟合失败 → action_chunk 滑窗
        ↓
③ 伪时间异步主进程回放（发出 → 进度/观测 → 专家下一 action → 截断）
        ↓
④ 写 trace + media 外存（04）→ 过滤 → SFT / 进 RL 前冷启动
```

原则：**能转才转**；宁可不转 code，勿烂 code。更倾向转换非接触段。

---

## 3.2 改造 ①②：原语标签

**可压缩性启发式（示例）**：低曲率、近匀速、无力尖峰、非接触 → 尝试 MoveL/圆弧等。

**Code 目标优先级**

1. 结构化 `ops[]`（首选，可校验、可重放）  
2. 与 ops 一一对应的短 API 糖  
3. 自由长 Python — 仅 escape hatch  

「最佳 code」= 固定原语下 **重建误差最小 ∧ ops 尽量少**。

**Chunk**：定长 \(H\) 滑窗；与线上 CHUNK 空间一致（EEF delta 等）。

---

## 3.3 改造 ③：伪时间异步构造（关键）

不要输出「整段 code 跑完才有一个 observation」的同步 trace。用与线上一致的主进程：

```text
发出专家 action（code 展开或 chunk）入 queue
主进程按伪时间 k = 0,1,… 步进（示教状态为真值）
每到决策点（步长 s / 延迟 d / 事件）：
    打包 progress_report + 该时刻观测
    取「专家在该点应发出的下一 action」（后续可压段或下一窗）
    截断 queue 尾（§3.3.1：code vs actual 偏离的前/中/后时间启发式）
    写一个 turn
```

| 线上概念 | 离线对应 |
|----------|----------|
| 真时间执行 | 沿示教 \(\tau\) 的伪时间索引 |
| 进度报告 | \(k\)、已消费步数、**code vs actual 偏差**、力/接触 |
| 思考 | SFT 时可无 thought；或蒸馏短 rationale |
| 截断 | 见 §3.3.1（偏离前/中/后启发式）；接触突变可强制截并标 CHUNK |

采集时可对 \(d\) 做**域随机**，贴近真实推理延迟。

### 3.3.1 专家截断点：code seq vs actual 偏离启发式

发出的是 **code 展开轨** \(\hat{x}_{1:L}\)（replay），真值是示教 **actual** \(x_{1:T}\)。逐步偏差：

\[
e_k = \|x_k - \hat{x}_k\|
\quad\text{（或 EE/关节加权；可加力项）}
\]

**偏离时刻** \(k^\star\)：首次 \(e_k > \delta\) 且持续 \(w\) 步（避免噪声抖动）；若整段 \(e_k\le\delta\)，则 \(k^\star\) 可取段末或固定 stride \(s\)。

在 \(k^\star\) 上用**时间启发式**取截断点 \(k_{\mathrm{cut}}\)（写入 `truncate.at_step`）：

| 模式 | 定义 | 用途 |
|------|------|------|
| **前 (before)** | \(k_{\mathrm{cut}} = k^\star - \Delta_{\mathrm{pre}}\)（≥ 上一决策点） | 在明显跑偏前就重规划；模拟「早看早截」 |
| **中 (at)** | \(k_{\mathrm{cut}} = k^\star\) | 偏差刚越阈就截；默认、可解释 |
| **后 (after)** | \(k_{\mathrm{cut}} = k^\star + \Delta_{\mathrm{post}}\)（≤ 段末） | 容忍短偏离再截；贴近高延迟 \(d\) / 慢策略 |

实现建议：

1. 对每段 CODE：算 \(\{e_k\}\)\(\rightarrow k^\star\)。  
2. 训练数据可对 \(\{\Delta_{\mathrm{pre}},\Delta_{\mathrm{post}},\delta\}\) **域随机**，或按比例混 before/at/after，避免策略只学会一种截断节奏。  
3. \(k_{\mathrm{cut}}\) 之后 queue 尾丢弃；该点观测 + progress 开下一 turn（常切 CHUNK 或下一段 CODE）。  
4. 纯 CHUNK 段：无 \(\hat{x}\) 时用固定 \(s\)，或「滑窗终点 / 接触突变」作 \(k^\star\)。  
5. 人工标注可覆盖启发式；规则（力尖峰、碰撞）优先级高于 \(e_k\)。

`truncate.reason`：启发式偏离用 `replan` 或扩展 `diverge_before|at|after`；stride 仍用 `stride`。

---

## 3.4 过滤与导出

保留：`terminal.success`、无 `fault`、CODE turn `rmse<\varepsilon`、truncate 合法。  
失败但后续纠错成功的 multi-turn 可留作修复轨迹（加重纠错 turn）。

导出目录示例：

```text
ep_id/
  trace.json
  media/          # 04
  chunks/*.npy
```

---

## 3.5 与 RL 的衔接

改造后的专家 trace → SFT 冷启动 → **同一 runtime** 上 RL（02），在线继续记同格式 trace。  
不再维护第二套「仅离线同步」标签格式。
# 4. 图片问题：像素进 ctx vs 图文进 ctx

两个正交问题：**(A) 磁盘怎么存**，**(B) 决策时怎么进模型上下文**。

---

## 4.1 磁盘（两者共用）

JSON trace **不** inline 像素 / base64 长序列。

```text
ep_id/
  trace.json
  media/
    cam_front.mp4          # 主存
    cam_front/000024.jpg   # 决策关键帧（可选预抽）
  …
```

- 顶层：`media_root` + `media_manifest`（path, fps, frames）  
- Turn：`images[] = {cam, frame, uri?}` 关键帧引用  
- 段：`video_span` 仅索引，供回放 / 辅助训练，**默认不整段进 VLM**

---

## 4.2 进上下文的两条路线

### 路线 I：`img in ctx`（像素 → vision tokens）

决策点把关键帧喂给视觉编码器，与文本拼接。

| 进什么 | 建议 |
|--------|------|
| 当前决策关键帧 | 必选（1～K 路相机） |
| History 图 | 默认 0～1 张最近 after；多了炸上下文 |
| Chunk 中间帧 | 默认不进；异步中间用 tracker/力 |
| 整段 video | 不进主策略；可另训视频辅助头 |

**适合**：接触、细对齐、需纹理/遮挡判断；与主流 VLA 一致。  
**代价**：上下文与算力随相机数、历史图线性涨；需固定分辨率（如 224/256）。

### 路线 II：`img text in ctx`（图 → 文本描述进 ctx）

决策点**不**把像素送进主策略（或只偶尔送），而是：

```text
感知侧（可另模 / 经典视觉）→ text_scene / tracker 摘要
主策略只读文本 + proprio + progress
```

示例字段：

```text
text_scene: "blue cup @ left; plate center; gripper 3cm above rim; contact=false"
tracker: "obj_cup_rel_ee=[0.02,0.01,0.03]; progress=24/180"
```

**适合**：非接触 CODE 段、长 horizon 规划、省视觉 token；与 code agent「读 stdout」同构。  
**代价**：描述瓶颈——接触微操、未见物体属性易丢；描述器误差直接进策略。

### 路线 III：混合（推荐默认）

| 段 / mode | 视觉进 ctx |
|-----------|------------|
| CODE、远离接触 | **图文为主**（`text_scene` + progress）；可选 1 张低分辨率确认图 |
| CHUNK、接触附近 | **像素关键帧必进**；图文作辅助 |
| History | 只留文本摘要 + progress；旧图不堆 |

Mode 头可同时看「是否有可靠 text_scene」：描述置信低 → 强制拉像素。

---

## 4.3 与异步环的对齐

- **快环**：始终有图（磁盘 + tracker），不等于进主模型。  
- **慢环决策**：按 4.2 选 I/II/III 打包 ctx。  
- Trace 始终存 `images` 引用 + 可选 `text_scene`，以便日后改路线重训而无需重采。

---

## 4.4 训练时注意

- SFT/RL 的 ctx 打包必须与部署一致（同路线、同关键帧数）。  
- 若路线 II：采集改造（03）需跑描述器/ tracker 写进 trace。  
- 若路线 I：DataLoader 只 decode 决策 `images[]`，不要按 `video_span` 默认灌满。  
- 禁止：trace 内嵌整段 JPEG 数组。

---

## 4.5 选型一句话

- 要接触精度、跟 VLA 对齐 → **img in ctx**（混合里 CHUNK 侧）。  
- 要长程 code、控成本 → **img text in ctx**（混合里 CODE 侧）。  
- 默认落地：**混合 III**。
# 5. 推理 I/O 占比 · 训练 Wall-time 数据量

估算用默认参数（可改）；比例按 **token 当量**（连续动作按「等价 token」折算，见注）。

## 5.0 默认参数

| 符号 | 默认 | 含义 |
|------|------|------|
| 控制频率 | 30 Hz | \(\Delta t \approx 33\,\mathrm{ms}\) |
| \(H\) | 30 | CHUNK 长度 ≈ 1.0 s |
| \(s\) | 24 | 决策步长 ≈ 0.8 s / 决策 |
| \(d\) | 6 | 推理延迟预算 ≈ 200 ms |
| \(x\) | 可达 180 | CODE 可 gen 很长，本 turn 常截到 \(\sim s\) |
| 相机 | 2 路 × 256² | 决策关键帧 |
| 视觉编码 | ~256 tok / 图 | 量级；实值随 ViT/分辨率变 |
| History | 文本 2～4 turn；图 0～1 | |
| CoT | 关 / 短（~50 tok） | |
| Episode | ~20 s 墙钟 | ≈ 600 控制步 ≈ 25 决策 |

**决策率**：\(f_{\mathrm{dec}} \approx 1/s_{\mathrm{wall}} \approx 1.25\,\mathrm{Hz}\)（\(s=24@30\mathrm{Hz}\)）。  
策略前向 **只在决策点**；控制步 30 Hz 不跑大模型。

---

## 5.1 单次推理：输入 / 输出占比

### 输入（一次慢环 forward）

**混合视觉（推荐默认）**：CODE 偏图文，CHUNK 偏像素。下表为 **CHUNK 决策**（像素最重）；CODE-only 决策把「视觉像素」换到「图文」行。

| 通道 | Token 当量（约） | 占输入 |
|------|------------------|--------|
| 系统 + API 说明 | 400～800 | 15～25% |
| Task + proprio + progress + truncate 摘要 | 80～150 | 3～5% |
| History 文本（2～4 turn） | 150～400 | 8～15% |
| **视觉像素**（2 图 × 256 tok） | **~512** | **40～55%** |
| 图文 `text_scene` / tracker（辅助） | 30～80 | 2～4% |
| History 图（0～1） | 0～256 | 0～20% |
| **输入合计** | **~1.2k～2.2k** | 100% |

**路线对比（输入侧）**

| `vision_ctx_mode` | 视觉相关占比 | 总输入量级 |
|-------------------|--------------|------------|
| `img`（2 图，无 history 图） | ~45–55% | ~1.5–2.0k tok |
| `img_text`（无像素） | ~5%（描述） | ~0.7–1.2k tok |
| `hybrid` CODE 段 | ~5–15%（描述 ± 1 小图） | ~0.8–1.4k |
| `hybrid` CHUNK 段 | ~45–55%（同 img） | ~1.5–2.0k |

快环采的全帧 **不进** 该表；只进磁盘 / tracker。

### 输出（一次 decode）

| 通道 | Token 当量（约） | 占输出 |
|------|------------------|--------|
| CoT `thought`（关） | 0 | 0% |
| CoT（短开） | 30～80 | 15～40% |
| Mode（CODE/CHUNK） | 1～4 | <2% |
| **CODE `ops[]`** | 40～200（常 ≪ 展开步数） | 若 CODE：50–90% |
| **CHUNK** | \(H\) 维连续 ≈ 折 30～120 tok；或 FAST ~H | 若 CHUNK：60–95% |
| Truncate 标记（若显式） | 5～20 | <10% |

要点：

- **输入被视觉主导**（img/hybrid-CHUNK）；**输出被 action 主导**（CoT 关时几乎 100% action）。  
- CODE：**输出短、语义覆盖长**（gen 180 步只出几十 token ops）→ 输出带宽远低于「每步都出稠密动作」。  
- CHUNK：输出长度 \(\propto H\)，与主流 VLA 同量级。  
- 异步下墙钟 \(\approx d\) 内必须跑完一次 forward；输入 2k tok + 出 100 tok 是延迟预算的主负载。

### 一条 episode 的 I/O 累积（推理侧）

约 25 决策 ×（1.5k in + 0.1k out）≈ **~40k in tok + ~2.5k out tok / episode**（hybrid、CoT 关、无 history 图）。  
相对「每控制步都 VLA」：决策稀释 \(\approx s = 24\times\) → **策略算力约降一个数量级**。

---

## 5.2 训练：每 Wall-time 数据量

分 **SFT（离线 trace）** 与 **RL（在线同环）**。单位：**每 GPU·小时** 量级（单卡示意；多卡近似线性）。

### 假设

| 项 | 示意值 |
|----|--------|
| 决策样本 forward | ~50–150 ms（2 图 + 1.5k ctx，视模型） |
| SFT batch | 有效 8～32 决策 / step（梯度累积后） |
| 优化 step | ~0.5–2 s wall（含 backward） |
| RL：环境实时 | 1× 墙钟；或仿真 5–20× |
| 落盘 | trace JSON 小；mp4/关键帧大 |

### A. SFT（读 03 改造后的异步 trace）

| 量 | 每 wall-hour（单卡示意） |
|----|--------------------------|
| 优化 step | ~2k–5k |
| **决策样本（监督条数）** | **~2万–10万** turn |
| 等价 episode（@25 turn） | ~0.8k–4k ep |
| **进模型的图像张数** | 每 turn 1～2 张 → **~3万–15万** 张 decode |
| Token 吞吐（in+out） | ~5e7–3e8 tok / h（含视觉当量） |
| **磁盘读** | 关键帧 JPEG 为主：~10–50 GB / h（视分辨率与缓存命中）；全 mp4 顺序扫可更高 |
| Trace JSON | ≪1 GB / h（可忽略） |

监督目标占比（loss 时间/算力，非存储）：

| 目标 | 占比（建议） |
|------|----------------|
| CHUNK 回归 / token CE | 40–60%（接触段样本可上采样） |
| CODE 结构 CE | 25–40% |
| Mode 分类 | 5–10% |
| CoT CE | 0%（默认关）或 ≤10% |

### B. RL（部署 01，真机或仿真）

数据按 **墙钟环境时间** 计，再除以并行 env 数。

**单环境、实时（30 Hz 控制，1.25 Hz 决策）**

| 量 | 每 wall-hour |
|----|----------------|
| 控制步 | \(30\times3600 = 1.08\times10^5\) |
| **策略决策 / 记 turn** | \(\approx 1.25\times3600 \approx 4500\) |
| Episode（@20 s） | ~180 |
| 像素进策略 | ~4500–9000 张 / h（1–2 cam） |
| Trace 写入 | ~4500 turn / h；JSON 小 |
| 相机原始流（若全存） | 2 cam × 30 Hz × 3600 ≈ \(2\times10^5\) 帧 / h → **主存储压力在媒体**，不在 trace |

**并行 \(N\) env 或仿真加速 \(\alpha\)**：决策条数 \(\propto N\alpha\)；策略 GPU 易成瓶颈（每决策一次 forward+可选 update）。

**RL 更新**：若每 \(M\) 决策更新一次，则

- 数据采集率：~\(4500\,N\alpha\) turn / wall-h  
- 梯度更新消耗的样本：取决于 replay；on-policy 常 **用满刚采的 turn**  

相对纯稠密 VLA-RL（每步都推断）：本设计策略样本率 \(\approx 1/s\)，**同墙钟下 GPU 上决策数少 ~\(s\) 倍**，但每条决策 ctx 更长（多 turn history + 双原语）。

### C. 存储占比（训练读入 vs 落盘）

| 资产 | 每 episode（约） | 训练时占用角色 |
|------|------------------|----------------|
| `trace.json` | 10–100 KB | 标签 / RL 日志 |
| 决策关键帧 | 25×1～2×50 KB ≈ 1–3 MB | **SFT/RL 主读** |
| 全长 mp4 | 数十～数百 MB | 回放 / 偏离启发式 / 可选；默认不每 step 读 |
| `chunks/*.npy` | CHUNK turn × H × dim × 4 B | CHUNK 监督 |

→ **Wall-time 数据量（进模型）≈ 决策率 × 每决策图像数 × 分辨率**；全视频是采集存档，不是每 hour 训练必读。

---

## 5.3 一张总图

```text
墙钟 1s 控制
  ├─ 30 个 a_t          （低层，无大模型 I/O）
  └─ ~1.25 次决策
        输入:  ~50% 视觉 tok + ~30% 系统/历史文本 + ~20% 进度/任务
        输出:  ~0–30% CoT + ~70–100% mode+action
        落盘:  1 条 turn + 关键帧引用（像素在 media）
```

**训练每 wall-hour**：SFT 冲决策条数（万级 turn/卡）；RL 受环境实时约束（单 env ~千级 turn），靠并行/仿真放大；磁盘小时吞吐由 **关键帧** 决定，不是由整段视频决定。

---

## 5.4 调参对占比的影响（方向）

| 改动 | 输入 | 输出 | 训练数据/wall-h |
|------|------|------|-----------------|
| \(s\uparrow\) | 决策更稀，history 可更长 | 同 | 决策条数 ↓ |
| 相机 2→1 | 视觉占比 ↓ | — | 图像数 ↓ |
| `img_text` | 总 tok ↓ 一半级 | — | decode 图 ↓，可提 step/s |
| 开 CoT | — | 出 tok ↑，延迟 ↑ | SFT 序列更长 |
| CODE 比例 ↑ | — | 出 tok ↓（更短 ops） | 同决策数下算力略降 |

精确数需在目标 backbone 上 profile；本页给 **数量级与占比结构**，便于定 batch、\(s\)、视觉路线。
# 最接近的公开工作

对照本设计四块：**双原语 code+chunk · 异步发出/截断 · 伪时间造数+RL 同环 · agent trace**。  
结论：**没有单一论文覆盖全集**；按维度最像的工作如下。

---

## 总排名（整体形态）

| 秩 | 工作 | 像在哪 | 不像在哪 |
|----|------|--------|----------|
| **1** | **[CaP-X](https://arxiv.org/abs/2603.22435)** / [capgym](https://github.com/capgym/cap-x) | Code agent 控机器人；multi-turn + 执行反馈；**CaP-RL**；文中明确提出 **hybrid CaP–VLA**（code 管逻辑/恢复，VLA 管接触） | 尚未落地「同模型 mode 头双原语」；无伪时间异步造数；无 code↔actual 偏离截断配方 |
| **2** | **[RTC](https://www.pi.website/research/real_time_chunking)** (NeurIPS’25) / [LeRobot](https://huggingface.co/docs/lerobot/rtc) | 异步 chunk、queue、冻前缀/inpainting、边执行边推理 | 仅 CHUNK/flow；无 code 原语、无 agent turn/CoT、无采集伪时间 |
| **3** | **[VLA-Corrector](https://www.alphaxiv.org/abs/2607.01804)** | 执行中监测偏离 → **截断 queue 尾** → 再推理（最像「发出→观测偏差→截断」） | 只针对 VLA chunk；无 code；偏离是视觉 latent，非 code replay vs actual |
| **4** | **[Demo2Code](https://portal.cs.cornell.edu/demo2code/)** | 示教 → 规格 → **可执行机器人 code**（数据改造近亲） | 开环/一次出码为主；无 chunk 原语、无异步 RL 环 |
| **5** | **[CodeAct](https://arxiv.org/abs/2402.01030)** / OpenHands | Thought→code tool→obs 的 **agent trace / CoT** 范式 | 非机器人控制；无 action chunk / RTC |

经典底座（必引、但更「祖先」）：[Code as Policies](https://code-as-policies.github.io/)（CaP）、ACT / π₀ 系 action chunking。

---

## 按本设计维度

### 1. 推理架构（mode / 双原语 / 异步）

| 维度 | 最像 | 备注 |
|------|------|------|
| Code agent + 多轮反馈 | **CaP-X / CaP-Agent0** | 视觉差分、技能库；训练免费 agent |
| 异步 chunk 运行时 | **RTC** | 工业界部署标准答案之一 |
| 自适应 commit / 早截断 | **PACE**、**DVAC**、**ACTDyn**、**BID** | 改执行地平线，不引入 code |
| 偏离触发截断再规划 | **VLA-Corrector** | 最像 truncate 语义 |
| AR↔连续动作双头（非 code） | HybridVLA | 名字像，实为 AR+diffusion，**不是** code+chunk |

CaP-X 原文（未来方向原话级）：*hybrid CaP–VLA policies, coding agent for high-level logic/recovery, VLA for contact-rich low-level* — 与本设计主张同向，但是 **级联两系统**，不是单一 mode 头双原语 + 统一 async queue。

### 2. RL 数据与监督

| 工作 | 关系 |
|------|------|
| **CaP-RL**（CaP-X 内） | 对 **coding agent** 做 GRPO/可验证奖励；sim2real；**最像 02** |
| 通用 VLA-RL / π-RL 等 | 稠密 chunk 上 RL；无 code turn |
| CodeActInstruct | 软件 agent 多轮 SFT 数据形态；可借鉴 trace，非机器人 |

### 3. 采集改造（示教→code/chunk→异步 trace）

| 工作 | 关系 |
|------|------|
| **Demo2Code** | 示教蒸馏成 code：最像 03 的「逆编译」动机 |
| CaP / ProgPrompt 等 | 语言→code；弱示教对齐 |
| **公开缺口** | 「伪时间主进程：发出→进度→专家截断」+ **code replay vs actual 偏离前/中/后** 切 turn — **几乎未见成套公开配方**（最接近的是 VLA-Corrector/PACE 的在线截断启发式，但对象是 chunk 而非 code seq） |

### 4. 图片进 ctx

| 工作 | 关系 |
|------|------|
| CaP-Bench 多档视觉接地 | 抽象 API vs 像素/VLM；接近「图文 vs 图」光谱 |
| 主流 VLA（π₀、OpenVLA） | 纯 **img in ctx** |
| 部分 CaP / 文本场景描述 agent | 偏 **img text** |

混合「CODE 用描述、CHUNK 用像素」少见成文；多为级联（planner 文本 + VLA 像素）。

---

## 一句话定位

> 本设计 ≈ **CaP-X 的 agent/RL 骨架** + **RTC 的异步 chunk 运行时** + **VLA-Corrector/PACE 的截断重规划** + **Demo2Code 的示教→code**，再加 **统一 mode 头** 与 **采集–RL 同构伪时间 trace**（后者公开工作最稀缺）。

优先精读顺序：`CaP-X` → `RTC` → `VLA-Corrector` → `Demo2Code` → `PACE`/`DVAC`。
