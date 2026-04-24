import type { Floor } from '../types';
import Building3D from './Building3D';
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
      <div className="flex flex-col divide-y-2 divide-zinc-200 w-full" style={{}}>
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

      {/* <Building3D activeFloor={activeFloor} totalFloors={5} /> */}
    </div>
  );
}
