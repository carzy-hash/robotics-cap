下面这份方案可以直接交给一个没有任何上下文的新 Agent。它包含项目背景、目标、文件位置、每张图的修改要求、插入位置、验收标准和注意事项。

---

# 任务：改进《主流机器人操作流水线与 CAP》文章的三张黏土风插图

## 一、项目背景

项目目录：

```text
/Users/zhouxiaorui/Desktop/robotics-cap
```

目标文章：

```text
site/ideas/mainstream-robotics-vs-cap.html
```

公共样式：

```text
site/assets/styles.css
```

现有插图目录：

```text
site/assets/illustrations/robotics-cap-points/
```

文章以“把红杯放进托盘”为贯穿案例，面向不了解机器人学习的普通技术读者，对比：

1. 主流 VLA / 动作策略路线。
2. CAP 的受限策略程序与监督端点路线。

当前已经插入三张黏土风插图，但技术表达不够准确。任务不是简单调整位置，而是修改或重新生成图片，使三张图构成连续的信息叙事：

```text
主流系统怎样训练和执行
→ 主流监督能看到什么、看不到什么
→ CAP 怎样增加显式监督端点
```

三张图必须继续使用同一个红杯任务、相近的机械臂形态、蓝/橙/米白配色和黏土材质，让读者明确它们描述的是同一个案例。

---

## 二、Git 状态与工作边界

仓库已有提交：

```text
977e5fc Reorganize article workflow and public site
```

该提交没有包含插图。

当前插图和插图接入修改尚未提交。开始工作前必须检查：

```bash
git status --short --branch
```

不要覆盖或丢弃现有未提交修改。

除非用户另外要求：

- 不要提交 Git commit。
- 不要 push。
- 不要改写文章的核心观点。
- 可以修改目标文章、公共插图样式和目标插图文件。
- 不要修改另外两篇文章的插图。
- 不要删除其他已经生成的 flat、sketch 或 clay 图片。
- 新版本先保留为独立文件，确认效果后再决定是否替换旧文件。

建议新文件使用 `-v2` 后缀，例如：

```text
01-mainstream-pipeline-clay-v2.png
05-supervision-limits-clay-v2.png
10-supervision-endpoints-clay-v2.png
```

这样用户可以对照新旧版本。

---

## 三、开始前需要阅读和检查的内容

完整阅读：

```text
README.md
CONTRIBUTING.md
site/ideas/mainstream-robotics-vs-cap.html
site/assets/styles.css
```

重点阅读文章以下章节：

```text
#one-task
#mainstream
#supervision
#cap
```

检查现有插图：

```text
site/assets/illustrations/robotics-cap-points/01-mainstream-pipeline-clay.png
site/assets/illustrations/robotics-cap-points/05-supervision-limits-clay.png
site/assets/illustrations/robotics-cap-points/10-supervision-endpoints-clay.png
```

还要检查文章中三个 `<figure class="article-figure">` 的当前位置、图注、`alt`、加载方式和图片路径。

生成或编辑图片之前，必须先实际查看三张原图，不能仅根据文件名判断内容。

---

# 四、统一视觉规范

## 4.1 风格

三张图统一采用：

- 手工黏土模型质感。
- 柔和但清楚的棚拍光线。
- 米白色或浅蓝灰背景。
- 主色为蓝色、橙色和米白色。
- 红杯作为贯穿任务目标。
- 同一种桌面机械臂或视觉上高度一致的机械臂。
- 横向 16:9 构图。
- 编辑型技术博客插画，不要做成儿童玩具广告。
- 画面干净，技术关系优先于场景装饰。
- 每张图只保留支持核心论点的对象。

建议尺寸保持与现有图片相近：

```text
1672 × 941
```

如果生成工具无法精确指定，至少保持 16:9 横向比例和足够高的分辨率。

## 4.2 文字原则

尽量不要把长中文直接生成在图片里，原因包括：

- 生成式图片中的中文容易出错。
- 手机缩放后难以阅读。
- 不利于未来制作英文版本。
- 页面已经可以通过图注和 HTML 图例承载文字。

图片内部优先使用：

