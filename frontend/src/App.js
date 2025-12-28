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
  // useEffect to handle HLS playback
  useEffect(() => {
    const video = videoRef.current;
    if (!selectedChannel || !video) return;
    const url = selectedChannel.url;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      const onManifest = () => video.play().catch(() => {});
      hls.on(Hls.Events.MANIFEST_PARSED, onManifest);
      return () => {
        hls.off(Hls.Events.MANIFEST_PARSED, onManifest);
        hls.destroy();
      };
    }

    // Native HLS (Safari)
    const onLoaded = () => video.play().catch(() => {});
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', onLoaded);
      return () => video.removeEventListener('loadedmetadata', onLoaded);
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
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
      );
  }

export default App;
