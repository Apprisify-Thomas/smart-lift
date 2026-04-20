import { useEffect, useState, type CSSProperties } from 'react';
import './App.css'
import useWebSocket from "react-use-websocket";
import type { Floor, SocketAction } from './types';
import FloorItem from './components/FloorItem';
import Building3D from './components/Building3D';
import NumberFlow from '@number-flow/react'
import BackgroundLoop from './components/BackgroundLoop';

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
  const [weather, setWeather] = useState<any>(null);
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null);

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
    fetch('https://wttr.in/?format=j1&lang=de')
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setWeatherIcon(data?.current_condition?.[0]?.weatherIconUrl?.[0]?.value ?? null);
      })
      .catch(err => console.error('Weather fetch error:', err));
  }, []);

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

    return <div style={{ transform: "rotateY(-3deg)", position: "relative", left: 0, top: 0, right: 0, width: 600  }}>
      <img src={path} style={styles} />
    </div>
  }

  return (
    <>
      {/* <BackgroundAnimation /> */}
      <BackgroundLoop />
      <div style={{ position: "relative", paddingTop: 80, zIndex: 20 }}>
        <header style={{ display: "flex", gap: "5rem", margin: "2rem auto 14rem auto", maxWidth: 900, perspective: "500px" }}>
          <div>
            <p style={{ fontSize: 40, fontWeight: 300, margin: 0 }}>Floor</p>
            <h2 className='flex gap-3' style={{ minWidth: 150, fontSize: 70, alignItems: "center", fontWeight: 700, margin: 0 }}>
              
              <NumberFlow 
                transformTiming={{ duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }} 
                value={activeFloor} 
                trend={0} 
                style={{ minWidth: 50 }}
                format={{ notation: "compact" }} 
              />
              <svg xmlns="http://www.w3.org/2000/svg" height="62px" viewBox="0 -960 960 960" width="62px" fill="currentColor" style={{ transform: "rotate(180deg)"}}>
                <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/>
              </svg>
              {/* <NumberFlow 
                transformTiming={{ duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }} 
                value={3} 
                trend={0} 
                style={{ minWidth: 50 }}
                format={{ notation: "compact" }} 
              /> */}
            </h2>
          </div>

          <div>
            <p style={{ fontSize: 40, fontWeight: 300, margin: 0 }}>Next Stop</p>
            <h2 className='flex gap-3' style={{ minWidth: 150, fontSize: 70, alignItems: "center", fontWeight: 700, margin: 0 }}>
              
              <NumberFlow 
                transformTiming={{ duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }} 
                value={3} 
                trend={0} 
                style={{ minWidth: 50 }}
                format={{ notation: "compact" }} 
              />
              / 6sec
            </h2>
          </div>
        </header>

        {/* <div style={{ position: "relative", margin: "0 auto", maxWidth: 900, }}>
            <ImageSlide floor={1} path='/image-1.png' />
            <ImageSlide floor={2} path="/image-2.png" />
            <ImageSlide floor={3} path="/image-3.png" />
            <ImageSlide floor={4} path="/image-4.png" />
            <ImageSlide floor={5} path="/image-3.png" />
          </div> */}

          
        <div className='flex' style={{ margin: "0 auto", maxWidth: 980 }}>
          
            <Building3D activeFloor={activeFloor} totalFloors={5} />
          
          <div 
          className='flex flex-col divide-y-2 divide-neutral-400' 
          style={{ margin: "0 auto", maxWidth: 900, perspective: "800px"}}
        >
          {floors.map((f, i) => <FloorItem key={i} floor={f} active={f.num === activeFloor} />)}
        </div>
        </div>
        <div className='flex gap-10 justify-between' style={{ margin: "10rem auto", maxWidth: 900 }}>
          <div>
            <h2 className='text-2xl font-semibold mb-4 flex items-center gap-3'>
              <svg xmlns="http://www.w3.org/2000/svg" height="38px" viewBox="0 -960 960 960" width="38px" fill="currentColor"><path d="M240-200h480l-57-400H297l-57 400Zm240-480q17 0 28.5-11.5T520-720q0-17-11.5-28.5T480-760q-17 0-28.5 11.5T440-720q0 17 11.5 28.5T480-680Zm113 0h70q30 0 52 20t27 49l57 400q5 36-18.5 63.5T720-120H240q-37 0-60.5-27.5T161-211l57-400q5-29 27-49t52-20h70q-3-10-5-19.5t-2-20.5q0-50 35-85t85-35q50 0 85 35t35 85q0 11-2 20.5t-5 19.5ZM240-200h480-480Z"/></svg>
              Load
            </h2>
            <p className='text-3xl font-extralight'>Medium</p>
          </div>

          <div>
            <h2 className='text-2xl font-semibold mb-4 flex items-center gap-3'>
              <svg xmlns="http://www.w3.org/2000/svg" height="38px" viewBox="0 -960 960 960" width="38px" fill="currentColor"><path d="M457.5-57Q440-74 440-99q0-12 4.5-23t13.5-19l42-39 42 39q9 8 13.5 19t4.5 23q0 25-17.5 42T500-40q-25 0-42.5-17ZM362-100l-42-42 118-118 42 42-118 118Zm258-60-60-60 60-60 60 60-60 60Zm-360 0-60-60 60-60 60 60-60 60Zm40-160q-91 0-155.5-64.5T80-540q0-83 55-145t136-73q32-57 87.5-89.5T480-880q90 0 156.5 57.5T717-679q69 6 116 57t47 122q0 75-52.5 127.5T700-320H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-704l-10 24h-25q-57 2-97.5 42.5T160-540q0 58 41 99t99 41Zm180-200Z"/></svg>
              Weather today
            </h2>
            <div className='flex gap-4'>
              {weatherIcon && (
                <img
                  src={weatherIcon}
                  alt={weather?.current_condition?.[0]?.weatherDesc?.[0]?.value ?? 'Wetter'}
                  style={{ width: 70, height: 70, objectFit: 'contain' }}
                />
              )}
              <p className='text-3xl font-extralight'>
                {weather ? `${weather.current_condition[0].temp_C}°C ${weather.current_condition[0].weatherDesc[0].value}` : 'Lade...'}
              </p>
            </div>
          </div>
        </div>

        <div className='flex gap-10' style={{ 
            margin: "0 auto", maxWidth: 900, marginTop: 55, lineHeight: 1.5, fontSize: 10, opacity: 0.8, fontWeight: 100 }}>
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
