import { useEffect, useState, type CSSProperties } from 'react';
import './App.css'
import useWebSocket from "react-use-websocket";
import type { Floor, SocketAction } from './types';
import FloorItem from './components/FloorItem';
import BackgroundAnimation from './components/BackgroundAnimation';
import NumberFlow from '@number-flow/react'

export default function App() {
  const { lastMessage } = useWebSocket("ws://localhost:8082", {
    shouldReconnect: () => {
      return true;
    },
    reconnectAttempts: 60,
    reconnectInterval: 3000,
  });

  const [activeFloor, setActiveFloor] = useState(1);
  const [floors, setFloors] = useState<Floor[]>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      const action = JSON.parse(lastMessage.data) as SocketAction;
      
      switch(action.type) {
        case "floors:update":
          setFloors(action.payload);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const timeout = setInterval(() => {
      setActiveFloor(activeFloor === floors.length ? 1 : activeFloor + 1);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [activeFloor, floors]);

  function ImageSlide({ floor, path }: { floor: number; path: string }) {
    const styles: CSSProperties = { position: "absolute", width: "100%", filter: "contrast(1) brightness(1.5) saturate(0.75)", opacity: 0  };

    if(floor === activeFloor) {
      styles.animation = "fadein 0.5s forwards";
    } else if(floor === activeFloor - 1) {
      styles.animation = "fadeout 0.5s forwards";
    }

    return <div style={{ transform: "rotateY(-5deg)", position: "relative", left: 0, top: 0, width: 370  }}>
      <img src={path} style={styles} />
    </div>
  }

  return (
    <>
      <BackgroundAnimation />
      <div style={{ paddingTop: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", margin: "2rem auto 7rem auto", maxWidth: 500, perspective: "500px" }}>
          <div>
            <p style={{ fontSize: 20, fontWeight: 300, margin: 0 }}>Etage</p>
            <h2 style={{ fontSize: 50, fontWeight: 700, margin: 0 }}>
              <NumberFlow 
                transformTiming={{ duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }} 
                value={activeFloor} 
                trend={0} 
                format={{ notation: "compact" }} 
              />
            </h2>
          </div>

          <div style={{ position: "relative", perspective: "100px" }}>
            <ImageSlide floor={1} path='/image-1.png' />
            <ImageSlide floor={2} path="/image-2.png" />
            <ImageSlide floor={3} path="/image-3.png" />
            <ImageSlide floor={4} path="/image-4.png" />
          </div>
        </header>
        <div style={{ display: "flex", flexDirection: "column", margin: "0 auto", maxWidth: 500, gap: 5, zIndex: 1000, perspective: "100px" }}>
          {floors.map((f, i) => <FloorItem key={i} floor={f} active={f.num === activeFloor} />)}
        </div>

        <div style={{ display: "flex", gap: 40, margin: "0 auto", maxWidth: 500, marginTop: 55, lineHeight: 1.5, fontSize: 10, opacity: 0.8, fontWeight: 100 }}>
          <div>
            <p>Lift accepts max 8 persons <br />&copy; Apprisify</p>
          </div>

          <div>
            <p>Press the destination button and stand to the<br /> side to allow space</p>
          </div>
        </div>
      </div>
    </>
  )
}