- 清楚的图标。
- 数字编号。
- 极短且稳定的符号，例如 `01`、`02`。
- 少量代码词，如 `observe()`、`execute()`，但不是必需。

如果使用编号，应由 HTML 图注或紧邻图片的图例解释含义。

## 4.3 信息结构

三张图不能只做到“氛围相关”，必须能够回答明确问题：

| 图片 | 必须回答的问题 |
|---|---|
| 图 1 | 主流机器人动作策略怎样从示范数据走到短动作闭环执行？ |
| 图 2 | 主流训练和评测直接监督哪些信息，哪些中间失败原因仍需倒查？ |
| 图 3 | CAP 在执行过程中增加了哪些显式监督端点，它们怎样形成闭环？ |

---

# 五、图 1 修改方案：主流训练与短动作闭环

## 5.1 当前文件

```text
01-mainstream-pipeline-clay.png
```

## 5.2 当前问题

现有图片大致表现：

```text
人工遥操作
→ 示范画面
→ 模型
→ 动作卡片
→ 机器人成功执行
```

优点是红杯案例清楚、普通读者容易理解。

需要修正的问题：

- 训练阶段和部署阶段混在一起。
- 没有明确表现训练数据由图像、指令、机器人状态和专家动作组成。
- 右侧动作卡片看起来像一次性完整轨迹。
- 没有表现“短动作执行后重新观察”的闭环。
- 图片中直接生成了中文任务文字。
- 模型看起来只吃图像和指令，可能造成训练数据过于简单的误解。

## 5.3 新图必须表达的结构

新图应明确分成左右两部分。

### 左侧：训练阶段

表现：

```text
人类遥操作机械臂完成红杯任务
↓
同步记录：
- 摄像头观察
- 任务指令
- 机器人状态
- 专家动作
↓
训练动作策略
```

视觉元素建议：

- 人类操作者。
- 同一机械臂和红杯。
- 相机画面卡片。
- 机械臂关节或状态图标。
- 一小段专家动作轨迹。
- 多类数据共同进入模型，而不是只有图片进入模型。

### 右侧：部署阶段

表现：

```text
当前观察 + 指令 + 状态
↓
已训练策略
↓
短 Action Chunk
↓
机械臂执行
↓
产生新的相机观察
└────────返回策略
```

必须有一个清楚的反馈回环。

短 Action Chunk 应画成少量连续动作帧，例如 3–5 个局部姿态，避免让人理解成完整长任务轨迹。

## 5.4 建议构图

```text
┌────────训练阶段────────┐       ┌────────部署阶段────────┐
│ 人类遥操作红杯任务       │       │ 当前观察/指令/状态       │
│    ↓                    │       │       ↓                │
│ 图像/状态/专家动作卡片   │ ───→  │ 已训练策略              │
│    ↓                    │       │       ↓                │
│ 动作策略模型             │       │ 短动作 → 执行 → 新观察   │
└────────────────────────┘       │          ↑       │      │
                                 └──────────┴───────┘
```

画面中无需生成这些中文标题。可以通过视觉分区和 HTML 图注解释。

## 5.5 推荐生成/编辑提示词

```text
Create a precise 16:9 horizontal editorial illustration in handcrafted clay style for a robotics technology article.

Use one consistent tabletop robot arm, one red cup, one gray tray, and a blue-orange-cream color palette.

Clearly divide the scene into two connected stages.

LEFT — training:
A human teleoperator controls the robot arm performing the red-cup-to-tray task. Several synchronized data cards are visibly collected together: a camera observation card, a task instruction symbol, a robot joint/state card, and a short expert motion sequence. These different data cards all feed into a blue robot policy model.

RIGHT — deployment:
The trained policy receives a new camera observation, task instruction, and robot state. It outputs only a short action chunk shown as three to five local robot-arm pose cards. The physical robot executes that short action. A camera then observes the new result and sends a clear feedback loop back to the policy.

Make the separation between training and deployment visually unmistakable. Make the feedback loop after execution prominent. Do not imply that the model directly controls high-frequency motors. Do not show a single long open-loop trajectory.

No long text, no Chinese text, no decorative labels, no extra robots, no futuristic holograms. The technical flow must be readable at mobile size. Soft studio lighting, clean background, tactile clay texture.
```

