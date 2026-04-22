import type { CSSProperties, MouseEventHandler } from 'react';
import type { Floor } from '../types';
import FloorCompanyItem from './FloorCompanyItem';

interface FloorItemProps {
  floor: Floor;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}

export default function FloorItem({ floor, active, onClick, disabled }: FloorItemProps) {
  let containerStyles: CSSProperties = {
    transition: '0.5s all ease-out',
    transform: 'rotateY(8deg)',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  let leftContainerStyles: CSSProperties = {
    transition: '0.5s all ease-out',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  };

  let rightContainerStyles: CSSProperties = {
    transition: '0.5s all ease-out',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  };

  if (active) {
    containerStyles = { ...containerStyles };
    leftContainerStyles = { ...leftContainerStyles, backgroundColor: 'rgba(80, 80, 210, 1)' };
    rightContainerStyles = { ...rightContainerStyles, backgroundColor: 'rgba(255, 255, 255, 0.1)' };
  }

  return (
    <div style={{ display: 'flex', ...containerStyles }} onClick={disabled ? undefined : onClick}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: 35,
          fontWeight: 700,
          padding: 20,
          minWidth: 80,
          ...leftContainerStyles,
        }}
      >
        {floor.num}
      </div>

      <div
        className="grid grid-cols-2 p-5"
        style={{ flexGrow: 1, gap: 20, ...rightContainerStyles }}
      >
        {floor.companies.map((c, i) => (
          <FloorCompanyItem key={i} company={c} />
        ))}
      </div>
    </div>
  );
}
