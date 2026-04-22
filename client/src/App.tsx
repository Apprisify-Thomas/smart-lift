import { useEffect, useState } from 'react';
import './App.css';
import useWebSocket from 'react-use-websocket';
import type { Floor, SocketAction } from './types';
import FloorItem from './components/FloorItem';
import Building3D from './components/Building3D';
import Header from './components/Header';
import Footer from './components/Footer';
import Widgets from './components/Widgets';

export default function App() {
  const { lastMessage } = useWebSocket('ws://localhost:8082', {
    shouldReconnect: () => {
      return true;
    },
    reconnectAttempts: 60,
    reconnectInterval: 3000,
  });

  const [activeFloor, setActiveFloor] = useState(0);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextStop, setNextStop] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (lastMessage !== null) {
      const action = JSON.parse(lastMessage.data) as SocketAction;

      switch (action.type) {
        case 'floors:update':
          setFloors(action.payload);
          break;
        case 'email:processing':
          console.log('Email processing:', action.payload);
          setLoading(true);
          break;
        case 'email:processed':
          console.log('Email processed:', action.payload);
          setLoading(false);
          break;
        default:
          console.warn('Unknown action type:', action.type);
      }
    }
  }, [lastMessage]);

  // useEffect(() => {
  //   const timeout = setInterval(() => {
  //     setActiveFloor(activeFloor === floors.length - 1 ? 0 : activeFloor + 1);
  //   }, 4000);
  //   return () => clearTimeout(timeout);
  // }, [activeFloor, floors]);

  const handleFloorClick = (targetFloor: number) => {
    if (animating || targetFloor === activeFloor) return;

    setAnimating(true);
    setNextStop(targetFloor);

    const direction = targetFloor > activeFloor ? 1 : -1;
    const interval = setInterval(() => {
      setActiveFloor((prev) => {
        const next = prev + direction;
        if ((direction === 1 && next >= targetFloor) || (direction === -1 && next <= targetFloor)) {
          clearInterval(interval);
          setAnimating(false);
          setNextStop(null);
          return targetFloor;
        }
        return next;
      });
    }, 1000); // Adjust timing as needed
  };

  return (
    <>
      {loading && (
        <div className="absolute left-0 right-0 bottom-0 top-0 bg-black/70 flex justify-center items-center z-20">
          <div className="bg-white/20 px-5 py-3 rounded-lg">E-Mail received. Processing...</div>
        </div>
      )}
      <div style={{ margin: '5rem auto', maxWidth: 900, position: 'relative' }}>
        <div style={{ position: 'relative', marginBottom: '4rem' }}>
          <Header activeFloor={activeFloor} nextStop={nextStop} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'right', perspective: '600px' }}></div>

        <div className="flex mb-30 gap-15">
          <Building3D activeFloor={activeFloor} totalFloors={5} />
          <div
            className="flex flex-col divide-y-2 divide-neutral-400"
            style={{ margin: '0 auto', perspective: '800px' }}
          >
            {floors.map((f, i) => (
              <FloorItem
                key={i}
                floor={f}
                active={f.num === activeFloor}
                onClick={() => handleFloorClick(f.num)}
                disabled={animating}
              />
            ))}
          </div>
        </div>

        <div>
          <Widgets />
        </div>

        <Footer />
      </div>
    </>
  );
}
