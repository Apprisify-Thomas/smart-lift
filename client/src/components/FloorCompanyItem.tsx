import type { FloorCompany } from '../types';

export default function FloorCompanyItem({ company }: { company: FloorCompany }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: 20,
        gap: 20,
      }}
    >
      <div
        style={{
          minWidth: 110,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {company.logo && (
          <img
            src={company.logo}
            style={{
              maxHeight: 60,
              maxWidth: 110,
              filter: 'saturate(0)',
            }}
          />
        )}
      </div>
      {company.name}
    </div>
  );
}
