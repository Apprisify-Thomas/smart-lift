import type { Key } from "react";
import type { FloorCompany } from "../types";

export default function FloorCompanyItem({ company, key }: { company: FloorCompany, key: Key | null | undefined }) {
    return <div key={key} style={{ display: "flex", alignItems: "center", justifyContent:"space-between", fontSize: 20 }}>
        {company.name}
        <img src={company.logo} style={{ maxHeight: 20 }}/>
    </div>
}