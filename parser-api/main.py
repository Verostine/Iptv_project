from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return{"message": "FastAPI is working"}
@app.get("/channels")
def get_channels():
    channels=[]
    with open("sample.m3u","r",encoding="utf-8") as file:
        lines=file.readlines()
        
        i=0
        while i < len(lines):
            line=lines[i].strip()
            if not line:
                i+=1
                continue
            
            if line.startswith("#EXTINF"):
                if i+1 < len(lines):
                    name = line.split(",", 1)[-1].strip()
                    url = lines[i+1].strip()
                    channels.append({"name": name, "url": url})
                    i += 2
                else:
                    i += 1
            else:
                i += 1
    
    return channels