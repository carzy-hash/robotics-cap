#!/usr/bin/env python3
"""Apply and verify the Code as Runtime article structure."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARTICLE = ROOT / "materials" / "code-as-runtime" / "article"
SECTION_START = re.compile(r'^        <section class="(?:training|data)-section[^"]*" aria-labelledby="([^"]+)">', re.M)
SUMMARY_START = "        <!-- cold-start-summary:start -->"
SUMMARY_END = "        <!-- cold-start-summary:end -->"


def split_sections(text: str) -> tuple[str, dict[str, str], str]:
    clean = re.sub(
        rf"\n{re.escape(SUMMARY_START)}.*?{re.escape(SUMMARY_END)}\n",
        "\n",
        text,
        flags=re.S,
    )
    matches = list(SECTION_START.finditer(clean))
    if not matches:
        raise ValueError("no article sections found")
    closing = clean.rindex("      </article>")
    preamble = clean[: matches[0].start()]
    postamble = clean[closing:]
    sections: dict[str, str] = {}
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else closing
        sections[match.group(1)] = clean[match.start() : end].rstrip() + "\n"
    return preamble, sections, postamble


def renumber(block: str, replacements: dict[str, str]) -> str:
    for old, new in replacements.items():
        block = block.replace(old, new)
    return block


def cold_start_page(language: str, section: str) -> str:
    if language == "en":
        return f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Code as Runtime · Privileged-teacher Cold Start</title>
    <meta name="description" content="Code as Runtime Concept v0.1 proposes a privileged-teacher cold start with strict input separation. No trained-policy or transfer results are reported.">
    <link rel="alternate" hreflang="en" href="cold-start.html">
    <link rel="alternate" hreflang="zh-CN" href="zh/cold-start.html">
    <link rel="alternate" hreflang="x-default" href="cold-start.html">
    <link rel="stylesheet" href="styles.css?v=training-note">
  </head>
  <body class="training-page">
    <header class="candidate-nav">
      <a class="mark" href="./" aria-label="Code as Runtime home"><b>Code as Runtime</b><span>Agent-written robot runtime</span></a>
      <div class="nav-tools">
        <nav class="series-nav" aria-label="Code as Runtime article series">
          <a href="./">01 Runtime</a><a href="context.html">02 Context</a><a href="training.html">03 Runtime RL</a><a href="data.html">04 Real-data SFT</a>
        </nav>
        <a class="language-switch" href="zh/cold-start.html" hreflang="zh-CN" lang="zh-CN" aria-label="Read in Chinese">中文</a>
      </div>
    </header>
    <main class="candidate-shell training-shell">
      <header class="candidate-hero compact training-hero">
        <p class="eyebrow">Code as Runtime · Training appendix · Concept v0.1 · Not peer reviewed</p>
        <h1>Use privileged teachers to start.<br>Remove them before acceptance.</h1>
        <p class="lead">This optional bootstrap can initialize a policy that is not yet able to produce useful on-policy rollouts. Privileged signals may supervise a deployment-shaped trace, but they must remain outside policy input and disappear before the policy is accepted.</p>
      </header>
      <article class="training-article">
{section.rstrip()}
        <p class="closing-copy">A cold start succeeds only when the privileged sidecar is removed and an observation-only policy still completes execution under calibrated, independent verifiers. Magic Offset and simulation ground truth are teacher data, not runtime capabilities.</p>
      </article>
      <p class="article-references-link"><a href="training.html">← Return to Runtime Trace RL</a></p>
    </main>
  </body>
</html>
'''
    return f'''<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Code as Runtime · 特权教师冷启动</title>
    <meta name="description" content="Code as Runtime 的可选冷启动附录：把特权教师数据与部署时可见的策略输入严格分离。概念版 v0.1。">
    <link rel="alternate" hreflang="en" href="../cold-start.html">
    <link rel="alternate" hreflang="zh-CN" href="cold-start.html">
    <link rel="alternate" hreflang="x-default" href="../cold-start.html">
    <link rel="stylesheet" href="../styles.css?v=training-note">
  </head>
  <body class="training-page">
    <header class="candidate-nav">
      <a class="mark" href="./" aria-label="Code as Runtime 首页"><b>Code as Runtime</b><span>Agent 编写的机器人运行时</span></a>
      <div class="nav-tools">
        <nav class="series-nav" aria-label="Code as Runtime 系列文章">
          <a href="./">01 运行时</a><a href="context.html">02 上下文</a><a href="training.html">03 运行时 RL</a><a href="data.html">04 真机数据 SFT</a>
        </nav>
        <a class="language-switch" href="../cold-start.html" hreflang="en" lang="en" aria-label="Read in English">English</a>
      </div>
    </header>
    <main class="candidate-shell training-shell">
      <header class="candidate-hero compact training-hero">
        <p class="eyebrow">Code as Runtime · 训练附录 · 概念版 v0.1 · 未经同行评审</p>
        <h1>用特权教师启动，<br>在验收前移除。</h1>
        <p class="lead">当策略还无法产生有效的 on-policy 轨迹时，这套可选方法可用于初始化。特权信号可以监督按部署形态构建的轨迹，但不得进入策略输入，并且必须在策略验收前移除。</p>
      </header>
      <article class="training-article">
{section.rstrip()}
        <p class="closing-copy">只有移除特权附属数据后，仅依赖观测的策略仍能在经过校准的独立验证器下完成执行，冷启动才算成功。Magic Offset 和仿真真值属于教师数据，不是运行时能力。</p>
      </article>
      <p class="article-references-link"><a href="training.html">← 返回运行时轨迹 RL</a></p>
    </main>
  </body>
</html>
'''


def restructure_training(path: Path, language: str) -> str:
    text = path.read_text(encoding="utf-8")
    preamble, sections, postamble = split_sections(text)
    cold_path = ARTICLE / ("cold-start.html" if language == "en" else "zh/cold-start.html")
    if not cold_path.exists():
        cold = sections.get("projection-heading")
        if cold is None:
            raise ValueError(f"missing cold-start section in {path}")
        cold = renumber(cold, {
            "04 · Cold start: privileged projection": "Appendix · Privileged projection",
            "04 · 冷启动：特权信息投影": "附录 · 特权信息投影",
        })
        cold_path.write_text(cold_start_page(language, cold), encoding="utf-8")

    order = [
        "rl-shape-heading",
        "artifact-teacher-heading",
        "teacher-heading",
        "reward-heading",
        "cap-curriculum-heading",
        "exit-heading",
    ]
    missing = [name for name in order if name not in sections]
    if missing:
        raise ValueError(f"missing training sections in {path}: {missing}")
    number_maps = {
        "en": {
            "05 · Runtime action space": "02 · Runtime action space",
            "03 · Rollout and optimization loop": "03 · Rollout and optimization loop",
            "02 · Verifiers and credit": "04 · Verifiers and credit",
            "06 · CAP-derived curriculum": "05 · CAP-derived curriculum",
            "07 · RL acceptance conditions": "06 · RL acceptance conditions",
        },
        "zh": {
            "05 · 运行时动作空间": "02 · 运行时动作空间",
            "03 · 执行采样与优化循环": "03 · 执行采样与优化循环",
            "02 · 验证器与信用分配": "04 · 验证器与信用分配",
            "06 · 基于 CAP 的课程": "05 · 基于 CAP 的课程",
            "07 · RL 验收条件": "06 · RL 验收条件",
        },
    }
    summary = (
        f'''{SUMMARY_START}
        <aside id="cold-start" class="data-principle"><b>Optional bootstrap, separate contract</b><p>Cold start may use privileged teachers only through a sidecar. Policy input must remain deployment-visible, and acceptance requires a fresh observation-only rollout after the sidecar is removed. <a href="cold-start.html">Read the privileged-teacher appendix →</a></p></aside>
{SUMMARY_END}
'''
        if language == "en"
        else f'''{SUMMARY_START}
        <aside id="cold-start" class="data-principle"><b>可选冷启动，独立契约</b><p>冷启动只能通过附属数据使用特权教师。策略输入必须保持部署时可见；移除附属数据后，还要重新执行仅依赖观测的轨迹，才能通过验收。<a href="cold-start.html">阅读特权教师附录 →</a></p></aside>
{SUMMARY_END}
'''
    )
    blocks = [renumber(sections[name], number_maps[language]) for name in order]
    blocks.insert(3, summary)
    return preamble + "\n".join(blocks) + postamble


def restructure_data(path: Path, language: str) -> str:
    text = path.read_text(encoding="utf-8")
    preamble, sections, postamble = split_sections(text)
    order = [
        "projection-objective-heading",
        "ledger-heading",
        "pseudo-time-heading",
        "action-code-heading",
        "schema-heading",
        "banana-projection-heading",
        "audit-heading",
    ]
    missing = [name for name in order if name not in sections]
    if missing:
        raise ValueError(f"missing data sections in {path}: {missing}")
    replacements = {
        "en": {
            "06 · From canonical trace to SFT pairs": "05 · Proposed minimum trace shape",
            "One episode trace unfolds<br>into multi-turn SFT examples.": "A minimum episode trace unfolds<br>into multi-turn SFT examples.",
            "05 · Worked projection": "06 · Worked projection",
        },
        "zh": {
            "06 · 从规范轨迹到 SFT 样本对": "05 · 建议的最小轨迹结构",
            "一条 episode trace，<br>展开成多轮 SFT 样本。": "一条最小任务轨迹，<br>展开成多轮 SFT 样本。",
            "05 · 投影示例": "06 · 投影示例",
        },
    }
    blocks = [renumber(sections[name], replacements[language]) for name in order]
    return preamble + "\n".join(blocks) + postamble


def expected_files() -> dict[Path, str]:
    return {
        ARTICLE / "training.html": restructure_training(ARTICLE / "training.html", "en"),
        ARTICLE / "zh/training.html": restructure_training(ARTICLE / "zh/training.html", "zh"),
        ARTICLE / "data.html": restructure_data(ARTICLE / "data.html", "en"),
        ARTICLE / "zh/data.html": restructure_data(ARTICLE / "zh/data.html", "zh"),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    changed: list[Path] = []
    for path, expected in expected_files().items():
        current = path.read_text(encoding="utf-8")
        if current != expected:
            changed.append(path)
            if not args.check:
                path.write_text(expected, encoding="utf-8")
    if args.check and changed:
        print("Article structure normalization required:")
        for path in changed:
            print(f"  - {path.relative_to(ROOT)}")
        return 1
    print("Code as Runtime article structure is normalized.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
