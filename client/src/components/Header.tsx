import NumberFlow from '@number-flow/react';

export default function Header({ activeFloor }: { activeFloor: number }) {
  return (
    <header
      style={{
        display: 'flex',
        gap: '5rem',
        margin: '2rem auto 14rem auto',
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="62px"
            viewBox="0 -960 960 960"
            width="62px"
            fill="currentColor"
            style={{ transform: 'rotate(180deg)' }}
          >
            <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
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
        <h2
          className="flex gap-3"
          style={{ minWidth: 150, fontSize: 70, alignItems: 'center', fontWeight: 700, margin: 0 }}
        >
          <NumberFlow
            transformTiming={{ duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            value={4}
            trend={0}
            style={{ minWidth: 50 }}
            format={{ notation: 'compact' }}
          />
          {/* / 6sec */}
        </h2>
      </div>
    </header>
  );
}
