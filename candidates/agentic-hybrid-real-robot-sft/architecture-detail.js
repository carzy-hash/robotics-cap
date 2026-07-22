class ArchitectureDetail extends HTMLElement {
  connectedCallback() {
    const variant = this.dataset.variant || 'flow';
    this.innerHTML = `
      <section class="architecture-block detail-${variant}" aria-labelledby="architecture-heading">
        <header class="section-intro">
          <p class="eyebrow">01 · Runtime shape</p>
          <h2 id="architecture-heading">一个主 Agent，<br>写出两类可执行代码。</h2>
          <p>主 Agent 不追逐每一帧。它用代码构建正常 Action Chunk，也用代码安装高频 handler。前者形成任务动作，后者在两次思考之间处理 Agent 尚未看到的新 observation；两条路径最终维护同一个 Action Queue。</p>
        </header>

        <figure class="module-figure circuit-figure-v2">
          <img class="module-wash" src="assets/nervous-system-v1.png" alt="">
          <svg viewBox="0 0 1440 660" role="img" aria-labelledby="circuit-title circuit-desc">
            <title id="circuit-title">一个主 Agent 写出 Action-building code 和 fast-handler code</title>
            <desc id="circuit-desc">稀疏关键 observation 进入约一赫兹的主 Agent。Agent 写出两类代码：一类构建正常 Action Chunk，另一类安装为二十赫兹以上的快速 handler。快速 handler 处理 Agent 两次醒来之间没有及时看到的输入，并与 Action-building code 共同维护 Action Queue。</desc>
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
              <text x="726" y="91" class="module-kicker">NORMAL ACTION PATH</text>
              <rect x="630" y="370" width="510" height="174" rx="28" class="fast-cluster-panel"/>
              <text x="656" y="399" class="module-kicker fast-text">FAST RESPONSE PATH</text>
            </g>

            <g class="observation-stream" transform="translate(84 84)">
              <text x="0" y="0" class="module-kicker">OBSERVATIONS</text>
              <text x="0" y="25" class="module-note">vision · joints · force · tactile</text>
              <path d="M25 66L25 446"/>
              <circle cx="25" cy="72" r="9"/><circle cx="25" cy="105" r="5"/><circle cx="25" cy="138" r="5"/><circle cx="25" cy="171" r="5"/><circle cx="25" cy="204" r="9"/><circle cx="25" cy="237" r="5"/><circle cx="25" cy="270" r="5"/><circle cx="25" cy="303" r="5"/><circle cx="25" cy="336" r="9"/><circle cx="25" cy="369" r="5"/><circle cx="25" cy="402" r="5"/><circle cx="25" cy="435" r="5"/>
              <text x="52" y="78" class="module-note">selected keyframe → Agent</text>
              <text x="52" y="457" class="module-note">all events → installed handler</text>
            </g>

            <path class="keyframe-route" d="M116 156C220 151 268 181 340 200" marker-end="url(#circuit-arrow-main-${variant})"/>
            <text x="195" y="137" class="circuit-frequency main-frequency">≈ 1 Hz review</text>
            <g class="main-agent-circuit" transform="translate(465 218)">
              <rect x="-130" y="-92" width="260" height="184" rx="30" class="circuit-agent-glow" filter="url(#circuit-soft-${variant})"/>
              <rect x="-114" y="-72" width="228" height="144" rx="20" class="agent-block"/>
              <text x="0" y="-27" class="module-kicker light">MAIN AGENT</text>
              <text x="0" y="11" class="module-large light">think</text>
              <text x="0" y="42" class="module-note light">reads context · writes code</text>
            </g>

            <path class="code-authoring main-code-route" d="M580 198C648 160 685 151 739 159" marker-end="url(#circuit-arrow-main-${variant})"/>
            <text x="625" y="139" class="circuit-frequency main-frequency">writes code</text>
            <g class="code-artifact action-code" transform="translate(826 166)">
              <rect x="-75" y="-63" width="150" height="126" rx="23" class="artifact-halo"/>
              <rect x="-62" y="-51" width="124" height="102" rx="15" class="artifact-body"/>
              <text x="0" y="-8" class="module-kicker light">ACTION</text>
              <text x="0" y="16" class="module-kicker light">BUILDER</text>
              <text x="0" y="40" class="module-note light">code artifact</text>
            </g>

            <path class="chunk-build-route" d="M894 176C962 183 988 228 1048 248" marker-end="url(#circuit-arrow-main-${variant})"/>
            <g class="chunk-sequence" transform="translate(1017 213)">
              <text x="-8" y="-29" class="module-kicker">RUN AT DECISION</text>
              <text x="-8" y="-8" class="module-note">construct Action Chunk</text>
              <rect x="16" y="29" width="25" height="22" rx="5"/><rect x="48" y="38" width="25" height="22" rx="5"/><rect x="80" y="43" width="25" height="22" rx="5"/><rect x="112" y="42" width="25" height="22" rx="5"/><rect x="144" y="36" width="25" height="22" rx="5"/>
            </g>

            <path class="code-authoring handler-code-route" d="M508 331C540 395 603 428 666 439" marker-end="url(#circuit-arrow-fast-${variant})"/>
            <text x="526" y="388" class="circuit-frequency fast-frequency">writes + installs code</text>
            <g class="code-artifact handler-code" transform="translate(752 456)">
              <rect x="-75" y="-63" width="150" height="126" rx="23" class="artifact-halo"/>
              <rect x="-62" y="-51" width="124" height="102" rx="15" class="artifact-body"/>
              <text x="0" y="-9" class="module-kicker light">FAST</text>
              <text x="0" y="15" class="module-kicker light">HANDLER</text>
              <text x="0" y="40" class="module-note light">code artifact</text>
            </g>

            <path class="all-event-route" d="M116 491C280 550 471 544 651 480" marker-end="url(#circuit-arrow-fast-${variant})"/>
            <g class="dense-pulses"><circle cx="218" cy="520" r="5"/><circle cx="254" cy="530" r="5"/><circle cx="292" cy="537" r="5"/><circle cx="331" cy="541" r="5"/><circle cx="371" cy="541" r="5"/><circle cx="411" cy="537" r="5"/><circle cx="451" cy="529" r="5"/></g>
            <text x="300" y="570" class="circuit-frequency fast-frequency">20Hz+ · observations the Agent has not inspected yet</text>

            <g class="handler-runtime" transform="translate(924 458)">
              <rect x="-48" y="-38" width="96" height="76" rx="14"/>
              <text x="0" y="-5" class="module-kicker">RUN</text>
              <text x="0" y="19" class="module-note">every event</text>
            </g>
            <path class="handler-exec-route" d="M818 458C847 458 857 458 870 458" marker-end="url(#circuit-arrow-fast-${variant})"/>
            <path class="fast-mutation-route" d="M974 449C1040 432 1084 390 1121 348" marker-end="url(#circuit-arrow-fast-${variant})"/>
            <text x="1008" y="419" class="module-note fast-text">clear · truncate · overwrite</text>
            <text x="1021" y="439" class="module-note fast-text">or build a fast chunk</text>
            <path class="chunk-build-route" d="M1184 263C1199 267 1202 275 1200 282" marker-end="url(#circuit-arrow-main-${variant})"/>

            <g class="shared-queue" transform="translate(1196 299)">
              <rect x="-88" y="-18" width="194" height="72" rx="16" class="queue-frame"/>
              <rect x="-68" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="-34" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="0" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="34" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="68" y="7" width="27" height="23" rx="5" class="queue-slot"/>
              <text x="-65" y="86" class="module-kicker">ONE ACTION QUEUE</text>
              <text x="-62" y="109" class="module-note">both code paths mutate here</text>
            </g>
            <g class="circuit-robot" transform="translate(1350 271)">
              <circle cx="0" cy="86" r="29"/><path d="M0 58L-34 9L8 -34L50 -7"/><circle cx="-34" cy="9" r="15"/><circle cx="8" cy="-34" r="15"/><path d="M50 -7L67 10M50 -7L70 -18"/>
              <text x="-31" y="142" class="module-kicker">ROBOT</text>
            </g>
            <path class="robot-consume-route" d="M1298 298C1320 290 1323 289 1329 286" marker-end="url(#circuit-arrow-main-${variant})"/>

            <path class="feedback-route" d="M1128 514C1039 617 773 622 594 538C505 496 449 411 461 337" marker-end="url(#circuit-arrow-feedback-${variant})"/>
            <text x="668" y="624" class="module-note">next wake: latest frame + queue state + handler events / stdout return to context</text>
            <g class="feedback-nodes"><circle cx="1025" cy="583" r="6"/><circle cx="963" cy="603" r="6"/><circle cx="897" cy="611" r="6"/></g>
          </svg>

          <div class="module-mobile-summary circuit-mobile-summary">
            <p><b>1 · Main Agent</b><span>约 1Hz 读取最新 observation、历史摘要、queue 状态与 handler stdout；它是唯一的代码作者。</span></p>
            <p><b>2 · Action-building code</b><span>被执行来构建正常的 approach、grasp、transport、release Action Chunk，并写入共享 queue。</span></p>
            <p><b>3 · Fast-handler code</b><span>由同一个 Agent 写出并安装，在 20Hz+ observation 到达时运行，处理 Agent 尚未来得及看的事件。</span></p>
            <p><b>4 · Shared Action Queue</b><span>两类代码都能 clear、truncate、overwrite 或 push；机器人只持续消费这一条 queue。</span></p>
          </div>
          <figcaption>快速路径不是第二个 Agent：它是主 Agent 留在运行时中的代码。它替主 Agent 覆盖两次思考之间的时间空隙，并把发生过的事件带回下一轮上下文。</figcaption>
        </figure>

      </section>

      <section class="context-block" aria-labelledby="context-heading">
        <header class="section-intro narrow">
          <p class="eyebrow">02 · What persists</p>
          <h2 id="context-heading">长上下文不是视频堆积，<br>而是一份持续更新的工作记忆。</h2>
          <p>每轮只加入最新 observation 与本轮变化；旧内容保留为少量关键帧、决策摘要和可执行状态。这样 Agent 能知道“刚才为什么继续”“queue 还剩多少”“哪段 handler 正在运行”。</p>
        </header>
        <div class="context-river" role="img" aria-label="贯穿香蕉任务的 Agent 长上下文组成">
          <div class="context-anchor"><small>PINNED</small><b>Task + safety contract</b><span>Pick the banana and place it in the bowl.</span></div>
          <div><small>VISUAL</small><b>Latest + selected history</b><span>当前多相机帧；必要时保留最近 after-frame。</span></div>
          <div><small>STATE</small><b>Progress + Action Queue</b><span>executed prefix、remaining horizon、last truncate。</span></div>
          <div><small>CODE</small><b>Active analysis + handlers</b><span>SAM 3 / fusion 输出与 TAP guard 版本。</span></div>
          <div><small>TRACE</small><b>Recent thought summaries</b><span>最近 2–4 次 decision、reason 与 self-check。</span></div>
        </div>
      </section>

      <section class="episode-block" aria-labelledby="episode-heading">
        <header class="section-intro">
          <p class="eyebrow">03 · Banana to bowl · one continuous trace</p>
          <h2 id="episode-heading">每次醒来都重新审查，<br>但不必每次重新动作。</h2>
          <p>下面不是预设状态机，而是一条示例 trace。阶段名称是事后阅读标签；在线运行时，Agent 只看当前上下文并决定继续、分析、发射动作或更新快速 handler。</p>
        </header>

        <div class="episode-track">
          ${this.stage({
            number: '00', time: 't = 0.0s', title: 'Approach start', decision: 'RUN_ANALYSIS + EMIT',
            observation: 'Front / wrist camera 看见香蕉与碗；queue 为空；gripper 打开；无接触。',
            thought: '先把语义 mask 变成可执行几何。香蕉 pose 稳定且直线路径无碰撞，可以一次发射覆盖数秒的 approach，而不是逐帧控制。',
            code: `banana = sam3.segment(front, "banana")\nbowl = sam3.segment(front, "bowl")\nT_banana = fuse_pose(front, wrist, banana)\nchunk = approach(T_banana, stop=0.08, horizon=3.0)\nqueue.replace(chunk)`,
            queue: '写入约 3 秒 approach Chunk；robot 立即开始消费。',
            check: 'mask confidence ≥ 0.84 · workspace clear · endpoint 距香蕉 8cm · queue horizon 3.0s',
            next: '下一秒主 Agent 再次醒来；快速层期间持续记录 tracker、关节与力。'
          })}
          ${this.stage({
            number: '01', time: 't ≈ 1.0s', title: 'Approach review 1', decision: 'CONTINUE',
            observation: '新图像与预测轨迹一致；末端距香蕉约 21cm；queue remaining 约 2.1s；无力异常。',
            thought: '当前 chunk 仍把夹爪送向正确的 pre-grasp pose。剩余动作足够覆盖到下一轮审查，没有理由制造新的 chunk。',
            code: `return CONTINUE(\n  reason="tracking stable; queue horizon sufficient",\n  queue_mutation=None\n)`,
            queue: '显式 no-op；原 approach Chunk 连续执行，不 append、不 replace。',
            check: 'pose error 1.4cm < 3cm · queue remaining 2.1s > review interval · contact=false',
            next: '把 CONTINUE 与自检摘要写入 trace；一秒后继续审查。'
          })}
          ${this.stage({
            number: '02', time: 't ≈ 2.0s', title: 'Approach review 2', decision: 'CONTINUE',
            observation: '夹爪继续靠近；香蕉跟踪稳定；queue remaining 约 1.2s，仍能覆盖到下一决策点。',
            thought: '距离在缩短，但尚未进入需要近距离 grasp 的范围。继续原 chunk 比提前改写 queue 更平滑。',
            code: `return CONTINUE(\n  reason="approach remains valid",\n  expected_next="near-grasp review",\n  queue_mutation=None\n)`,
            queue: '第二次保持不变；同一个 approach Chunk 跨越三个思考 turn。',
            check: 'pose error 1.1cm · no occlusion · no contact · remaining horizon 仍充分',
            next: '保存“下一轮重点检查 grasp range”的摘要，而不是创建硬编码阶段。'
          })}
          ${this.stage({
            number: '03', time: 't ≈ 2.8s', title: 'Near banana', decision: 'EMIT GRASP',
            observation: '最新图像显示夹爪进入抓取范围；距离约 6.5cm；approach 尾部若继续执行会越过新的 pre-grasp。',
            thought: '动作已不再适合继续。冻结当前推理延迟期间必须执行的短前缀，截掉 approach 尾部，用近距离视觉和力基线生成 grasp。',
            code: `T_grasp = refine_grasp(wrist, T_banana)\nprefix = queue.freeze_inflight(steps=4)\ngrasp = grasp_chunk(T_grasp, force_limit=12.0)\nqueue.replace_tail(prefix, grasp)`,
            queue: '保留正在执行的 4 步前缀；替换未执行尾部；grasp 来自主 Agent。',
            check: 'grasp pose reachable · gripper aperture valid · force baseline clean · blend jerk within limit',
            next: '夹爪闭合后，新 observation 与 force result 进入下一轮主思考。'
          })}
          ${this.stage({
            number: '04', time: 't ≈ 3.6s', title: 'Holding + install guard', decision: 'UPDATE_HANDLER',
            observation: 'gripper 已闭合；力信号符合持物；手部相机中香蕉与夹爪暂时相对稳定。',
            thought: '正常 transport 可以等下一轮主 Agent 生成，但掉落不能等 1 秒。安装 TAP guard 高频观察相对运动；异常时允许它清 queue 并稳定或回撤。',
            code: `@on_frame(rate=20)\ndef tap_drop_guard(obs, queue):\n    rel = tap.relative_motion(obs.wrist, "banana", "gripper")\n    if rel.slip > 0.018 or obs.force.spike:\n        queue.clear(reason="drop-risk")\n        queue.push(stabilize_or_retract(obs))`,
            queue: '本轮不生成正常 transport；只改变 active handler。fast flow 保留完整发射能力。',
            check: 'grasp force in band · TAP lock acquired · relative motion stable for N frames',
            next: 'guard 安装结果和最近 TAP 统计进入长上下文；主 Agent 准备 transport。'
          }, true)}
          ${this.stage({
            number: '05', time: 't ≈ 4.2–7.0s', title: 'Transport', decision: 'EMIT → CONTINUE',
            observation: '香蕉稳定在夹爪中；多相机融合得到碗口 pose；TAP guard active；queue 需要新任务动作。',
            thought: '路径可安全跨越桌面，发射 move-to-bowl Chunk。中间每次醒来检查香蕉是否仍在手中、轨迹是否有效、queue 是否足够；满足时只 CONTINUE。',
            code: `T_bowl = fuse_pose(front, wrist, bowl)\ntransport = move_to_bowl(T_bowl, clearance=0.14)\nqueue.append(transport)\n\n# later reviews\nif held and path_valid and queue.remaining > 1.0:\n    return CONTINUE(queue_mutation=None)`,
            queue: '主 Agent 发射 transport；后续一个或多个 CONTINUE 保持其连续。TAP 只在异常时抢占。',
            check: 'banana held · bowl confidence stable · clearance > 10cm · queue horizon 足够',
            next: '进入碗上方 release volume 后，最新 observation 触发安全释放审查。'
          })}
          ${this.stage({
            number: '06', time: 't ≈ 7.4s', title: 'Release + verify', decision: 'RUN_ANALYSIS + EMIT',
            observation: '夹爪位于碗上方；香蕉仍被 TAP 跟踪；末端速度低；碗口 mask 与深度一致。',
            thought: '必须同时满足位置、持物与动态安全条件才能释放。确认后生成短 release Chunk；执行后不直接宣告成功，而是观察香蕉是否进入碗。',
            code: `safe = inside_release_volume(ee, bowl) \\\n    and tap.is_held("banana") and ee.speed < 0.03\nassert safe\nqueue.replace_tail(release_chunk(open_to=0.085))\n\n# next observation\nsuccess = banana_in_bowl(front) and gripper.is_open`,
            queue: '截去不再需要的 transport 尾部，写入 release；robot 消费后等待 after-observation。',
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
            <div class="trace-field"><b>New observation</b><p>${stage.observation}</p></div>
            <div class="trace-field thought-field"><b>Agent thought</b><p>${stage.thought}</p></div>
          </div>
          <div class="code-column">
            <b>Generated / executed code</b>
            <pre><code>${stage.code}</code></pre>
          </div>
          <div class="effect-column">
            <div class="trace-field"><b>Action Queue effect</b><p>${stage.queue}</p></div>
            <div class="trace-field self-check"><b>Self-check</b><p>${stage.check}</p></div>
            <div class="trace-field next-turn"><b>What advances the trace</b><p>${stage.next}</p></div>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define('architecture-detail', ArchitectureDetail);