## 5.6 插入位置

将图 1 从当前的 `#one-task` 章节移到：

```html
<section id="mainstream">
```

放在主流流程代码块之后：

```text
真实或仿真示范
→ 图像 + 指令 + 机器人状态 + 专家动作
→ 训练动作策略
→ 观察 → 预测短动作 → 执行 → 再观察
→ 在仿真和真机上统计结果
```

图应紧跟这个代码块，然后才进入对主流系统边界的补充说明。

## 5.7 建议图注

```text
图 1｜主流动作策略通常先从图像、指令、机器人状态与专家动作中学习；部署时预测一小段动作，执行后重新观察，再决定下一段动作。
```

## 5.8 建议 alt

```text
主流机器人动作策略的训练与部署流程：人类遥操作产生图像、指令、机器人状态和专家动作数据，模型学习后通过短动作执行与重新观察形成闭环
```

---

# 六、图 2 重做方案：可见监督与未结构化的失败原因

## 6.1 当前文件

```text
05-supervision-limits-clay.png
```

## 6.2 当前问题

现有图片使用“锁住的柜格”表示隐藏信息。

主要问题：

- 容易被理解成数据保密、访问权限或实验样本被锁住。
- 没有准确区分“直接训练/评测信号”和“需要事后倒查的中间原因”。
- 没有说明行为克隆主要监督的是专家动作。
- 没有表现外围安全规则、成功检测器和恢复模块可能存在。
- 容易对主流路线形成不公平的“只有最终成功率”印象。

因此这张图不建议局部修改，建议重新生成。

## 6.3 新图必须表达的结构

图片分成上下两层或前后台两层。

### 上层：容易直接记录和监督的信号

必须包含：

- 专家动作。
- 模型预测动作。
- 两条动作轨迹的比较。
- 最终成功或失败结果。
- 可选：成功检测器、安全规则等外围模块。

### 下层：存在但未形成统一显式字段的中间原因

必须包含：

- 目标选错。
- 观察不足。
- 约束遗漏。
- 恢复策略错误。

这些不是“完全不可知”，而是分散在：

- 相机日志。
- 模型输出。
- 传感器记录。
- 规划器日志。
- 安全模块日志。

工程师需要事后把它们拼起来。

## 6.4 建议视觉隐喻

不要使用锁和保险柜。

推荐使用“轨迹上层 + 原因剖面层”：

- 上方：专家轨迹、模型轨迹、结果勾或叉。
- 下方：四个断开的原因模块。
- 上下之间只有不完整、断裂或需要人工连接的线。
- 一位工程师查看多块分散屏幕，尝试定位失败原因。
- 外围可以放一个独立安全停止按钮或成功检测器，表示主流系统并非没有额外模块。

核心含义是：

> 中间原因并非神秘消失，而是没有被组织成一条统一、可直接监督的结构化链。

## 6.5 推荐生成提示词

```text
Create a precise 16:9 horizontal editorial illustration in handcrafted clay style for a robotics technology article about supervision limits in mainstream robot learning.

Use the same tabletop robot arm, red cup, gray tray, and blue-orange-cream palette as a companion illustration.

The image must clearly separate two information layers.

TOP LAYER — directly recorded supervision and evaluation:
Show an expert short motion trajectory and a model-predicted short motion trajectory side by side, plus a final task outcome indicator. Include a small independent safety checker or stop module to show that mainstream systems may already have auxiliary safety and success checks.

BOTTOM LAYER — intermediate failure causes that exist but are not organized into one unified supervision trace:
Show four distinct cause modules represented by clear icons:
1. wrong target selection,
2. insufficient observation or occlusion,
3. missing safety or motion constraint,
4. wrong recovery decision.

The four cause modules should connect incompletely to separate camera, planner, sensor, and system logs. A human engineer must inspect and combine several scattered logs to diagnose why the task failed.

Do not use locks, safes, secrecy imagery, or inaccessible cabinets. The issue is fragmented and unstructured supervision, not hidden or forbidden information.

Show one failed red-cup task so the difference between visible trajectory/outcome and uncertain cause is immediately understandable. No long text, no Chinese text, no overly futuristic interface. The causal structure must remain readable on a phone screen. Soft studio light, clean clay materials.
```

