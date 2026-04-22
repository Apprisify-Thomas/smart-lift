import type { FloorCompany } from '../types';

export default function FloorCompanyItem({ company }: { company: FloorCompany }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: 16,
        gap: 10,
      }}
    >
      <div style={{ minWidth: 100, display: 'flex', justifyContent: 'center' }}>
        <img src={company.logo} style={{ maxHeight: 60, maxWidth: 100, filter: 'saturate(0)' }} />
      </div>
      {company.name}
    </div>
  );
}
