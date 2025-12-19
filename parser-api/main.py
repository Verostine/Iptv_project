from fastapi import FastAPI
app=FastAPI()
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

            if line.startswith("#EXTINF"):
                if i+1 < len(lines):
                    name= line.split(",", 1)[1].strip()
                    url=lines[i+1].strip()
                    channels.append({"name": name,
                                 "url": url})
                i += 2
            else:
                i+=1
        else:
             i+=1
    
             return channels