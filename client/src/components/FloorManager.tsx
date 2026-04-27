import type { Floor } from '../types';
import LiftBuilding from './LiftBuilding';
import FloorItem from './FloorItem';

export default function FloorManager({
  floors,
  activeFloor,
  onFloorClick,
  disabled,
}: {
  floors: Floor[];
  activeFloor: number;
  onFloorClick: (floor: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-10 mb-30">
      <div className="flex flex-col divide-y-2 divide-zinc-500 w-full">
        {floors.map((f, i) => (
          <FloorItem
            key={i}
            floor={f}
            active={f.num === activeFloor}
            onClick={() => onFloorClick(f.num)}
            disabled={disabled}
          />
        ))}
      </div>

      <LiftBuilding activeFloor={activeFloor} totalFloors={5} />
    </div>
  );
}
