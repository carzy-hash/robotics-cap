class ArchitectureDetail extends HTMLElement {
  connectedCallback() {
    const variant = this.dataset.variant || 'flow';
    this.innerHTML = `
      <section class="architecture-block detail-${variant}" aria-labelledby="architecture-heading">
        <header class="section-intro">
          <p class="eyebrow">01 · What Code as Runtime means</p>
          <h2 id="architecture-heading">The runtime keeps executing<br>between Agent updates.</h2>
          <p>The main Agent updates control at its own decision cadence. On each turn, it can run an action builder, install or modify a handler, or keep the current runtime unchanged. Agent-written code submits typed queue-update requests to the runtime arbiter. It cannot command actuators or write directly to the live Action Queue.</p>
        </header>

        <div class="argument-grid">
          <div><small>DECISIONS</small><h3>Four explicit outputs</h3><p><code>CONTINUE</code>, <code>RUN_ANALYSIS</code>, <code>EMIT</code>, or <code>UPDATE_HANDLER</code>. <code>CONTINUE</code> is a recorded no-op, not a missing decision.</p></div>
          <div><small>QUEUE OWNERSHIP</small><h3>One writer</h3><p>Agent-written code submits typed updates. The runtime arbiter alone validates, orders, and commits changes to the live Action Queue.</p></div>
          <div><small>HANDLER LIFETIME</small><h3>Bounded execution</h3><p>Every handler declares its scope, trigger, deadline, expiry, and capabilities. It cannot outlive or exceed that contract.</p></div>
        </div>

        <aside class="data-principle"><b>Required safety boundary</b><p>Agent-written code can read typed observations and call bounded runtime APIs. It cannot modify the runtime executor, scheduler, queue arbiter, actuator interface, operator stop path, or safety limits. It also has no direct access to files, networks, processes, credentials, or safety configuration. An independent safety controller may reject or cancel any motion. All rates, thresholds, and timings below are examples. Deployment requires calibration, uncertainty bounds, and stopping-distance analysis.</p></aside>

        <figure class="module-figure circuit-figure-v2">
          <img class="module-wash" src="assets/nervous-system-v1.png" alt="">
          <svg viewBox="0 0 1440 660" role="img" aria-labelledby="circuit-title circuit-desc">
            <title id="circuit-title">One main Agent writes action-building code and fast-handler code</title>
            <desc id="circuit-desc">Sparse key observations enter the main Agent; the banana example uses an illustrative one-hertz review rate. The Agent writes two kinds of capability-restricted code: one proposes normal Action Chunks, while the other handles selected events between Agent decisions. Both submit typed updates to a runtime arbiter, which validates and atomically applies accepted updates to the Action Queue.</desc>
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
            <text x="195" y="137" class="circuit-frequency main-frequency">example · ≈ 1 Hz review</text>
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
            <text x="300" y="570" class="circuit-frequency fast-frequency">chosen cadence · unseen observations</text>

            <g class="handler-runtime" transform="translate(924 458)">
              <rect x="-48" y="-38" width="96" height="76" rx="14"/>
              <text x="0" y="-5" class="module-kicker">RUN</text>
              <text x="0" y="19" class="module-note">every event</text>
            </g>
            <path class="handler-exec-route" d="M818 458C847 458 857 458 870 458" marker-end="url(#circuit-arrow-fast-${variant})"/>
            <path class="fast-mutation-route" d="M974 449C1040 432 1084 390 1121 348" marker-end="url(#circuit-arrow-fast-${variant})"/>
            <text x="1008" y="419" class="module-note fast-text">request truncate · replace</text>
            <text x="1021" y="439" class="module-note fast-text">or a validated fast chunk</text>
            <path class="chunk-build-route" d="M1184 263C1199 267 1202 275 1200 282" marker-end="url(#circuit-arrow-main-${variant})"/>

            <g class="shared-queue" transform="translate(1196 299)">
              <rect x="-88" y="-18" width="194" height="72" rx="16" class="queue-frame"/>
              <rect x="-68" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="-34" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="0" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="34" y="7" width="27" height="23" rx="5" class="queue-slot"/><rect x="68" y="7" width="27" height="23" rx="5" class="queue-slot"/>
              <text x="-65" y="86" class="module-kicker">QUEUE ARBITER</text>
              <text x="-62" y="109" class="module-note">validates · commits atomically</text>
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
            <p><b>1 · Main Agent</b><span>Reads the latest observation, history summary, queue state, and handler stdout at the decision cadence—about 1 Hz in the banana example. It is the runtime's sole code author.</span></p>
            <p><b>2 · Action-building code</b><span>Constructs normal approach, grasp, transport, and release Action Chunks, then submits a typed queue-update request.</span></p>
            <p><b>3 · Fast-handler code</b><span>Runs with bounded capabilities and an explicit task scope, event trigger, deadline, and expiry. The 20 Hz rate in this example is illustrative.</span></p>
            <p><b>4 · Queue arbiter</b><span>Validates, orders, and atomically commits accepted updates. The robot consumes one live queue; Agent-written code never writes it directly.</span></p>
          </div>
          <figcaption>The handler path continues to process selected inputs between model decisions. It can request a bounded queue update and return event results, but the runtime arbiter remains the sole writer of the live queue.</figcaption>
        </figure>

      </section>

      <section class="context-block" aria-labelledby="context-heading">
        <header class="section-intro narrow">
          <p class="eyebrow">02 · What persists</p>
          <h2 id="context-heading">Context describes<br>the runtime's executable state.</h2>
          <p>Each turn adds only the latest observation and the changes from this turn, while retaining enough key state to continue execution: task constraints, a few keyframes, queue capacity, active code, handler events, and recent decisions. The Agent can therefore decide whether the current runtime remains valid and whether to preserve, extend, or replace it next.</p>
        </header>
        <div class="context-river" role="group" aria-label="Components of the Agent's long context throughout the banana task">
          <div class="context-anchor"><small>PINNED</small><b>Task + safety contract</b><span>Pick the banana and place it in the bowl.</span></div>
          <div><small>VISUAL</small><b>Latest + selected history</b><span>Current multi-camera frames; retain the latest after-frame when needed.</span></div>
          <div><small>STATE</small><b>Runtime progress + Action Queue</b><span>Executed prefix, remaining horizon, and last truncation.</span></div>
          <div><small>CODE</small><b>Installed code + tool outputs</b><span>SAM 3 / fusion outputs and the TAP guard version.</span></div>
          <div><small>TRACE</small><b>Recent runtime decisions</b><span>The latest 2–4 decisions, reasons, and self-checks.</span></div>
        </div>
      </section>

      <section class="episode-block" aria-labelledby="episode-heading">
        <header class="section-intro">
          <p class="eyebrow">03 · Banana to bowl · runtime evolution</p>
          <h2 id="episode-heading">Revise the runtime only when<br>the current plan stops matching the world.</h2>
          <p><code>banana-demo-01</code> shows the online execution view of the same episode projected in the <a href="data.html">Real-data SFT note</a>. Stage names are retrospective reading labels; the rationale is an observable decision summary, not hidden chain of thought. Two identical approach reviews are combined below so each row represents a distinct state transition.</p>
        </header>

        <div class="episode-track">
          ${this.stage({
            number: '00', time: 't = 0.0s', title: 'Approach start', decision: 'RUN_ANALYSIS + EMIT',
            observation: 'The front and wrist cameras see the banana and bowl; the queue is empty; the gripper is open; there is no contact.',
            thought: 'First convert the semantic masks into executable geometry. The banana pose is stable and the straight-line path is collision-free, so one emission can cover several seconds of approach instead of generating actions frame by frame.',
            code: `banana = sam3.segment(front, "banana")\nbowl = sam3.segment(front, "bowl")\nT_banana = fuse_pose(front, wrist, banana)\nchunk = approach(T_banana, stop=0.08, horizon=3.0)\nruntime.submit(QueueUpdate.replace(chunk))`,
            queue: 'Writes an approach Chunk of about three seconds; the robot starts consuming it immediately.',
            check: 'mask confidence ≥ 0.84 · workspace clear · endpoint 8 cm from banana · queue horizon 3.0 s',
            next: 'Until the next main-Agent decision, the installed runtime keeps recording tracker, joint, and force data.'
          })}
          ${this.stage({
            number: '01', time: 't ≈ 1.0–2.0s', title: 'Approach reviews', decision: 'CONTINUE × 2',
            observation: 'At both reviews, the image matches the predicted trajectory, force is normal, and the queue covers the next decision point; its horizon falls from about 2.1 s to 1.2 s.',
            thought: 'The same chunk remains valid across both reviews. Each decision records why no queue update is needed while the runtime keeps executing.',
            code: `return CONTINUE(\n  reason="tracking stable; queue horizon sufficient",\n  queue_mutation=None\n)`,
            queue: 'Two explicit no-ops. The original approach Chunk spans three Agent decision cycles without append or replace.',
            check: 'pose error 1.4 → 1.1 cm · no occlusion · no contact · remaining horizon sufficient',
            next: 'Each review writes CONTINUE and its self-check to the trace; the next turn focuses on grasp range.'
          })}
          ${this.stage({
            number: '02', time: 't ≈ 2.8s', title: 'Near banana', decision: 'EMIT GRASP',
            observation: 'The latest image shows the gripper entering grasp range at about 6.5 cm; continuing the approach tail would overshoot the new pre-grasp.',
            thought: 'The current observation shows that the original action is no longer valid. Preserve only the committed prefix inside the validated stopping horizon, remove the approach tail, and generate a grasp from close-range vision and the force baseline.',
            code: `T_grasp = refine_grasp(wrist, T_banana)\nprefix = runtime.committed_stopping_prefix()\ngrasp = grasp_chunk(T_grasp, force_limit=12.0)\nruntime.submit(QueueUpdate.replace_tail(prefix, grasp))`,
            queue: 'Requests replacement of the uncommitted tail after the validated stopping prefix; the runtime arbiter accepts or rejects the update.',
            check: 'grasp pose reachable · gripper aperture valid · force baseline clean · blend jerk within limit',
            next: 'After the gripper closes, the new observation and force result enter the next Agent decision.'
          })}
          ${this.stage({
            number: '03', time: 't ≈ 3.6s', title: 'Holding + install guard', decision: 'UPDATE_HANDLER',
            observation: 'The gripper has closed; force indicates a held object; the banana and gripper are temporarily stable relative to each other in the wrist camera.',
            thought: "Normal transport can wait for the main Agent's next turn, but drop risk may change before then. Install a task-scoped TAP guard with an explicit trigger, deadline, expiry, and bounded queue-update capability.",
            code: `@on_frame(rate=20, scope="transport", expires="release")\ndef tap_drop_guard(obs):\n    rel = tap.relative_motion(obs.wrist, "banana", "gripper")\n    if rel.slip > 0.018 or obs.force.spike:\n        return QueueUpdate.replace(stabilize_or_retract(obs),\n                                   reason="drop-risk")`,
            queue: 'Installs a versioned, task-scoped handler. On a trigger, it submits a recovery request; the runtime arbiter validates and orders that request.',
            check: 'grasp force in band · TAP lock acquired · relative motion stable for N frames',
            next: 'The guard installation result and recent TAP statistics enter long context; the main Agent prepares transport.'
          }, true)}
          ${this.stage({
            number: '04', time: 't ≈ 4.2–7.0s', title: 'Transport', decision: 'EMIT → CONTINUE',
            observation: 'The banana is stable in the gripper; multi-camera fusion provides the bowl pose; the TAP guard is active; the queue needs a new task action.',
            thought: 'The path can cross the table safely, so emit a move-to-bowl Chunk. On later turns, check whether the banana remains held, the trajectory remains valid, and the queue is sufficient; when conditions are unchanged, return CONTINUE and let the runtime proceed.',
            code: `T_bowl = fuse_pose(front, wrist, bowl)\ntransport = move_to_bowl(T_bowl, clearance=0.14)\nruntime.submit(QueueUpdate.append(transport))\n\n# later reviews\nif held and path_valid and queue.remaining > 1.0:\n    return CONTINUE(queue_mutation=None)`,
            queue: 'The main Agent emits transport; one or more later CONTINUE decisions preserve its continuity. TAP preempts only on an anomaly.',
            check: 'banana held · bowl confidence stable · clearance > 10 cm · queue horizon sufficient',
            next: 'After entering the release volume above the bowl, the latest observation triggers a safe-release review.'
          })}
          ${this.stage({
            number: '05', time: 't ≈ 7.4s', title: 'Release + verify', decision: 'RUN_ANALYSIS + EMIT',
            observation: 'The gripper is above the bowl; TAP still tracks the banana; end-effector speed is low; the bowl mask agrees with depth.',
            thought: 'Release requires position, hold state, and dynamic-safety conditions to hold simultaneously. Once confirmed, generate a short release Chunk; after execution, wait for a new observation before deciding whether the banana is in the bowl.',
            code: `permit = safety_controller.authorize_release(\n    ee=ee, target=bowl, held=tap.is_held("banana")\n)\nif permit:\n    runtime.submit(QueueUpdate.replace_tail(\n        release_chunk(open_to=0.085), permit=permit))\n\n# next observation\nsuccess = banana_in_bowl(front) and gripper.is_open`,
            queue: 'Requests release with a current safety permit. A missing or expired permit leaves the queue unchanged and the robot holding or stopping.',
            check: 'inside bowl volume · low velocity · no slip · release executed · banana mask remains in bowl',
            next: 'Only if the after-observation passes does the episode write terminal.success=true; otherwise it reanalyzes and recovers.'
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
            <div class="trace-field thought-field"><b>Decision rationale</b><p>${stage.thought}</p></div>
          </div>
          <div class="code-column">
            <b>Generated / executed code</b>
            <pre><code>${stage.code}</code></pre>
          </div>
          <div class="effect-column">
            <div class="trace-field"><b>Action Queue effect</b><p>${stage.queue}</p></div>
            <div class="trace-field self-check"><b>Self-check</b><p>${stage.check}</p></div>
            <div class="trace-field next-turn"><b>Next runtime event</b><p>${stage.next}</p></div>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define('architecture-detail', ArchitectureDetail);
