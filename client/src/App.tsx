import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import type { Floor, FloorEvent, SocketAction } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import FloorManager from './components/FloorManager';
import EventsWidget from './components/widgets/EventsWidget';
import LoadWidget from './components/widgets/LoadWidget';
import TimeWidget from './components/widgets/TimeWidget';
import WeatherWidget from './components/widgets/WeatherWidget';

export default function App() {
  const { lastMessage } = useWebSocket(
    import.meta.env.VITE_APP_WEBSOCKET_URL ?? 'ws://localhost:8083',
    {
      shouldReconnect: () => {
        return true;
      },
      reconnectAttempts: 60,
      reconnectInterval: 3000,
    }
  );

  const [activeFloor, setActiveFloor] = useState(0);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [events, setEvents] = useState<FloorEvent[]>([]);
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
        case 'events:update':
          setEvents(action.payload);
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

  useEffect(() => {
    const timeout = setInterval(() => {
      setActiveFloor(activeFloor === floors.length - 1 ? 0 : activeFloor + 1);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [activeFloor, floors]);

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
          <div className="bg-white/20 px-5 py-3 rounded-lg">Action received. Processing...</div>
        </div>
      )}
      <div
        className="flex flex-col justify-between"
        style={{ margin: '5rem auto', maxWidth: 880, position: 'relative' }}
      >
        <div className="mb-10">
          <Header activeFloor={activeFloor} nextStop={nextStop} />
        </div>

        <FloorManager
          targetFloor={nextStop !== null && nextStop !== activeFloor ? nextStop : null}
          floors={floors}
          activeFloor={activeFloor}
          onFloorClick={handleFloorClick}
          disabled={animating}
        />

        <div className="flex flex-col gap-10 mb-20">
          {events.length > 0 && (
            <div className="mb-10">
              <EventsWidget events={events} />
            </div>
          )}

          <div className="flex gap-10 justify-between">
            <LoadWidget />
            <TimeWidget />
            <WeatherWidget />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
