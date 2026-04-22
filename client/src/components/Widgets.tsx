import { useEffect, useState } from 'react';

export default function Widgets() {
  const [weather, setWeather] = useState<any>(null);
  //const [weatherIcon, setWeatherIcon] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetch('https://wttr.in/?format=j1&lang=de')
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        //setWeatherIcon(data?.current_condition?.[0]?.weatherIconUrl?.[0]?.value ?? null);
      })
      .catch((err) => console.error('Weather fetch error:', err));

    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-10 justify-between">
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="38px"
            viewBox="0 -960 960 960"
            width="38px"
            fill="currentColor"
          >
            <path d="M240-200h480l-57-400H297l-57 400Zm240-480q17 0 28.5-11.5T520-720q0-17-11.5-28.5T480-760q-17 0-28.5 11.5T440-720q0 17 11.5 28.5T480-680Zm113 0h70q30 0 52 20t27 49l57 400q5 36-18.5 63.5T720-120H240q-37 0-60.5-27.5T161-211l57-400q5-29 27-49t52-20h70q-3-10-5-19.5t-2-20.5q0-50 35-85t85-35q50 0 85 35t35 85q0 11-2 20.5t-5 19.5ZM240-200h480-480Z" />
          </svg>
          Load
        </h2>
        <p className="text-3xl font-extralight">Medium</p>
      </div>

      <div style={{ minWidth: 250 }}>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="38px"
            viewBox="0 -960 960 960"
            width="38px"
            fill="currentColor"
          >
            <path d="M582-298 440-440v-200h80v167l118 118-56 57ZM440-720v-80h80v80h-80Zm280 280v-80h80v80h-80ZM440-160v-80h80v80h-80ZM160-440v-80h80v80h-80ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
          Date & Time
        </h2>
        <p className="text-3xl font-extralight">
          {currentTime.toLocaleDateString('en-US')} {currentTime.toLocaleTimeString()}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="38px"
            viewBox="0 -960 960 960"
            width="38px"
            fill="currentColor"
          >
            <path d="M457.5-57Q440-74 440-99q0-12 4.5-23t13.5-19l42-39 42 39q9 8 13.5 19t4.5 23q0 25-17.5 42T500-40q-25 0-42.5-17ZM362-100l-42-42 118-118 42 42-118 118Zm258-60-60-60 60-60 60 60-60 60Zm-360 0-60-60 60-60 60 60-60 60Zm40-160q-91 0-155.5-64.5T80-540q0-83 55-145t136-73q32-57 87.5-89.5T480-880q90 0 156.5 57.5T717-679q69 6 116 57t47 122q0 75-52.5 127.5T700-320H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-704l-10 24h-25q-57 2-97.5 42.5T160-540q0 58 41 99t99 41Zm180-200Z" />
          </svg>
          Weather today
        </h2>
        <div className="flex gap-4">
          {/* {weatherIcon && (
            <img
              src={weatherIcon}
              alt={weather?.current_condition?.[0]?.weatherDesc?.[0]?.value ?? 'Wetter'}
              style={{ width: 70, height: 70, objectFit: 'contain' }}
            />
          )} */}
          <p className="text-3xl font-extralight">
            {weather
              ? `${weather.current_condition[0].temp_C}°C ${weather.current_condition[0].weatherDesc[0].value}`
              : 'Lade...'}
          </p>
        </div>
      </div>
    </div>
  );
}
