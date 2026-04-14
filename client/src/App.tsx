import { useEffect, useState } from 'react';
import './App.css'
import useWebSocket from "react-use-websocket";

interface SocketAction {
  type: string;
  payload: any;
}

function App() {
  const { lastMessage } = useWebSocket("ws://localhost:8082", {
    shouldReconnect: () => {
      return true;
    },
    reconnectAttempts: 60,
    reconnectInterval: 3000,
  });

  const [floors, setFloors] = useState<{ num: number; companies: { name: string; logo: string; }[]}[]>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      const action = JSON.parse(lastMessage.data) as SocketAction;
      
      switch(action.type) {
        case "floors:update":
          setFloors(action.payload);
      }
    }
  }, [lastMessage]);

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "0 auto", maxWidth: 500, gap: 5 }}>
      {floors.map((f, i) => <div key={i} style={{ backgroundColor: "#333", padding: 10 }}>{f.num}<br /><br /> <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {f.companies.map((c, i) => {
        return <div key={i} style={{ display: "flex", alignItems: "center", justifyContent:"space-between" }}>
          
          {c.name}
          <img src={c.logo} style={{ maxHeight: 20 }}/>
        </div>
      })}</div></div>)}
    </div>
  )
}

export default App
