import {useEffect, useState,useRef} from "react";
import Hls from "hls.js";
import './App.css';

function App() 
{
  const [channels, setChannels]=useState([]);
  const [selectedChannel, setSelectedChannel] =useState(null);
  const videoRef = useRef(null);

  useEffect(()=> {
    fetch("http://127.0.0.1:8000/channels")
    .then(res=>res.json())
    .then(data=>setChannels(data))
    .catch(err=>console.error(err));
  },[]);
  // useEffect to handle HLS playback and regular video files
  useEffect(() => {
    if (!selectedChannel) return;
    const video = videoRef.current;
    
    // Check if URL is HLS stream (ends with .m3u8)
    if (selectedChannel.url.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(selectedChannel.url);
        hls.attachMedia(video);
        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = selectedChannel.url;
      }
    } else {
      // For regular video files (mp4, webm, etc.)
      video.src = selectedChannel.url;
    }
  }, [selectedChannel]);


  return (
    <div style={{padding: "20px"}}>
      <h1>IPTV Channel List</h1>

      <ul>
        {channels.map((ch, index)=>(
         <li
         key={index}
         onClick={()=> setSelectedChannel(ch)}
         style={{cursor: "pointer"}} 
         >
          {ch.name}
         </li>
        ))}
      </ul>
      {selectedChannel && (
        <div style={{marginTop: "20px"}}>
          <h2>Now Playing: {selectedChannel.name}</h2>
          <video ref={videoRef} controls width="600">
            <source
              src={selectedChannel.url}
              type={selectedChannel.url.endsWith('.m3u8') ? "application/x-mpegURL" : "video/mp4"}
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
      );
  }

export default App;
