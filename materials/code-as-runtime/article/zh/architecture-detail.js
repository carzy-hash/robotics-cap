class ArchitectureDetail extends HTMLElement {
  connectedCallback() {
    const variant = this.dataset.variant || 'flow';
    this.innerHTML = `
      <section class="architecture-block detail-${variant}" aria-labelledby="architecture-heading">
        <header class="section-intro">
          <p class="eyebrow">01 · Code as Runtime 的含义</p>
          <h2 id="architecture-heading">两次 Agent 更新之间，<br>运行时继续执行。</h2>
          <p>主 Agent 按自身决策节奏更新控制方案。每轮可以运行动作构建器、安装或修改事件处理器，或保持当前运行时不变。Agent 编写的代码只能向运行时仲裁器提交类型明确的队列更新请求。它不能直接控制执行机构，也不能直接写入当前生效的 Action Queue。</p>
        </header>

        <div class="argument-grid">
          <div><small>决策类型</small><h3>四种明确输出</h3><p><code>CONTINUE</code>、<code>RUN_ANALYSIS</code>、<code>EMIT</code> 或 <code>UPDATE_HANDLER</code>。<code>CONTINUE</code> 是写入轨迹的显式空操作，不是缺少决策。</p></div>
          <div><small>队列所有权</small><h3>唯一写入者</h3><p>Agent 编写的代码只提交类型明确的更新。只有运行时仲裁器能够验证、排序并写入当前生效的 Action Queue。</p></div>
          <div><small>事件处理器生命周期</small><h3>受限执行</h3><p>每个事件处理器都声明作用域、触发条件、截止时间、过期条件和能力边界，不能超出或越过这份契约。</p></div>
        </div>

        <aside class="data-principle"><b>必要的安全边界</b><p>Agent 编写的代码可以读取类型明确的观测并调用能力受限的运行时 API，但不能修改运行时执行引擎、调度器、队列仲裁器、执行机构接口、操作员停止通道或安全限值。它也不能直接访问文件、网络、进程、凭据或安全配置。独立安全控制器可以拒绝或取消任何运动。下文的频率、阈值和时间均为示例；部署前必须完成标定、不确定性界限和停止距离分析。</p></aside>

        <figure class="module-figure circuit-figure-v2">
          <img class="module-wash" src="../assets/nervous-system-v1.png" alt="">
          <svg viewBox="0 0 1440 660" role="img" aria-labelledby="circuit-title circuit-desc">
            <title id="circuit-title">主 Agent 生成动作构建代码和快速事件处理代码</title>
            <desc id="circuit-desc">稀疏关键观测进入主 Agent；香蕉示例采用仅供说明的约 1 Hz 审查频率。Agent 编写两类受限代码：一类提出常规 Action Chunk，另一类在两次 Agent 决策之间处理指定事件。两类代码都向运行时仲裁器提交类型明确的更新，由仲裁器验证后原子写入 Action Queue。</desc>
            <defs>
              <filter id="circuit-soft-${variant}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="25"/></filter>
              <marker id="circuit-arrow-main-${variant}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#d45a43"/></marker>
              <marker id="circuit-arrow-fast-${variant}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#328ca0"/></marker>
              <marker id="circuit-arrow-feedback-${variant}" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0L9 4.5L0 9Z" fill="#7b8178"/></marker>
            </defs>

            <path class="circuit-ghost" d="M35 116C213 36 364 63 500 111S797 167 940 90S1232 37 1408 111"/>
            <path class="circuit-ghost warm" d="M28 586C220 646 371 616 540 569S853 524 1016 584S1290 631 1411 570"/>
            <g class="circuit-clusters">
              <rect x="54" y="61" width="194" height="490" rx="28" class="input-cluster-panel"/>
              <rect x="700" y="61" width="507" height="272" rx="28" class="action-cluster-panel"/>
              <text x="726" y="91" class="module-kicker">常规动作路径</text>
              <rect x="630" y="370" width="510" height="174" rx="28" class="fast-cluster-panel"/>
              <text x="656" y="399" class="module-kicker fast-text">快速响应路径</text>
            </g>

            <g class="observation-stream" transform="translate(84 84)">
              <text x="0" y="0" class="module-kicker">观测</text>
              <text x="0" y="25" class="module-note">视觉 · 关节 · 力 · 触觉</text>
              <path d="M25 66L25 446"/>
              <circle cx="25" cy="72" r="9"/><circle cx="25" cy="105" r="5"/><circle cx="25" cy="138" r="5"/><circle cx="25" cy="171" r="5"/><circle cx="25" cy="204" r="9"/><circle cx="25" cy="237" r="5"/><circle cx="25" cy="270" r="5"/><circle cx="25" cy="303" r="5"/><circle cx="25" cy="336" r="9"/><circle cx="25" cy="369" r="5"/><circle cx="25" cy="402" r="5"/><circle cx="25" cy="435" r="5"/>
              <text x="52" y="78" class="module-note">选定关键帧 → Agent</text>
              <text x="52" y="457" class="module-note">所有事件 → 已安装的事件处理器</text>
            </g>

            <path class="keyframe-route" d="M116 156C220 151 268 181 340 200" marker-end="url(#circuit-arrow-main-${variant})"/>
            <text x="195" y="137" class="circuit-frequency main-frequency">示例 · 约 1 Hz 审查</text>
            <g class="main-agent-circuit" transform="translate(465 218)">
              <rect x="-130" y="-92" width="260" height="184" rx="30" class="circuit-agent-glow" filter="url(#circuit-soft-${variant})"/>
              <rect x="-114" y="-72" width="228" height="144" rx="20" class="agent-block"/>
              <text x="0" y="-27" class="module-kicker light">主 AGENT</text>
              <text x="0" y="11" class="module-large light">决策</text>
              <text x="0" y="42" class="module-note light">读取上下文 · 编写代码</text>
            </g>

            <path class="code-authoring main-code-route" d="M580 198C648 160 685 151 739 159" marker-end="url(#circuit-arrow-main-${variant})"/>
            <text x="625" y="139" class="circuit-frequency main-frequency">编写代码</text>
            <g class="code-artifact action-code" transform="translate(826 166)">
              <rect x="-75" y="-63" width="150" height="126" rx="23" class="artifact-halo"/>
              <rect x="-62" y="-51" width="124" height="102" rx="15" class="artifact-body"/>
              <text x="0" y="-8" class="module-kicker light">动作</text>
              <text x="0" y="16" class="module-kicker light">构建器</text>
              <text x="0" y="40" class="module-note light">代码产物</text>
            </g>

            <path class="chunk-build-route" d="M894 176C962 183 988 228 1048 248" marker-end="url(#circuit-arrow-main-${variant})"/>
            <g class="chunk-sequence" transform="translate(1017 213)">
              <text x="-8" y="-29" class="module-kicker">决策时运行</text>
              <text x="-8" y="-8" class="module-note">构建 Action Chunk</text>
              <rect x="16" y="29" width="25" height="22" rx="5"/><rect x="48" y="38" width="25" height="22" rx="5"/><rect x="80" y="43" width="25" height="22" rx="5"/><rect x="112" y="42" width="25" height="22" rx="5"/><rect x="144" y="36" width="25" height="22" rx="5"/>
            </g>

            <path class="code-authoring handler-code-route" d="M508 331C540 395 603 428 666 439" marker-end="url(#circuit-arrow-fast-${variant})"/>
            <text x="526" y="388" class="circuit-frequency fast-frequency">编写并安装代码</text>
            <g class="code-artifact handler-code" transform="translate(752 456)">
              <rect x="-75" y="-63" width="150" height="126" rx="23" class="artifact-halo"/>
              <rect x="-62" y="-51" width="124" height="102" rx="15" class="artifact-body"/>
              <text x="0" y="-9" class="module-kicker light">快速</text>
              <text x="0" y="15" class="module-kicker light">事件处理器</text>
              <text x="0" y="40" class="module-note light">代码产物</text>
            </g>

            <path class="all-event-route" d="M116 491C280 550 471 544 651 480" marker-end="url(#circuit-arrow-fast-${variant})"/>
            <g class="dense-pulses"><circle cx="218" cy="520" r="5"/><circle cx="254" cy="530" r="5"/><circle cx="292" cy="537" r="5"/><circle cx="331" cy="541" r="5"/><circle cx="371" cy="541" r="5"/><circle cx="411" cy="537" r="5"/><circle cx="451" cy="529" r="5"/></g>
            <text x="300" y="570" class="circuit-frequency fast-frequency">选定频率 · Agent 未见的观测</text>

            <g class="handler-runtime" transform="translate(924 458)">
              <rect x="-48" y="-38" width="96" height="76" rx="14"/>
              <text x="0" y="-5" class="module-kicker">运行</text>
              <text x="0" y="19" class="module-note">每个事件</text>
            </g>
            <path class="handler-exec-route" d="M818 458C847 458 857 458 870 458" marker-end="url(#circuit-arrow-fast-${variant})"/>
            <path class="fast-mutation-route" d="M974 449C1040 432 1084 390 1121 348" marker-end="url(#circuit-arrow-fast-${variant})"/>
            <text x="1008" y="419" class="module-note fast-text">请求截断 · 替换</text>
            <text x="1021" y="439" class="module-note fast-text">或经验证的快速 Action Chunk</text>
            <path class="chunk-build-route" d="M1184 263C1199 267 1202 275 1200 282" marker-end="url(#circuit-arrow-main-${variant})"/>

            <g class="shared-queue" transform="translate(1196 299)">
              <rect x="-88" y="-18" width="194" height="72" rx="16" class="queue-frame"/>
              <rect x="-68" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="-34" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="0" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="34" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="68" y="7" width="27" height="23" rx="5" class="queue-slot"/>
              <text x="-65" y="86" class="module-kicker">队列仲裁器</text>
              <text x="-62" y="109" class="module-note">验证 · 原子提交</text>
            </g>
            <g class="circuit-robot" transform="translate(1350 271)">
              <circle cx="0" cy="86" r="29"/><path d="M0 58L-34 9L8 -34L50 -7"/><circle cx="-34" cy="9" r="15"/><circle cx="8" cy="-34" r="15"/><path d="M50 -7L67 10M50 -7L70 -18"/>
              <text x="-31" y="142" class="module-kicker">机器人</text>
            </g>
            <path class="robot-consume-route" d="M1298 298C1320 290 1323 289 1329 286" marker-end="url(#circuit-arrow-main-${variant})"/>

            <path class="feedback-route" d="M1128 514C1039 617 773 622 594 538C505 496 449 411 461 337" marker-end="url(#circuit-arrow-feedback-${variant})"/>
            <text x="668" y="624" class="module-note">下次唤醒：最新帧、队列状态、事件处理器事件和 stdout 返回上下文</text>
            <g class="feedback-nodes"><circle cx="1025" cy="583" r="6"/><circle cx="963" cy="603" r="6"/><circle cx="897" cy="611" r="6"/></g>
          </svg>

          <div class="module-mobile-summary circuit-mobile-summary">
            <p><b>1 · 主 Agent</b><span>按决策节奏读取最新 observation、历史摘要、queue 状态与 handler stdout；香蕉示例约 1Hz。它是 runtime 的唯一代码作者。</span></p>
            <p><b>2 · 动作构建代码</b><span>构建正常的 approach、grasp、transport 和 release Action Chunk，再提交类型明确的 queue-update request。</span></p>
            <p><b>3 · 快速事件处理代码</b><span>仅在明确的任务作用域、事件触发条件、deadline 和 expiry 内运行。示例中的 20 Hz 仅用于说明。</span></p>
            <p><b>4 · 队列仲裁器</b><span>验证、排序并原子提交接受的更新。机器人只消费一条 live queue；Agent-written code 不直接写入。</span></p>
          </div>
          <figcaption>事件处理器路径在两次模型决策之间持续处理指定输入。它可以请求受限的 Action Queue 更新并返回事件结果，但只有运行时仲裁器能写入当前生效的队列。</figcaption>
        </figure>

      </section>

      <section class="context-block" aria-labelledby="context-heading">
        <header class="section-intro narrow">
          <p class="eyebrow">02 · 持续存在的内容</p>
          <h2 id="context-heading">上下文描述的，<br>是运行时的可执行状态。</h2>
          <p>每轮只加入最新观测与本轮变化，并保留足以继续执行的关键状态：任务约束、少量关键帧、Action Queue 余量、当前代码、处理器事件和最近决策。Agent 因而能判断现有运行时是否仍然有效，以及下一步应该保持、补写还是替换它。</p>
        </header>
        <div class="context-river" role="group" aria-label="贯穿香蕉任务的 Agent 长上下文组成">
          <div class="context-anchor"><small>固定</small><b>任务 + 安全契约</b><span>拿起香蕉并放进碗里。</span></div>
          <div><small>视觉</small><b>最新观测 + 选定历史</b><span>当前多相机帧；必要时保留最近的事后帧。</span></div>
          <div><small>状态</small><b>运行时进度 + Action Queue</b><span>已执行前缀、剩余时域和最近一次截断。</span></div>
          <div><small>代码</small><b>已安装代码 + 工具输出</b><span>SAM 3、多视角融合输出与 TAP 防护器版本。</span></div>
          <div><small>执行轨迹</small><b>最近的运行时决策</b><span>最近 2–4 次决策、理由与自检。</span></div>
        </div>
      </section>

      <section class="episode-block" aria-labelledby="episode-heading">
        <header class="section-intro">
          <p class="eyebrow">03 · 香蕉入碗 · 运行时演化</p>
          <h2 id="episode-heading">只有当前计划不再适合环境时，<br>才修改运行时。</h2>
          <p><code>banana-demo-01</code> 展示同一任务回合的在线执行视图；<a href="data.html">真机数据 SFT 札记</a>则展示它的离线投影视图。阶段名称是事后阅读标签，决策依据只是可观察摘要，不是隐藏思维链。下文合并两次相同的接近审查，使每一行对应一种不同的状态转换。</p>
        </header>

        <div class="episode-track">
          ${this.stage({
            number: '00', time: 't = 0.0s', title: '开始接近', decision: 'RUN_ANALYSIS + EMIT',
            observation: 'Front / wrist camera 看见香蕉与碗；queue 为空；gripper 打开；无接触。',
            thought: '先把语义 mask 变成可执行几何。香蕉 pose 稳定且直线路径无碰撞，可以一次 EMIT 决策覆盖数秒的接近动作，避免逐帧生成动作。',
            code: `banana = sam3.segment(front, "banana")\nbowl = sam3.segment(front, "bowl")\nT_banana = fuse_pose(front, wrist, banana)\nchunk = approach(T_banana, stop=0.08, horizon=3.0)\nruntime.submit(QueueUpdate.replace(chunk))`,
            queue: '写入约 3 秒 approach Chunk；robot 立即开始消费。',
            check: 'mask confidence ≥ 0.84 · workspace clear · endpoint 距香蕉 8cm · queue horizon 3.0s',
            next: '下一次主 Agent 决策到来前，已安装的 runtime 持续记录 tracker、关节与力。'
          })}
          ${this.stage({
            number: '01', time: 't ≈ 1.0–2.0s', title: '接近阶段审查', decision: 'CONTINUE × 2',
            observation: '两次审查中，图像都与预测轨迹一致，力信号正常，队列可覆盖下一决策点；剩余时长从约 2.1 秒降至 1.2 秒。',
            thought: '同一 Action Chunk 在两次审查中都保持有效。每轮都记录为何无需更新队列，而运行时继续执行。',
            code: `return CONTINUE(\n  reason="tracking stable; queue horizon sufficient",\n  queue_mutation=None\n)`,
            queue: '两次显式空操作。原 Action Chunk 跨越三个 Agent 决策周期，不追加也不替换。',
            check: '位置误差 1.4 → 1.1 cm · 无遮挡 · 无接触 · 剩余时长充足',
            next: '每次审查都把 CONTINUE 和自检写入轨迹；下一轮重点检查抓取范围。'
          })}
          ${this.stage({
            number: '02', time: 't ≈ 2.8s', title: '接近香蕉', decision: 'EMIT GRASP',
            observation: '最新图像显示夹爪进入抓取范围；距离约 6.5cm；approach 尾部若继续执行会越过新的 pre-grasp。',
            thought: '当前 observation 表明原动作已经失效。只保留 validated stopping horizon 内已经提交的前缀，截掉 approach 尾部，再用近距离视觉和力基线生成 grasp。',
            code: `T_grasp = refine_grasp(wrist, T_banana)\nprefix = runtime.committed_stopping_prefix()\ngrasp = grasp_chunk(T_grasp, force_limit=12.0)\nruntime.submit(QueueUpdate.replace_tail(prefix, grasp))`,
            queue: '请求替换 validated stopping prefix 之后尚未提交的尾部；runtime arbiter 决定接受或拒绝。',
            check: 'grasp pose reachable · gripper aperture valid · force baseline clean · blend jerk within limit',
            next: '夹爪闭合后，新 observation 与 force result 进入下一轮 Agent 决策。'
          })}
          ${this.stage({
            number: '03', time: 't ≈ 3.6s', title: '持物并安装保护器', decision: 'UPDATE_HANDLER',
            observation: 'gripper 已闭合；力信号符合持物；手部相机中香蕉与夹爪暂时相对稳定。',
            thought: '正常 transport 可以等下一轮主 Agent 生成，但掉落风险可能在此前变化。因此安装一个 task-scoped TAP guard，明确其 trigger、deadline、expiry 和受限 queue-update 能力。',
            code: `@on_frame(rate=20, scope="transport", expires="release")\ndef tap_drop_guard(obs):\n    rel = tap.relative_motion(obs.wrist, "banana", "gripper")\n    if rel.slip > 0.018 or obs.force.spike:\n        return QueueUpdate.replace(stabilize_or_retract(obs),\n                                   reason="drop-risk")`,
            queue: '安装带版本和任务作用域的 handler。触发时只提交恢复请求，由 runtime arbiter 验证并排序。',
            check: 'grasp force in band · TAP lock acquired · relative motion stable for N frames',
            next: 'guard 安装结果和最近 TAP 统计进入长上下文；主 Agent 准备 transport。'
          }, true)}
          ${this.stage({
            number: '04', time: 't ≈ 4.2–7.0s', title: '搬运', decision: 'EMIT → CONTINUE',
            observation: '香蕉稳定在夹爪中；多相机融合得到碗口 pose；TAP guard active；queue 需要新任务动作。',
            thought: '路径可安全跨越桌面，提交 move-to-bowl Action Chunk。之后每轮决策检查香蕉是否仍在手中、轨迹是否有效、queue 是否足够；条件不变时只返回 CONTINUE，让现有 runtime 继续。',
            code: `T_bowl = fuse_pose(front, wrist, bowl)\ntransport = move_to_bowl(T_bowl, clearance=0.14)\nruntime.submit(QueueUpdate.append(transport))\n\n# later reviews\nif held and path_valid and queue.remaining > 1.0:\n    return CONTINUE(queue_mutation=None)`,
            queue: '主 Agent 发射 transport；后续一个或多个 CONTINUE 保持其连续。TAP 只在异常时抢占。',
            check: 'banana held · bowl confidence stable · clearance > 10cm · queue horizon 足够',
            next: '进入碗上方 release volume 后，最新 observation 触发安全释放审查。'
          })}
          ${this.stage({
            number: '05', time: 't ≈ 7.4s', title: '释放并验证', decision: 'RUN_ANALYSIS + EMIT',
            observation: '夹爪位于碗上方；香蕉仍被 TAP 跟踪；末端速度低；碗口 mask 与深度一致。',
            thought: '必须同时满足位置、持物与动态安全条件才能释放。确认后生成短 release Chunk；执行后等待新 observation，再判断香蕉是否进入碗。',
            code: `permit = safety_controller.authorize_release(\n    ee=ee, target=bowl, held=tap.is_held("banana")\n)\nif permit:\n    runtime.submit(QueueUpdate.replace_tail(\n        release_chunk(open_to=0.085), permit=permit))\n\n# next observation\nsuccess = banana_in_bowl(front) and gripper.is_open`,
            queue: '携带当前 safety permit 请求 release。permit 缺失或过期时 queue 保持不变，机器人继续保持或停止。',
            check: 'inside bowl volume · low velocity · no slip · release executed · banana mask remains in bowl',
            next: '只有 after-observation 通过，episode 才写 terminal.success=true；否则重新分析与恢复。'
          })}
        </div>
      </section>
    `;
  }

  stage(stage, fast = false) {
    return `
      <article class="episode-stage${fast ? ' has-fast-code' : ''}">
        <div class="stage-marker"><span>${stage.number}</span><i></i><small>${stage.time}</small></div>
        <header class="stage-heading"><p>${stage.title}</p><h3>${stage.decision}</h3></header>
        <div class="stage-body">
          <div class="reasoning-column">
            <div class="trace-field"><b>新观测</b><p>${stage.observation}</p></div>
            <div class="trace-field thought-field"><b>决策依据</b><p>${stage.thought}</p></div>
          </div>
          <div class="code-column">
            <b>生成/执行的代码</b>
            <pre><code>${stage.code}</code></pre>
          </div>
          <div class="effect-column">
            <div class="trace-field"><b>Action Queue 变化</b><p>${stage.queue}</p></div>
            <div class="trace-field self-check"><b>自检</b><p>${stage.check}</p></div>
            <div class="trace-field next-turn"><b>下一个运行时事件</b><p>${stage.next}</p></div>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define('architecture-detail', ArchitectureDetail);
