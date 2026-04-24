import TimeWidget from './widgets/TimeWidget';
import WeatherWidget from './widgets/WeatherWidget';
import LoadWidget from './widgets/LoadWidget';
import NewsWidget from './widgets/NewsWidget';

export default function Widgets() {
  return (
    <div className="flex flex-col gap-10 mb-20">
      <div className="mb-10">
        <NewsWidget />
      </div>

      <div className="flex gap-10 justify-between">
        <LoadWidget />
        <TimeWidget />
        <WeatherWidget />
      </div>
    </div>
  );
}