## 6.6 插入位置

放在 `#supervision` 章节中，紧跟这段话：

```text
可是目标选错、观察不足、约束漏掉等原因，常常没有统一的显式记录，失败后需要从整个轨迹和外围日志倒查。
```

然后再继续：

```text
一套可信评测至少回答五个白话问题：
```

顺序应为：

```text
解释监督是什么
→ 指出中间原因缺少统一记录
→ 图 2
→ 再列可信评测的五个问题
```

## 6.7 建议图注

```text
图 2｜专家动作、预测轨迹和最终结果通常容易记录；目标选择、观察充分性、约束遗漏与恢复判断则可能分散在不同模块和日志中，需要事后组合分析。
```

## 6.8 建议 alt

```text
主流机器人监督边界示意：上层记录专家动作、预测轨迹和最终结果，下层的目标错误、观察不足、约束遗漏和恢复错误分散在相机、规划器与传感器日志中
```

---

# 七、图 3 重做方案：CAP 六类监督端点闭环

## 7.1 当前文件

```text
10-supervision-endpoints-clay.png
```

## 7.2 当前问题

现有图像使用六个机器人工作站组成横向流水线。

主要问题：

- 六个站点无法与六类监督端点逐一对应。
- 容易被理解成生产工序或六个独立 Agent。
- 没有明确呈现短 Action Chunk 和真实执行。
- 没有形成“执行后重新观察”的反馈闭环。
- 恢复节点没有清楚表现重试、换视角、降级和停止。
- 没有表现不同端点由规则、传感器、仿真物理或模型估计裁决。

因此建议重新生成，而不是只修改图注。

## 7.3 六个监督端点

新图必须严格对应：

1. 目标：杯子和完成条件是否正确。
2. 观察：证据是否充分，是否需要换视角。
3. 约束：碰撞、速度、力和权限是否满足。
4. 调用：动作接口、参数、单位与权限是否合法。
5. 状态：动作后的世界是否符合预期。
6. 恢复：继续、重试、换视角、降级还是停止。

## 7.4 主流程

图中必须清楚表达：

```text
目标
↓
观察
↓
约束
↓
动作调用
↓
短 Action Chunk
↓
机器人执行
↓
状态验证
├─ 成功 → 下一步或完成
└─ 失败 → 恢复
           ├─ 重试
           ├─ 换视角
           ├─ 降级
           └─ 停止
```

如果选择重试或换视角，箭头应回到“观察”或更早的适当节点。

这张图必须是闭环，不是单向生产线。

## 7.5 建议构图

推荐使用环绕中央机器人任务的六节点闭环：

- 中央：机械臂执行红杯放入托盘。
- 外围：六个编号端点。
- 端点 1：靶心图标。
- 端点 2：眼睛或相机图标。
- 端点 3：护盾或边界图标。
- 端点 4：插头、扳手或受限接口图标。
- 端点 5：传感器加勾/叉图标。
- 端点 6：回环箭头与停止分支。
- 端点 4 和端点 5 之间放短 Action Chunk 与实际机械臂执行。
- 端点 6 至少有一个箭头返回端点 2，另有一个清楚的停止出口。

避免画六个独立小机器人；它们会让读者以为存在六个模型。端点应表现成同一任务流程上的检查器。

## 7.6 判定来源

可以在端点旁使用小型图标，而不是文字：

- 尺子或盾牌：确定性规则。
- 传感器波形：传感器/物理结果。
- 相机：视觉估计。
- 人形轮廓：人工抽检。

不要让图片暗示所有端点都由大模型自我判断。

## 7.7 推荐生成提示词

