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

  useEffect(() => {
    if (lastMessage !== null) {
      const action = JSON.parse(lastMessage.data) as SocketAction;

      switch (action.type) {
        case 'floors:update':
          setFloors(action.payload);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const timeout = setInterval(() => {
      setActiveFloor(activeFloor === floors.length - 1 ? 0 : activeFloor + 1);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [activeFloor, floors]);

  return (
    <div style={{ margin: '5rem auto', maxWidth: 900, position: 'relative' }}>
      <div style={{ position: 'relative', marginBottom: '5rem' }}>
        <Header activeFloor={activeFloor} />
      </div>

      <div className="flex mb-20">
        <Building3D activeFloor={activeFloor} totalFloors={5} />
        <div
          className="flex flex-col divide-y-2 divide-neutral-400"
          style={{ margin: '0 auto', maxWidth: 900, perspective: '800px' }}
        >
          {floors.map((f, i) => (
            <FloorItem key={i} floor={f} active={f.num === activeFloor} />
          ))}
        </div>
      </div>

      <div>
        <Widgets />
      </div>

      <Footer />
    </div>
  );
}
