import "./App.css";
import { JEWEL_DIAMETER } from "./app-consts";

export function SelectBox() {
  return (
    <button
      className="select-box"
      style={{ height: JEWEL_DIAMETER, width: JEWEL_DIAMETER }}
    ></button>
  );
}
export function SelectGrid() {
  const rows = Array(7).fill(<div>{Array(7).fill(<SelectBox />)}</div>);
  return (
    <div
      className="select-grid"
      style={{ top: JEWEL_DIAMETER / 2, left: JEWEL_DIAMETER / 2 }}
    >
      {rows}
    </div>
  );
}
