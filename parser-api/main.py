from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import PlainTextResponse
import os

app = FastAPI()

# --------------------------------------------------
# Base paths
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEOS_DIR = os.path.join(BASE_DIR, "videos")

# --------------------------------------------------
# Serve video files
# --------------------------------------------------
if os.path.exists(VIDEOS_DIR):
    app.mount("/videos", StaticFiles(directory=VIDEOS_DIR), name="videos")

# --------------------------------------------------
# CORS (for any frontend or player)
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Root test endpoint
# --------------------------------------------------
@app.get("/")
def root():
    return {"message": "IPTV FastAPI backend running"}

# --------------------------------------------------
# Helper: scan videos and categorize by folder
# --------------------------------------------------
def get_all_videos(folder):
    videos = []

    for root, dirs, files in os.walk(folder):
        category = os.path.relpath(root, folder)

        for file in files:
            if file.endswith((".mp4", ".mkv", ".ts")):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, BASE_DIR)

                videos.append({
                    "name": os.path.splitext(file)[0],
                    "url": f"http://127.0.0.1:8000/{rel_path.replace(os.sep,'/')}",
                    "category": category if category != "." else "uncategorized"
                })

    return videos

# --------------------------------------------------
# Channels list (Week 3)
# --------------------------------------------------
@app.get("/channels")
def get_channels():
    if not os.path.exists(VIDEOS_DIR):
        return []
    return get_all_videos(VIDEOS_DIR)

# --------------------------------------------------
# Search channels (Week 4)
# --------------------------------------------------
@app.get("/channels/search")
def search_channels(q: str):
    videos = get_all_videos(VIDEOS_DIR)
    return [v for v in videos if q.lower() in v["name"].lower()]

# --------------------------------------------------
# Filter by category (Week 4)
# --------------------------------------------------
@app.get("/channels/category/{category}")
def get_channels_by_category(category: str):
    videos = get_all_videos(VIDEOS_DIR)
    return [v for v in videos if v["category"].lower() == category.lower()]

# --------------------------------------------------
# Dynamic M3U playlist (Week 3 + 4)
# --------------------------------------------------
@app.get("/stream.m3u")
def stream_m3u():
    playlist = "#EXTM3U\n"

    for v in get_all_videos(VIDEOS_DIR):
        playlist += (
            f'#EXTINF:-1 group-title="{v["category"]}",{v["name"]}\n'
            f'{v["url"]}\n'
        )

    return PlainTextResponse(playlist, media_type="application/x-mpegURL")