```text
Create a precise 16:9 horizontal editorial infographic in handcrafted clay style for a robotics technology article.

Use the same tabletop robot arm, red cup, gray tray, and blue-orange-cream palette as the companion illustrations.

Place one physical red-cup robot task in the center. Around it, build one clear closed-loop process with exactly six numbered supervision checkpoints. These are checkpoints in one task, not six separate robots or six independent agents.

Checkpoint 1: target selection — use a target icon.
Checkpoint 2: observation sufficiency — use an eye or camera icon, with an optional alternate camera viewpoint.
Checkpoint 3: constraints — use a shield, workspace boundary, collision, speed, or force icon.
Checkpoint 4: action call validation — use a typed connector, plug, wrench, or constrained tool-interface icon.
Between checkpoint 4 and checkpoint 5, show a short action chunk of only a few local arm poses and the physical robot executing it.
Checkpoint 5: state verification — use sensor feedback with a clear pass/fail branch.
Checkpoint 6: recovery — use a loop icon with distinct branches for retry, re-observe, degrade, and stop.

Make one recovery arrow return to the observation checkpoint. Make the stop branch visually unmistakable. Show that deterministic rules, sensor feedback, visual estimation, and optional human review can judge different checkpoints; do not imply that one language model judges everything.

The main visual idea must be a closed observe-check-act-verify-recover loop, not a factory assembly line. Use arrows and spacing that remain readable at mobile width. No long text, no Chinese text, no six miniature robot workers, no decorative machinery that obscures the flow. Soft studio lighting and tactile clay material.
```

## 7.8 插入位置

保留在 `#cap` 章节中，但放在六类端点的文字卡片之后。

即：

```html
<div class="module-grid">
  目标
  观察
  约束
  调用
  状态
  恢复
</div>

<figure>新的图 3</figure>
```

这一位置合适，因为上方六张文字卡可以作为图片的正式图例。

## 7.9 建议图注

```text
图 3｜CAP 沿同一任务流程检查目标、观察、约束、动作调用、执行状态与恢复选择；失败可以触发重新观察、重试、降级或停止，而不是继续执行一条长动作序列。
```

## 7.10 建议 alt

```text
CAP 六类监督端点闭环：依次检查目标、观察、约束和动作调用，执行短 Action Chunk 后验证状态，失败时进入重试、换视角、降级或停止分支
```

---

# 八、HTML 实施要求

每张图片建议使用以下结构：

```html
<figure class="article-figure">
  <a href="../assets/illustrations/robotics-cap-points/IMAGE-v2.png" target="_blank" rel="noopener">
    <img
      src="../assets/illustrations/robotics-cap-points/IMAGE-v2.png"
      alt="准确描述图片信息结构的中文替代文本"
      loading="lazy"
      decoding="async"
    >
  </a>
  <figcaption>
    图 N｜告诉读者应该怎样理解图片的信息结构。
  </figcaption>
</figure>
```

第一张如果进入首屏附近，可以使用：

```html
loading="eager"
```

其余图片使用：

```html
loading="lazy"
```

图片链接允许手机或桌面用户点击查看原图。

不要在 `<figure>` 中加入依赖 JavaScript 的交互。

---

# 九、CSS 检查与可选调整

现有 `.article-figure` 样式已经支持整栏图片，但需要检查：

- 图片是否为 `display: block`。
- 宽度是否为 `100%`。
- 高度是否保持自适应。
- 图注字号是否在手机上可读。
- 图片链接是否不会改变布局。
- 点击图片时是否有适当光标提示。

可以增加：

```css
.article-figure a {
  display: block;
}

.article-figure a img {
  transition: opacity 160ms ease;
}

.article-figure a:hover img {
  opacity: 0.96;
}

.article-figure figcaption {
  max-width: 760px;
}
```

不要添加复杂灯箱，除非用户明确要求。

---

# 十、生成与选择流程

每张图不要直接生成一次就覆盖。

建议步骤：

1. 查看现有图。
2. 按上述规范生成 `v2`。
3. 如果技术结构仍不清楚，再进行一次定向编辑。
4. 优先检查关系和箭头，再检查美术细节。
5. 不要因为画面漂亮而接受概念错误。
6. 将最终候选接入 HTML。
7. 保留旧图，供用户对比。
8. 记录最终选择理由。

选择优先级：

