import type { FloorCompany } from '../types';

export default function FloorCompanyItem({ company }: { company: FloorCompany }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 20, gap: 10 }}>
      <img src={company.logo} style={{ maxHeight: 50, maxWidth: 50, filter: 'saturate(0)' }} />
      {company.name}
    </div>
  );
}
