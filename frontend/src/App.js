import {useEffect, useState} from "react";
import './App.css';

function App() 
{
  const [channels, setChannels]=useState([]);
  const [selectedChannel, setSelectedChannel] =useState(null);

  useEffect(()=> {
    fetch("http://127.0.0.1:8000/channels")
    .then(res=>res.json())
    .then(data=>setChannels(data))
    .catcg(err=>console.error(err));
  },[]);

  return (
    <div style={{padding: "20px"}}>
      <h1>IPTV Channel List</h1>

      <u1>
        {channels.map((ch, index)=>(
         <li
         key={index}
         onClick={()=> setSelectedChannel(ch)}
         style={{cursor: "pointer"}} 
         >
          {ch.name}
         </li>
        ))}
      </u1>
      {selectedChannel && (
        <video controls width="600>
          <source
            src={selectedChannel.url}
            type="application/x-mpegURL"
          />
        </video>
      )}
    </div>
      );
  }

export default App;
