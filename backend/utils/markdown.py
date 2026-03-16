"""
Markdown utilities for parsing and writing blog posts with YAML frontmatter.
"""
import re
import yaml
from typing import Tuple, Dict, Any


def parse_frontmatter(raw: str) -> Tuple[Dict[str, Any], str]:
    """
    Parse YAML frontmatter from a markdown file.
    Returns (metadata_dict, content_string).
    """
    if raw.startswith("---"):
        parts = raw.split("---", 2)
        if len(parts) >= 3:
            try:
                meta = yaml.safe_load(parts[1]) or {}
                content = parts[2].strip()
                return meta, content
            except yaml.YAMLError:
                pass
    return {}, raw.strip()


def write_post(filepath: str, frontmatter: Dict[str, Any], content: str) -> None:
    """
    Write a markdown post with YAML frontmatter to disk.
    """
    # Serialize frontmatter, preserving list formatting
    fm_str = yaml.dump(
        frontmatter,
        default_flow_style=False,
        allow_unicode=True,
        sort_keys=False,
    )
    full_content = f"---\n{fm_str}---\n\n{content}\n"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(full_content)


def slugify(text: str) -> str:
    """Convert a title to a URL-safe slug."""
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")
