import { useEffect, useState } from 'react';
import type { FloorEvent } from '../../types';

export default function EventsWidget({ events }: { events: FloorEvent[] }) {
  const [currentIndex, setCurrentIndex] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (events.length || 1));
    }, 5000); // Change event every 5 seconds
    return () => clearInterval(interval);
  }, [events.length]);

  const currentEvent = events[currentIndex] || events[0];

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="36px"
          viewBox="0 -960 960 960"
          width="36px"
          fill="currentColor"
        >
          <path d="M160-120q-33 0-56.5-23.5T80-200v-640l67 67 66-67 67 67 67-67 66 67 67-67 67 67 66-67 67 67 67-67 66 67 67-67v640q0 33-23.5 56.5T800-120H160Zm0-80h280v-240H160v240Zm360 0h280v-80H520v80Zm0-160h280v-80H520v80ZM160-520h640v-120H160v120Z" />
        </svg>
        Events
      </h2>

      <div className="flex gap-1 my-5">
        {events.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-secondary' : 'bg-neutral-600'
            }`}
          />
        ))}
      </div>
      <div className="relative overflow-hidden">
        <div
          className="transition-all duration-500 ease-in-out"
          style={{
            transform: `translateY(0)`,
            display: 'flex',
            flexDirection: 'row',
            gap: 30,
          }}
        >
          <div className="grow">
            <p className="text-3xl font-extralight truncate">{currentEvent.title}</p>
            <p className="text-lg font-light mb-1">{currentEvent.description}</p>
          </div>
          {/* {currentEvent.floor !== undefined && (
            <p className="text-sm text-neutral-500 mt-1">Floor {currentEvent.floor}</p>
          )} */}

          <div className="h-50 w-60">
            {currentEvent.imageUrl !== undefined && (
              <img
                src={currentEvent.imageUrl}
                alt={currentEvent.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
