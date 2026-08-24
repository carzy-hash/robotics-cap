#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

python3 "$REPO_ROOT/scripts/normalize-code-as-runtime-zh.py" --check
python3 "$REPO_ROOT/scripts/restructure-code-as-runtime.py" --check

if command -v node >/dev/null 2>&1; then
    node --check "$REPO_ROOT/materials/code-as-runtime/article/architecture-detail.js"
    node --check "$REPO_ROOT/materials/code-as-runtime/article/zh/architecture-detail.js"
fi

python3 - "$REPO_ROOT" <<'PY'
import html.parser
import json
import pathlib
import re
import sys
import urllib.parse

root = pathlib.Path(sys.argv[1]).resolve()
site = root / "site"
public = root / "materials" / "code-as-runtime" / "article"
errors = []

def is_within(path, parent):
    try:
        path.resolve().relative_to(parent.resolve())
        return True
    except ValueError:
        return False

required_public = [
    public / "index.html",
    public / "context.html",
    public / "training.html",
    public / "data.html",
    public / "references.html",
    public / "cold-start.html",
    public / "zh" / "index.html",
    public / "zh" / "context.html",
    public / "zh" / "training.html",
    public / "zh" / "data.html",
    public / "zh" / "references.html",
    public / "zh" / "cold-start.html",
    public / "styles.css",
    public / "architecture-detail.js",
    public / "zh" / "architecture-detail.js",
    public / "assets" / "nervous-system-v1.png",
]
for path in required_public:
    if not path.exists():
        errors.append(f"missing required public file: {path.relative_to(root)}")

language_pairs = {
    public / "index.html": (public / "zh" / "index.html", "zh/", "../"),
    public / "context.html": (public / "zh" / "context.html", "zh/context.html", "../context.html"),
    public / "training.html": (public / "zh" / "training.html", "zh/training.html", "../training.html"),
    public / "data.html": (public / "zh" / "data.html", "zh/data.html", "../data.html"),
    public / "references.html": (public / "zh" / "references.html", "zh/references.html", "../references.html"),
    public / "cold-start.html": (public / "zh" / "cold-start.html", "zh/cold-start.html", "../cold-start.html"),
}
for english, (chinese, chinese_href, english_href) in language_pairs.items():
    if not english.exists() or not chinese.exists():
        continue
    english_text = english.read_text(encoding="utf-8")
    chinese_text = chinese.read_text(encoding="utf-8")
    if '<html lang="en">' not in english_text:
        errors.append(f"English page has wrong lang attribute: {english.relative_to(root)}")
    if '<html lang="zh-CN">' not in chinese_text:
        errors.append(f"Chinese page has wrong lang attribute: {chinese.relative_to(root)}")
    if not re.search(rf'class="language-switch"[^>]+href="{re.escape(chinese_href)}"', english_text):
        errors.append(f"English page has wrong Chinese counterpart link: {english.relative_to(root)}")
    if not re.search(rf'class="language-switch"[^>]+href="{re.escape(english_href)}"', chinese_text):
        errors.append(f"Chinese page has wrong English counterpart link: {chinese.relative_to(root)}")
    english_without_switch = re.sub(
        r'<a class="language-switch"[^>]*>中文</a>', "", english_text
    )
    if re.search(r"[\u3400-\u9fff]", english_without_switch):
        errors.append(f"English page still contains Chinese copy: {english.relative_to(root)}")

english_runtime_js = public / "architecture-detail.js"
if english_runtime_js.exists() and re.search(
    r"[\u3400-\u9fff]", english_runtime_js.read_text(encoding="utf-8")
):
    errors.append("English Runtime component still contains Chinese copy")

runtime_components = [
    public / "architecture-detail.js",
    public / "zh" / "architecture-detail.js",
]
single_quoted_stage_value = re.compile(
    r"^\s*(observation|thought|queue|check|next):\s*'(.*)'[,]?$"
)
for component in runtime_components:
    if not component.exists():
        continue
    component_text = component.read_text(encoding="utf-8")
    if component_text.count("${this.stage({") != 6:
        errors.append(
            f"Runtime component must contain six distinct state-transition stages: {component.relative_to(root)}"
        )
    for required_class in ("architecture-block", "context-block", "episode-block"):
        if required_class not in component_text:
            errors.append(
                f"Runtime component is missing {required_class}: {component.relative_to(root)}"
            )
    for line_number, line in enumerate(component_text.splitlines(), 1):
        match = single_quoted_stage_value.match(line)
        if match and re.search(r"(?<!\\)'", match.group(2)):
            errors.append(
                f"unsafe apostrophe in single-quoted Runtime copy: "
                f"{component.relative_to(root)}:{line_number}"
            )

for candidate_dir in sorted((root / "candidates").glob("*")):
    if not candidate_dir.is_dir():
        continue
    article_id = candidate_dir.name
    required_process = [
        root / "work" / article_id / "brief.md",
        candidate_dir / "README.md",
        root / "reviews" / article_id / "decision.md",
    ]
    for path in required_process:
        if not path.exists():
            errors.append(f"incomplete candidate process for {article_id}: missing {path.relative_to(root)}")

class LinkParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        for attr in ("href", "src"):
            if attr in values:
                self.links.append(values[attr])

html_pages = (
    sorted(site.rglob("*.html"))
    + sorted((root / "candidates").rglob("*.html"))
    + sorted((root / "materials").rglob("*.html"))
)
for page in html_pages:
    text = page.read_text(encoding="utf-8")
    is_public = is_within(page, public)
    if is_public and re.search(r"(?:^|[/'\"])(?:work|candidates|reviews|materials)/", text):
        errors.append(f"public page references an internal workflow directory: {page.relative_to(root)}")

    parser = LinkParser()
    parser.feed(text)
    for raw_link in parser.links:
        parsed = urllib.parse.urlparse(raw_link)
        if parsed.scheme or parsed.netloc or raw_link.startswith(("#", "mailto:", "tel:", "data:")):
            continue
        clean = urllib.parse.unquote(parsed.path)
        if not clean:
            continue
        target = (public / clean.lstrip("/")) if clean.startswith("/") else (page.parent / clean)
        target = target.resolve()
        try:
            target.relative_to(root)
        except ValueError:
            errors.append(f"link escapes repository: {page.relative_to(root)} -> {raw_link}")
            continue
        if is_public and not is_within(target, public):
            errors.append(f"public link escapes Code as Runtime article: {page.relative_to(root)} -> {raw_link}")
            continue
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            errors.append(f"broken local link: {page.relative_to(root)} -> {raw_link}")

iteration_logs = sorted((root / "work").glob("*/iteration-log.jsonl"))
iteration_logs += sorted((root / "materials").glob("*/notes/iteration-log.jsonl"))
for log in iteration_logs:
    for line_number, line in enumerate(log.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            json.loads(line)
        except json.JSONDecodeError as exc:
            errors.append(f"invalid JSONL: {log.relative_to(root)}:{line_number}: {exc.msg}")

if errors:
    print("Validation failed:", file=sys.stderr)
    for error in errors:
        print(f"  - {error}", file=sys.stderr)
    raise SystemExit(1)

print("Validation passed: public links, workflow records, and JSONL are consistent.")
PY
