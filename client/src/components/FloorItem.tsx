import type { CSSProperties, Key } from "react"
import type { Floor } from "../types"
import FloorCompanyItem from "./FloorCompanyItem"

export default function FloorItem({ floor, key, active }: { floor: Floor, key: Key | null | undefined, active?: boolean }) {
    let containerStyles: CSSProperties = { transition: "0.5s all ease-out" }
    let leftContainerStyles: CSSProperties = { transition: "0.5s all ease-out", backgroundColor: "rgba(255, 255, 255, 0.1)"}
    let rightContainerStyles: CSSProperties = { transition: "0.5s all ease-out", backgroundColor: "rgba(255, 255, 255, 0.03)"}

    if(active) {
        containerStyles = { ...containerStyles, transform: "scale(1)" }
        leftContainerStyles = { ...leftContainerStyles, backgroundColor: "rgba(100, 170, 80, 1)" }
        rightContainerStyles = { ...rightContainerStyles, backgroundColor: "rgba(100, 170, 80, 0.2)" }
    }

    return <div key={key} style={{ display: "flex", gap: 4, ...containerStyles }}>
        <div style={{ display: "flex", justifyContent: "center", fontSize: 30, fontWeight: 700, padding: 15, minWidth: 30, ...leftContainerStyles }}>{floor.num}</div>
        
        <div style={{ display: "flex", flexGrow: 1, flexDirection: "column", gap: 8, padding: 15, ...rightContainerStyles }}>
        {floor.companies.map((c, i) => <FloorCompanyItem key={i} company={c} />)}
      </div>
    </div>
}