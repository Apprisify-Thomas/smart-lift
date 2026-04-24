import { useState, useEffect } from 'react';
import NumberFlow from '@number-flow/react';
import ImageCarousel from './ImageCarousel';

export default function Header({
  activeFloor,
  nextStop,
}: {
  activeFloor: number;
  nextStop: number | null;
}) {
  const [arrowRotation, setArrowRotation] = useState('rotate(180deg)');
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    if (nextStop !== null) {
      const isMovingDown = nextStop < activeFloor;
      setArrowRotation(isMovingDown ? 'rotate(0deg)' : 'rotate(180deg)');
      setShowArrow(true);
    } else {
      setShowArrow(false);
    }
  }, [nextStop, activeFloor]);
  return (
    <header
      style={{
        display: 'flex',
        gap: '4rem',
        justifyContent: 'space-between',
        maxWidth: 900,
        perspective: '500px',
      }}
    >
      <div>
        <p style={{ fontSize: 40, fontWeight: 300, margin: 0 }}>Floor</p>
        <h2
          className="flex gap-3"
          style={{ minWidth: 150, fontSize: 70, alignItems: 'center', fontWeight: 700, margin: 0 }}
        >
          <NumberFlow
            transformTiming={{ duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            value={activeFloor}
            trend={0}
            style={{ minWidth: 50 }}
            format={{ notation: 'compact' }}
          />
          {showArrow && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="62px"
              viewBox="0 -960 960 960"
              width="62px"
              fill="currentColor"
              style={{ transform: arrowRotation, transition: 'transform 0.5s ease' }}
            >
              <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
            </svg>
          )}
        </h2>
      </div>

      <div>
        <p style={{ fontSize: 40, fontWeight: 300, margin: 0 }}>Next Stop</p>
        <h2
          className="flex gap-3"
          style={{ minWidth: 150, fontSize: 70, alignItems: 'center', fontWeight: 700, margin: 0 }}
        >
          {nextStop !== null ? (
            <NumberFlow
              transformTiming={{ duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              value={nextStop}
              trend={0}
              style={{ minWidth: 50 }}
              format={{ notation: 'compact' }}
            />
          ) : (
            <span style={{ minWidth: 50 }}>-</span>
          )}
        </h2>
      </div>

      <div style={{ width: 420, height: 250 }}>
        <ImageCarousel />
      </div>
    </header>
  );
}
