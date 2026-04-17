import type { Key } from "react";
import type { FloorCompany } from "../types";

export default function FloorCompanyItem({ company, key }: { company: FloorCompany, key: Key | null | undefined }) {
    return <div key={key} style={{ display: "flex", alignItems: "center", fontSize: 20, gap: 10 }}>
        <img src={company.logo} style={{ maxHeight: 50, filter: "saturate(0)" }} />
        {company.name}
    </div>
}