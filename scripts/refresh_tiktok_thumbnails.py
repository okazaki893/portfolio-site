#!/usr/bin/env python3
"""
content/videos.json 内の platform='tiktok' な動画の customThumbnail を
TikTok oEmbed API から再取得して最新化する。

TikTok の thumbnail_url は署名付きで約2日で期限切れになるため、
GitHub Actions で定期実行してリポジトリを更新する前提。
"""
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

VIDEOS_JSON = Path(__file__).resolve().parent.parent / "content" / "videos.json"
OEMBED_ENDPOINT = "https://www.tiktok.com/oembed?url={}"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
TIMEOUT = 20


def fetch_oembed(link: str) -> dict | None:
    endpoint = OEMBED_ENDPOINT.format(urllib.parse.quote(link, safe=""))
    req = urllib.request.Request(endpoint, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:
        print(f"  oEmbed fetch failed: {e}", file=sys.stderr)
        return None


def main() -> int:
    if not VIDEOS_JSON.exists():
        print(f"{VIDEOS_JSON} not found; nothing to do.")
        return 0

    with VIDEOS_JSON.open("r", encoding="utf-8") as f:
        videos = json.load(f)

    if not isinstance(videos, list):
        print("videos.json is not a list; skipping.")
        return 0

    updated = 0
    for idx, video in enumerate(videos):
        if video.get("platform") != "tiktok":
            continue
        link = video.get("link")
        if not link:
            continue
        print(f"[{idx}] {video.get('title', '?')[:50]}")
        data = fetch_oembed(link)
        if not data:
            continue
        thumb = data.get("thumbnail_url")
        if not thumb:
            print("  thumbnail_url missing in response")
            continue
        if thumb != video.get("customThumbnail"):
            video["customThumbnail"] = thumb
            updated += 1
            print("  -> updated")
        else:
            print("  -> unchanged")
        time.sleep(0.5)  # 連続呼び出しを軽く緩和

    if updated == 0:
        print("No thumbnails updated.")
        return 0

    with VIDEOS_JSON.open("w", encoding="utf-8") as f:
        json.dump(videos, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Updated {updated} thumbnail(s). videos.json rewritten.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