```text
技术准确性
> 手机尺寸下可读性
> 与上下文的衔接
> 三张图的一致性
> 视觉丰富度
```

---

# 十一、验证要求

## 11.1 自动验证

运行：

```bash
./scripts/validate.sh
```

必须通过。

检查所有新图片是否存在：

```bash
test -f site/assets/illustrations/robotics-cap-points/01-mainstream-pipeline-clay-v2.png
test -f site/assets/illustrations/robotics-cap-points/05-supervision-limits-clay-v2.png
test -f site/assets/illustrations/robotics-cap-points/10-supervision-endpoints-clay-v2.png
```

检查 HTML 中没有旧路径残留：

```bash
rg -n '01-mainstream-pipeline-clay|05-supervision-limits-clay|10-supervision-endpoints-clay' \
  site/ideas/mainstream-robotics-vs-cap.html
```

确认引用的是预期 `v2` 文件。

## 11.2 桌面端检查

检查：

- 三张图片都加载成功。
- 没有横向滚动。
- 图 1 的反馈箭头清楚。
- 图 2 能一眼区分“直接监督”和“分散原因”。
- 图 3 能一眼看出六端点闭环。
- 图注不会被误认为正文。
- 图片与段落之间的上下间距一致。

## 11.3 手机端检查

至少在约 `390 × 844` 的视口检查：

- 图中的主要流程仍然可辨认。
- 不依赖图片内的小字才能理解。
- 箭头没有细到不可见。
- 三张图都可以点击打开原图。
- 页面没有横向溢出。
- 图注字号和行距足够。
- 图 3 的六个端点不会缩成无法辨别的一排小物件。

## 11.4 内容验收问题

### 图 1

不给读者看图注时，他是否能回答：

- 哪一部分是训练？
- 哪一部分是部署？
- 模型是否只输出短动作？
- 执行后是否重新观察？

四项都应为“能”。

### 图 2

不给读者看图注时，他是否能回答：

- 哪些信号可以直接记录？
- 哪些失败原因需要从多个日志中倒查？
- 图片是否避免暗示这些信息是“被保密或禁止访问”？
- 图片是否承认主流系统可以有额外安全或成功检查器？

四项都应为“能”。

### 图 3

不给读者看图注时，他是否能回答：

- 这是一个任务的六个检查点，还是六个独立机器人？
- 执行动作前检查了什么？
- 动作执行后如何验证？
- 失败后可以怎样恢复？
- 流程是否会回到重新观察？

答案必须明确指向“一个任务的闭环”。

---

# 十二、最终交付内容

完成后应向用户提供：

1. 修改后的文章预览链接。
2. 三张新图的直接预览或文件链接。
3. 每张图相对于旧版解决了什么问题。
4. 自动验证结果。
5. 桌面端和手机端检查结果。
6. Git 状态说明。
7. 明确说明修改是否已经 commit。

建议最终汇报格式：

```text
已完成《主流机器人操作流水线与 CAP》的三张插图改版：

- 图 1：拆分训练与部署，并增加短动作执行后的观察闭环。
- 图 2：移除“锁住信息”的隐喻，改为直接监督与分散失败原因的两层结构。
- 图 3：改成严格对应六类监督端点的执行闭环。

文章预览：
<链接>

验证：
- validate.sh：通过
- 桌面端：通过
- 390px 手机视口：通过
- 横向溢出：无
- 图片点击查看原图：可用

Git：
- 新图片和文章接入修改尚未提交。
```

---

# 十三、禁止事项

- 不要只修改图注而保留明显错误的图像结构。
- 不要把主流路线画成完全没有安全规则、恢复模块或闭环。
- 不要暗示 CAP 主策略直接控制高频电机。
- 不要把 Action Chunk 完全移除；CAP 仍然需要短动作。
- 不要把 CAP 的六个端点画成六个独立 Agent。
- 不要用保险柜、锁或保密图标表现“缺少结构化监督”。
- 不要生成大量中文文字到图片中。
- 不要让画面装饰物比流程箭头更显眼。
- 不要在未确认效果前覆盖旧图片。
- 不要修改另外两篇文章。
- 不要未经用户要求提交或推送这些插图修改。