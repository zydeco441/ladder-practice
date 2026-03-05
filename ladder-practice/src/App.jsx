import { useState, useRef, useEffect } from "react";
import Simulator from "./Simulator";
import packageJson from "../package.json";

const F = "#111";
const S = 1.5;

// ═══════════════════════════════════════════════════════════════════
// SYMBOLS
// ═══════════════════════════════════════════════════════════════════
function NO({ x, y, lbl }) {
  return (
    <g>
      {lbl && <text x={x+12} y={y-8} textAnchor="middle" fontSize="9" fill={F} fontFamily="Arial Narrow,Arial">{lbl}</text>}
      <line x1={x} y1={y} x2={x+8} y2={y} stroke={F} strokeWidth={S}/>
      <circle cx={x+8} cy={y} r="2.2" fill={F}/>
      <line x1={x+8} y1={y-7} x2={x+8} y2={y+7} stroke={F} strokeWidth={S}/>
      <line x1={x+16} y1={y-7} x2={x+16} y2={y+7} stroke={F} strokeWidth={S}/>
      <circle cx={x+16} cy={y} r="2.2" fill={F}/>
      <line x1={x+16} y1={y} x2={x+24} y2={y} stroke={F} strokeWidth={S}/>
    </g>
  );
}
function NC({ x, y, lbl }) {
  return (
    <g>
      {lbl && <text x={x+12} y={y-8} textAnchor="middle" fontSize="9" fill={F} fontFamily="Arial Narrow,Arial">{lbl}</text>}
      <line x1={x} y1={y} x2={x+8} y2={y} stroke={F} strokeWidth={S}/>
      <circle cx={x+8} cy={y} r="2.2" fill={F}/>
      <line x1={x+8} y1={y-7} x2={x+8} y2={y+7} stroke={F} strokeWidth={S}/>
      <line x1={x+16} y1={y-7} x2={x+16} y2={y+7} stroke={F} strokeWidth={S}/>
      <circle cx={x+16} cy={y} r="2.2" fill={F}/>
      <line x1={x+16} y1={y} x2={x+24} y2={y} stroke={F} strokeWidth={S}/>
      <line x1={x+5} y1={y+6} x2={x+19} y2={y-6} stroke={F} strokeWidth={S}/>
    </g>
  );
}
function Coil({ x, y, lbl }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x+5} y2={y} stroke={F} strokeWidth={S}/>
      <circle cx={x+16} cy={y} r="11" fill="none" stroke={F} strokeWidth={S}/>
      <text x={x+16} y={y+3} textAnchor="middle" fontSize="8" fill={F} fontFamily="Arial Narrow,Arial">{lbl}</text>
      <line x1={x+27} y1={y} x2={x+32} y2={y} stroke={F} strokeWidth={S}/>
    </g>
  );
}
function SolCoil({ x, y, lbl }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x+5} y2={y} stroke={F} strokeWidth={S}/>
      <circle cx={x+16} cy={y} r="11" fill="none" stroke={F} strokeWidth={S}/>
      <path d={`M${x+8},${y} q2,-3.5,4,0 q2,3.5,4,0 q2,-3.5,3,0`} fill="none" stroke={F} strokeWidth="1.2"/>
      <text x={x+16} y={y+18} textAnchor="middle" fontSize="8" fill={F} fontFamily="Arial Narrow,Arial">{lbl}</text>
      <line x1={x+27} y1={y} x2={x+32} y2={y} stroke={F} strokeWidth={S}/>
    </g>
  );
}
function Light({ x, y, lbl }) {
  const cx = x+16, cy = y, r = 10, ray = 6;
  return (
    <g>
      <line x1={x} y1={y} x2={x+5} y2={y} stroke={F} strokeWidth={S}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={F} strokeWidth={S}/>
      <line x1={cx-r*0.707-ray*0.707} y1={cy-r*0.707-ray*0.707} x2={cx-r*0.707} y2={cy-r*0.707} stroke={F} strokeWidth="1.3"/>
      <line x1={cx+r*0.707} y1={cy-r*0.707} x2={cx+r*0.707+ray*0.707} y2={cy-r*0.707-ray*0.707} stroke={F} strokeWidth="1.3"/>
      <line x1={cx-r*0.707-ray*0.707} y1={cy+r*0.707+ray*0.707} x2={cx-r*0.707} y2={cy+r*0.707} stroke={F} strokeWidth="1.3"/>
      <line x1={cx+r*0.707} y1={cy+r*0.707} x2={cx+r*0.707+ray*0.707} y2={cy+r*0.707+ray*0.707} stroke={F} strokeWidth="1.3"/>
      <text x={cx} y={cy+3} textAnchor="middle" fontSize="8" fontWeight="bold" fill={F} fontFamily="Arial Narrow,Arial">{lbl}</text>
      <line x1={x+27} y1={y} x2={x+32} y2={y} stroke={F} strokeWidth={S}/>
    </g>
  );
}
function LS({ x, y, lbl, nc }) {
  return (
    <g>
      {lbl && <text x={x+14} y={y-18} textAnchor="middle" fontSize="9" fill={F} fontFamily="Arial Narrow,Arial">{lbl}</text>}
      <line x1={x} y1={y} x2={x+6} y2={y} stroke={F} strokeWidth={S}/>
      <circle cx={x+6} cy={y} r="2.2" fill={F}/>
      <rect x={x+6} y={y-9} width="16" height="9" fill="none" stroke={F} strokeWidth={S}/>
      <line x1={x+10} y1={y-9} x2={x+16} y2={y-16} stroke={F} strokeWidth={S}/>
      <circle cx={x+17} cy={y-17} r="2.5" fill="none" stroke={F} strokeWidth="1.2"/>
      {nc && <line x1={x+6} y1={y+3} x2={x+22} y2={y-9} stroke={F} strokeWidth={S}/>}
      <circle cx={x+22} cy={y} r="2.2" fill={F}/>
      <line x1={x+22} y1={y} x2={x+28} y2={y} stroke={F} strokeWidth={S}/>
    </g>
  );
}
function TimerCoil({ x, y, lbl, type }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x+5} y2={y} stroke={F} strokeWidth={S}/>
      <circle cx={x+16} cy={y} r="11" fill="none" stroke={F} strokeWidth={S}/>
      <text x={x+16} y={y-1} textAnchor="middle" fontSize="7" fill={F} fontFamily="Arial Narrow,Arial">{lbl}</text>
      <text x={x+16} y={y+8} textAnchor="middle" fontSize="6" fill={F} fontFamily="Arial Narrow,Arial">{type}</text>
      <line x1={x+27} y1={y} x2={x+32} y2={y} stroke={F} strokeWidth={S}/>
    </g>
  );
}
function EStop({ x, y }) {
  return (
    <g>
      <text x={x+12} y={y-8} textAnchor="middle" fontSize="9" fill={F} fontFamily="Arial Narrow,Arial">E-STOP</text>
      <line x1={x} y1={y} x2={x+8} y2={y} stroke={F} strokeWidth={S}/>
      <circle cx={x+8} cy={y} r="2.2" fill={F}/>
      <line x1={x+8} y1={y-7} x2={x+8} y2={y+7} stroke={F} strokeWidth={S}/>
      <line x1={x+16} y1={y-7} x2={x+16} y2={y+7} stroke={F} strokeWidth={S}/>
      <circle cx={x+16} cy={y} r="2.2" fill={F}/>
      <line x1={x+16} y1={y} x2={x+24} y2={y} stroke={F} strokeWidth={S}/>
      <line x1={x+5} y1={y+7} x2={x+19} y2={y-7} stroke={F} strokeWidth={S}/>
      <line x1={x+12} y1={y-9} x2={x+15} y2={y-15} stroke={F} strokeWidth="1.2"/>
    </g>
  );
}

function SymbolIcon({ symbol }) {
  const y = 18;
  const lx = 19;
  const rx = 45;
  const wireL = 7;
  const wireR = 57;
  const mid = (lx + rx) / 2;
  const stroke = { stroke: F, strokeWidth: 1.8, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

  const baseWires = (
    <>
      <line x1={wireL} y1={y} x2={lx} y2={y} {...stroke}/>
      <circle cx={lx} cy={y} r="2.2" fill={F}/>
      <circle cx={rx} cy={y} r="2.2" fill={F}/>
      <line x1={rx} y1={y} x2={wireR} y2={y} {...stroke}/>
    </>
  );

  const icon = (() => {
    switch (symbol) {
      case "NO Contact":
        return (
          <>
            {baseWires}
            <line x1={lx} y1={y-8} x2={lx} y2={y+8} {...stroke}/>
            <line x1={rx} y1={y-8} x2={rx} y2={y+8} {...stroke}/>
          </>
        );
      case "NC Contact":
        return (
          <>
            {baseWires}
            <line x1={lx} y1={y-8} x2={lx} y2={y+8} {...stroke}/>
            <line x1={rx} y1={y-8} x2={rx} y2={y+8} {...stroke}/>
            <line x1={lx+3} y1={y+7} x2={rx-3} y2={y-7} {...stroke}/>
          </>
        );
      case "NO Pushbutton":
        return (
          <>
            {baseWires}
            <line x1={lx+1} y1={y-6} x2={rx-1} y2={y-6} {...stroke}/>
            <line x1={mid} y1={y-14} x2={mid} y2={y-6} {...stroke}/>
          </>
        );
      case "NC Pushbutton":
        return (
          <>
            {baseWires}
            <line x1={lx} y1={y} x2={rx} y2={y} {...stroke}/>
            <line x1={mid} y1={y-12} x2={mid} y2={y} {...stroke}/>
          </>
        );
      case "Coil":
        return (
          <>
            <line x1={wireL} y1={y} x2={18} y2={y} {...stroke}/>
            <circle cx={33} cy={y} r="11" {...stroke}/>
            <text x="33" y="21" textAnchor="middle" fontSize="8" fill={F} fontFamily="Arial Narrow,Arial" fontWeight="bold">CR</text>
            <line x1={44} y1={y} x2={wireR} y2={y} {...stroke}/>
          </>
        );
      case "Solenoid":
        return (
          <>
            {baseWires}
            <polyline points={`${lx+2},${y} ${mid-4},${y} ${mid+1},${y-8} ${mid+6},${y+8} ${rx-2},${y}`} {...stroke}/>
          </>
        );
      case "Pilot Light":
        return (
          <>
            <line x1={wireL} y1={y} x2={18} y2={y} {...stroke}/>
            <circle cx={33} cy={y} r="10" {...stroke}/>
            <line x1="24" y1="9" x2="20" y2="5" {...stroke}/>
            <line x1="42" y1="9" x2="46" y2="5" {...stroke}/>
            <line x1="24" y1="27" x2="20" y2="31" {...stroke}/>
            <line x1="42" y1="27" x2="46" y2="31" {...stroke}/>
            <text x="33" y="21" textAnchor="middle" fontSize="8" fill={F} fontFamily="Arial Narrow,Arial">L</text>
            <line x1={44} y1={y} x2={wireR} y2={y} {...stroke}/>
          </>
        );
      case "Timer":
        return (
          <>
            <line x1={wireL} y1={y} x2={18} y2={y} {...stroke}/>
            <circle cx={33} cy={y} r="11" {...stroke}/>
            <text x="33" y="21" textAnchor="middle" fontSize="8" fill={F} fontFamily="Arial Narrow,Arial" fontWeight="bold">TR</text>
            <line x1={44} y1={y} x2={wireR} y2={y} {...stroke}/>
          </>
        );
      case "NO Limit Switch":
        return (
          <>
            {baseWires}
            <polygon points={`${lx+2},${y} ${lx+10},${y-4} ${lx+10},${y+4}`} {...stroke}/>
            <line x1={lx+2} y1={y} x2={rx-5} y2={y+5} {...stroke}/>
          </>
        );
      case "NC Limit Switch":
        return (
          <>
            {baseWires}
            <polygon points={`${lx+2},${y} ${lx+10},${y-4} ${lx+10},${y+4}`} {...stroke}/>
            <line x1={lx+2} y1={y} x2={rx-2} y2={y-1} {...stroke}/>
          </>
        );
      case "E-STOP":
        return (
          <>
            {baseWires}
            <line x1={lx} y1={y} x2={rx} y2={y} {...stroke}/>
            <path d={`M${lx+1},${y-1} Q${mid},${y-14} ${rx-1},${y-1}`} {...stroke}/>
            <line x1={mid} y1={y} x2={mid} y2={y-9} {...stroke}/>
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <svg width="72" height="34" viewBox="0 0 64 34" aria-hidden="true">
      {icon}
    </svg>
  );
}

function W({ x1, y1, x2, y2 }) { return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={F} strokeWidth={S}/>; }
function Dot({ x, y }) { return <circle cx={x} cy={y} r="2.8" fill={F}/>; }
function Rails({ L1, L2, y1, y2 }) {
  return (
    <g>
      <line x1={L1} y1={y1} x2={L1} y2={y2} stroke={F} strokeWidth="3"/>
      <text x={L1} y={y1-6} textAnchor="middle" fontSize="10" fontWeight="bold" fill={F} fontFamily="Arial Narrow,Arial">24V</text>
      <line x1={L2} y1={y1} x2={L2} y2={y2} stroke={F} strokeWidth="3"/>
      <text x={L2} y={y1-6} textAnchor="middle" fontSize="10" fontWeight="bold" fill={F} fontFamily="Arial Narrow,Arial">0V</text>
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DIAGRAMS
// ═══════════════════════════════════════════════════════════════════
function DiagSimpleLightControl() {
  const L1=28,L2=500,H=175; const r=[60,118];
  return (
    <svg width="100%" viewBox={`0 0 530 ${H}`} style={{background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
      <Rails L1={L1} L2={L2} y1={22} y2={H-8}/>
      <W x1={L1} y1={r[0]} x2={45} y2={r[0]}/><EStop x={45} y={r[0]}/>
      <W x1={69} y1={r[0]} x2={95} y2={r[0]}/><NC x={95} y={r[0]} lbl="STOP"/>
      <W x1={119} y1={r[0]} x2={145} y2={r[0]}/><Dot x={145} y={r[0]}/>
      <NO x={145} y={r[0]} lbl="START"/><W x1={169} y1={r[0]} x2={195} y2={r[0]}/><Dot x={195} y={r[0]}/>
      <W x1={195} y1={r[0]} x2={420} y2={r[0]}/><Coil x={420} y={r[0]} lbl="CR1"/><W x1={452} y1={r[0]} x2={L2} y2={r[0]}/>
      <W x1={145} y1={r[0]} x2={145} y2={r[0]+30}/><W x1={195} y1={r[0]} x2={195} y2={r[0]+30}/>
      <NO x={152} y={r[0]+30} lbl="CR1-1"/><W x1={145} y1={r[0]+30} x2={152} y2={r[0]+30}/><W x1={176} y1={r[0]+30} x2={195} y2={r[0]+30}/>
      <W x1={L1} y1={r[1]} x2={60} y2={r[1]}/><NO x={60} y={r[1]} lbl="CR1-2"/>
      <W x1={84} y1={r[1]} x2={420} y2={r[1]}/><Light x={420} y={r[1]} lbl="G"/><W x1={452} y1={r[1]} x2={L2} y2={r[1]}/>
    </svg>
  );
}
function DiagTwoLights() {
  const L1=28,L2=500,H=210; const r=[58,112,163];
  return (
    <svg width="100%" viewBox={`0 0 530 ${H}`} style={{background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
      <Rails L1={L1} L2={L2} y1={22} y2={H-8}/>
      <W x1={L1} y1={r[0]} x2={45} y2={r[0]}/><EStop x={45} y={r[0]}/>
      <W x1={69} y1={r[0]} x2={95} y2={r[0]}/><NC x={95} y={r[0]} lbl="STOP"/>
      <W x1={119} y1={r[0]} x2={145} y2={r[0]}/><Dot x={145} y={r[0]}/>
      <NO x={145} y={r[0]} lbl="START"/><W x1={169} y1={r[0]} x2={195} y2={r[0]}/><Dot x={195} y={r[0]}/>
      <W x1={195} y1={r[0]} x2={420} y2={r[0]}/><Coil x={420} y={r[0]} lbl="CR1"/><W x1={452} y1={r[0]} x2={L2} y2={r[0]}/>
      <W x1={145} y1={r[0]} x2={145} y2={r[0]+30}/><W x1={195} y1={r[0]} x2={195} y2={r[0]+30}/>
      <NO x={152} y={r[0]+30} lbl="CR1-1"/><W x1={145} y1={r[0]+30} x2={152} y2={r[0]+30}/><W x1={176} y1={r[0]+30} x2={195} y2={r[0]+30}/>
      <W x1={L1} y1={r[1]} x2={60} y2={r[1]}/><NO x={60} y={r[1]} lbl="CR1-2"/><W x1={84} y1={r[1]} x2={420} y2={r[1]}/><Light x={420} y={r[1]} lbl="G"/><W x1={452} y1={r[1]} x2={L2} y2={r[1]}/>
      <W x1={L1} y1={r[2]} x2={60} y2={r[2]}/><NC x={60} y={r[2]} lbl="CR1-3"/><W x1={84} y1={r[2]} x2={420} y2={r[2]}/><Light x={420} y={r[2]} lbl="R"/><W x1={452} y1={r[2]} x2={L2} y2={r[2]}/>
    </svg>
  );
}
function DiagThreeLightsTimer() {
  const L1=28,L2=500,H=245; const r=[58,112,162,210];
  return (
    <svg width="100%" viewBox={`0 0 530 ${H}`} style={{background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
      <Rails L1={L1} L2={L2} y1={22} y2={H-8}/>
      <W x1={L1} y1={r[0]} x2={45} y2={r[0]}/><EStop x={45} y={r[0]}/>
      <W x1={69} y1={r[0]} x2={95} y2={r[0]}/><NO x={95} y={r[0]} lbl="1PB"/>
      <W x1={119} y1={r[0]} x2={145} y2={r[0]}/><NC x={145} y={r[0]} lbl="2PB"/>
      <W x1={169} y1={r[0]} x2={410} y2={r[0]}/><TimerCoil x={410} y={r[0]} lbl="1TR" type="TON"/><W x1={442} y1={r[0]} x2={L2} y2={r[0]}/>
      <W x1={L1} y1={r[1]} x2={60} y2={r[1]}/><NO x={60} y={r[1]} lbl="1TR-1"/><W x1={84} y1={r[1]} x2={420} y2={r[1]}/><Coil x={420} y={r[1]} lbl="CR1"/><W x1={452} y1={r[1]} x2={L2} y2={r[1]}/>
      <W x1={L1} y1={r[2]} x2={60} y2={r[2]}/><NC x={60} y={r[2]} lbl="CR1-1"/><W x1={84} y1={r[2]} x2={420} y2={r[2]}/><Light x={420} y={r[2]} lbl="Y"/><W x1={452} y1={r[2]} x2={L2} y2={r[2]}/>
      <W x1={L1} y1={r[3]} x2={60} y2={r[3]}/><NO x={60} y={r[3]} lbl="CR1-2"/><W x1={84} y1={r[3]} x2={420} y2={r[3]}/><Light x={420} y={r[3]} lbl="G"/><W x1={452} y1={r[3]} x2={L2} y2={r[3]}/>
    </svg>
  );
}
function DiagBasicCylinder() {
  const L1=28,L2=500,H=340; const r=[58,112,165];
  return (
    <svg width="100%" viewBox={`0 0 530 ${H}`} style={{background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
      <Rails L1={L1} L2={L2} y1={22} y2={210}/>
      <W x1={L1} y1={r[0]} x2={45} y2={r[0]}/><EStop x={45} y={r[0]}/>
      <W x1={69} y1={r[0]} x2={95} y2={r[0]}/><NC x={95} y={r[0]} lbl="STOP"/>
      <W x1={119} y1={r[0]} x2={145} y2={r[0]}/><Dot x={145} y={r[0]}/>
      <NO x={145} y={r[0]} lbl="START"/><W x1={169} y1={r[0]} x2={195} y2={r[0]}/><Dot x={195} y={r[0]}/>
      <W x1={195} y1={r[0]} x2={420} y2={r[0]}/><Coil x={420} y={r[0]} lbl="CR1"/><W x1={452} y1={r[0]} x2={L2} y2={r[0]}/>
      <W x1={145} y1={r[0]} x2={145} y2={r[0]+30}/><W x1={195} y1={r[0]} x2={195} y2={r[0]+30}/>
      <NO x={152} y={r[0]+30} lbl="CR1-1"/><W x1={145} y1={r[0]+30} x2={152} y2={r[0]+30}/><W x1={176} y1={r[0]+30} x2={195} y2={r[0]+30}/>
      <W x1={L1} y1={r[1]} x2={60} y2={r[1]}/><NO x={60} y={r[1]} lbl="CR1-2"/>
      <W x1={84} y1={r[1]} x2={110} y2={r[1]}/><LS x={110} y={r[1]} lbl="2LS" nc={true}/>
      <W x1={138} y1={r[1]} x2={420} y2={r[1]}/><SolCoil x={420} y={r[1]} lbl="SOL-A"/><W x1={452} y1={r[1]} x2={L2} y2={r[1]}/>
      <W x1={L1} y1={r[2]} x2={60} y2={r[2]}/><NO x={60} y={r[2]} lbl="CR1-3"/><W x1={84} y1={r[2]} x2={420} y2={r[2]}/><Light x={420} y={r[2]} lbl="G"/><W x1={452} y1={r[2]} x2={L2} y2={r[2]}/>
      <text x={265} y={228} textAnchor="middle" fontSize="9" fontWeight="bold" fill={F} fontFamily="Arial Narrow,Arial">PNEUMATIC</text>
      <line x1={265} y1={232} x2={265} y2={244} stroke={F} strokeWidth={S}/>
      <rect x={244} y={244} width={42} height={15} fill="none" stroke={F} strokeWidth={S}/>
      <text x={265} y={255} textAnchor="middle" fontSize="8" fill={F} fontFamily="Arial Narrow,Arial">FRL</text>
      <line x1={265} y1={259} x2={265} y2={272} stroke={F} strokeWidth={S}/>
      <rect x={242} y={272} width={24} height={17} fill="none" stroke={F} strokeWidth={S}/>
      <line x1={249} y1={272} x2={258} y2={289} stroke={F} strokeWidth="1"/><line x1={249} y1={289} x2={258} y2={272} stroke={F} strokeWidth="1"/>
      <rect x={266} y={272} width={24} height={17} fill="none" stroke={F} strokeWidth={S}/>
      <text x={278} y={283} textAnchor="middle" fontSize="7" fill={F} fontFamily="Arial Narrow,Arial">SOL</text>
      <line x1={300} y1={280} x2={322} y2={280} stroke={F} strokeWidth={S}/>
      <rect x={322} y={272} width={60} height={17} fill="none" stroke={F} strokeWidth={S}/>
      <rect x={373} y={275} width={4} height={11} fill={F}/>
      <line x1={377} y1={280} x2={393} y2={280} stroke={F} strokeWidth="2.5"/>
      <path d="M327,280 q3,-3.5,6,0 q3,3.5,5,0 q2,-3.5,4,0" fill="none" stroke={F} strokeWidth="1.2"/>
      <text x={324} y={268} fontSize="7" fill="#555" fontFamily="Arial Narrow,Arial">1LS</text>
      <text x={371} y={268} fontSize="7" fill="#555" fontFamily="Arial Narrow,Arial">2LS</text>
    </svg>
  );
}
function DiagJogging() {
  const L1=28,L2=500,H=210; const r=[60,140];
  return (
    <svg width="100%" viewBox={`0 0 530 ${H}`} style={{background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
      <Rails L1={L1} L2={L2} y1={22} y2={H-8}/>
      <W x1={L1} y1={r[0]} x2={40} y2={r[0]}/><EStop x={40} y={r[0]}/>
      <W x1={64} y1={r[0]} x2={90} y2={r[0]}/><NC x={90} y={r[0]} lbl="STOP"/>
      <W x1={114} y1={r[0]} x2={140} y2={r[0]}/><Dot x={140} y={r[0]}/>
      <NO x={140} y={r[0]} lbl="START"/><W x1={164} y1={r[0]} x2={190} y2={r[0]}/><Dot x={190} y={r[0]}/>
      <NC x={190} y={r[0]} lbl="JOG"/><W x1={214} y1={r[0]} x2={240} y2={r[0]}/>
      <NC x={240} y={r[0]} lbl="OL"/><W x1={264} y1={r[0]} x2={420} y2={r[0]}/>
      <Coil x={420} y={r[0]} lbl="M"/><W x1={452} y1={r[0]} x2={L2} y2={r[0]}/>
      <W x1={140} y1={r[0]} x2={140} y2={r[0]+35}/><W x1={190} y1={r[0]} x2={190} y2={r[0]+35}/>
      <NO x={147} y={r[0]+35} lbl="M-1"/><W x1={140} y1={r[0]+35} x2={147} y2={r[0]+35}/><W x1={171} y1={r[0]+35} x2={190} y2={r[0]+35}/>
      <W x1={L1} y1={r[1]} x2={55} y2={r[1]}/><NO x={55} y={r[1]} lbl="JOG"/>
      <W x1={79} y1={r[1]} x2={240} y2={r[1]}/><NC x={240} y={r[1]} lbl="OL"/>
      <W x1={264} y1={r[1]} x2={420} y2={r[1]}/><Coil x={420} y={r[1]} lbl="M"/><W x1={452} y1={r[1]} x2={L2} y2={r[1]}/>
    </svg>
  );
}
function DiagFwdRev() {
  const L1=28,L2=520,H=265; const r=[60,130,192];
  return (
    <svg width="100%" viewBox={`0 0 550 ${H}`} style={{background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
      <Rails L1={L1} L2={L2} y1={22} y2={H-8}/>
      <W x1={L1} y1={r[0]} x2={40} y2={r[0]}/><EStop x={40} y={r[0]}/>
      <W x1={64} y1={r[0]} x2={90} y2={r[0]}/><NC x={90} y={r[0]} lbl="STOP"/>
      <W x1={114} y1={r[0]} x2={140} y2={r[0]}/><Dot x={140} y={r[0]}/>
      <NO x={140} y={r[0]} lbl="F-PB"/><W x1={164} y1={r[0]} x2={190} y2={r[0]}/><Dot x={190} y={r[0]}/>
      <NC x={190} y={r[0]} lbl="R"/><W x1={214} y1={r[0]} x2={240} y2={r[0]}/>
      <NC x={240} y={r[0]} lbl="OL"/><W x1={264} y1={r[0]} x2={450} y2={r[0]}/>
      <Coil x={450} y={r[0]} lbl="F"/><W x1={482} y1={r[0]} x2={L2} y2={r[0]}/>
      <W x1={140} y1={r[0]} x2={140} y2={r[0]+30}/><W x1={190} y1={r[0]} x2={190} y2={r[0]+30}/>
      <NO x={147} y={r[0]+30} lbl="F-1"/><W x1={140} y1={r[0]+30} x2={147} y2={r[0]+30}/><W x1={171} y1={r[0]+30} x2={190} y2={r[0]+30}/>
      <W x1={L1} y1={r[1]} x2={40} y2={r[1]}/><EStop x={40} y={r[1]}/>
      <W x1={64} y1={r[1]} x2={90} y2={r[1]}/><NC x={90} y={r[1]} lbl="STOP"/>
      <W x1={114} y1={r[1]} x2={140} y2={r[1]}/><Dot x={140} y={r[1]}/>
      <NO x={140} y={r[1]} lbl="R-PB"/><W x1={164} y1={r[1]} x2={190} y2={r[1]}/><Dot x={190} y={r[1]}/>
      <NC x={190} y={r[1]} lbl="F"/><W x1={214} y1={r[1]} x2={240} y2={r[1]}/>
      <NC x={240} y={r[1]} lbl="OL"/><W x1={264} y1={r[1]} x2={450} y2={r[1]}/>
      <Coil x={450} y={r[1]} lbl="R"/><W x1={482} y1={r[1]} x2={L2} y2={r[1]}/>
      <W x1={140} y1={r[1]} x2={140} y2={r[1]+30}/><W x1={190} y1={r[1]} x2={190} y2={r[1]+30}/>
      <NO x={147} y={r[1]+30} lbl="R-1"/><W x1={140} y1={r[1]+30} x2={147} y2={r[1]+30}/><W x1={171} y1={r[1]+30} x2={190} y2={r[1]+30}/>
      <W x1={L1} y1={r[2]} x2={60} y2={r[2]}/><NO x={60} y={r[2]} lbl="F-2"/>
      <W x1={84} y1={r[2]} x2={450} y2={r[2]}/><Light x={450} y={r[2]} lbl="G"/><W x1={482} y1={r[2]} x2={L2} y2={r[2]}/>
    </svg>
  );
}
function DiagDoubleActing() {
  const L1=28,L2=510,H=365; const r=[55,108,160,212];
  return (
    <svg width="100%" viewBox={`0 0 540 ${H}`} style={{background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
      <Rails L1={L1} L2={L2} y1={22} y2={248}/>
      <W x1={L1} y1={r[0]} x2={40} y2={r[0]}/><EStop x={40} y={r[0]}/>
      <W x1={64} y1={r[0]} x2={90} y2={r[0]}/><NC x={90} y={r[0]} lbl="STOP"/>
      <W x1={114} y1={r[0]} x2={140} y2={r[0]}/><Dot x={140} y={r[0]}/>
      <NO x={140} y={r[0]} lbl="START"/><W x1={164} y1={r[0]} x2={190} y2={r[0]}/><Dot x={190} y={r[0]}/>
      <LS x={190} y={r[0]} lbl="1LS"/><W x1={218} y1={r[0]} x2={440} y2={r[0]}/>
      <Coil x={440} y={r[0]} lbl="CR1"/><W x1={472} y1={r[0]} x2={L2} y2={r[0]}/>
      <W x1={140} y1={r[0]} x2={140} y2={r[0]+30}/><W x1={190} y1={r[0]} x2={190} y2={r[0]+30}/>
      <NO x={147} y={r[0]+30} lbl="CR1-1"/><W x1={140} y1={r[0]+30} x2={147} y2={r[0]+30}/><W x1={171} y1={r[0]+30} x2={190} y2={r[0]+30}/>
      <W x1={L1} y1={r[1]} x2={55} y2={r[1]}/><NO x={55} y={r[1]} lbl="CR1-2"/>
      <W x1={79} y1={r[1]} x2={105} y2={r[1]}/><NC x={105} y={r[1]} lbl="SOL-B"/>
      <W x1={129} y1={r[1]} x2={440} y2={r[1]}/><SolCoil x={440} y={r[1]} lbl="SOL-A"/><W x1={472} y1={r[1]} x2={L2} y2={r[1]}/>
      <W x1={L1} y1={r[2]} x2={55} y2={r[2]}/><LS x={55} y={r[2]} lbl="2LS"/>
      <W x1={83} y1={r[2]} x2={109} y2={r[2]}/><NC x={109} y={r[2]} lbl="SOL-A"/>
      <W x1={133} y1={r[2]} x2={440} y2={r[2]}/><SolCoil x={440} y={r[2]} lbl="SOL-B"/><W x1={472} y1={r[2]} x2={L2} y2={r[2]}/>
      <W x1={L1} y1={r[3]} x2={55} y2={r[3]}/><NO x={55} y={r[3]} lbl="CR1-3"/>
      <W x1={79} y1={r[3]} x2={440} y2={r[3]}/><Light x={440} y={r[3]} lbl="G"/><W x1={472} y1={r[3]} x2={L2} y2={r[3]}/>
      <text x={270} y={265} textAnchor="middle" fontSize="9" fontWeight="bold" fill={F} fontFamily="Arial Narrow,Arial">PNEUMATIC — 5/2 Double Solenoid Valve</text>
      <rect x={208} y={273} width={24} height={18} fill="none" stroke={F} strokeWidth={S}/>
      <line x1={215} y1={273} x2={224} y2={291} stroke={F} strokeWidth="1"/><line x1={215} y1={291} x2={224} y2={273} stroke={F} strokeWidth="1"/>
      <rect x={232} y={273} width={24} height={18} fill="none" stroke={F} strokeWidth={S}/>
      <line x1={239} y1={273} x2={248} y2={291} stroke={F} strokeWidth="1"/><line x1={239} y1={291} x2={248} y2={273} stroke={F} strokeWidth="1"/>
      <rect x={256} y={273} width={24} height={18} fill="none" stroke={F} strokeWidth={S}/>
      <text x={197} y={285} fontSize="7" fill={F} fontFamily="Arial Narrow,Arial">SOL-A</text><text x={283} y={285} fontSize="7" fill={F} fontFamily="Arial Narrow,Arial">SOL-B</text>
      <line x1={268} y1={273} x2={268} y2={263} stroke={F} strokeWidth={S}/>
      <rect x={316} y={271} width={75} height={20} fill="none" stroke={F} strokeWidth={S}/>
      <rect x={316} y={275} width={7} height={12} fill="#aaa"/>
      <line x1={323} y1={281} x2={391} y2={281} stroke={F} strokeWidth="2.5"/>
      <text x={312} y={267} fontSize="7" fill="#555" fontFamily="Arial Narrow,Arial">1LS</text><text x={383} y={267} fontSize="7" fill="#555" fontFamily="Arial Narrow,Arial">2LS</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CIRCUITS DATA
// ═══════════════════════════════════════════════════════════════════
const CIRCUITS = [
  { id:1, name:"Start / Stop — Light Output", diff:"Beginner", ch:"Ch. 3", type:"guided",
    params:["24V / 0V rails. E-STOP (NC) on 24V rail before all rungs.","Rung 1: NC STOP — NO START — CR1 coil. CR1-1 seal-in contact wired in parallel with START.","Rung 2: NO CR1-2 contact — G (green pilot light).","When START is pressed, CR1 energizes and seals in. Green light turns on. STOP or E-STOP kills everything."],
    tips:["STOP is NC — it must open to kill the relay","Seal-in CR1-1 is in parallel with START so releasing START keeps CR1 held","Pilot light G uses a circle with 4 rays, labeled G"],
    checkpoints:["E-STOP NC on 24V rail","NC STOP present","NO START present","CR1-1 seal-in parallel with START","G light on second rung","All contacts labeled"],
    diagram:<DiagSimpleLightControl/> },
  { id:2, name:"Run / Stop — Green ON, Red OFF", diff:"Beginner", ch:"Ch. 3", type:"guided",
    params:["24V / 0V rails. E-STOP (NC) on 24V rail.","Rung 1: NC STOP — NO START — CR1 coil. CR1-1 seal-in parallel with START.","Rung 2: NO CR1-2 — G (green light). Green is ON when running.","Rung 3: NC CR1-3 — R (red light). Red is ON when stopped.","Only one light should be on at a time."],
    tips:["NO CR1 → green: on only when relay is energized","NC CR1 → red: on only when relay is de-energized","Mutually exclusive — when one is on the other is off"],
    checkpoints:["CR1 seal-in rung","NO CR1-2 → G light","NC CR1-3 → R light","Lights mutually exclusive","E-STOP present"],
    diagram:<DiagTwoLights/> },
  { id:3, name:"Timer → Light Color Change", diff:"Beginner", ch:"Ch. 6", type:"guided",
    params:["24V / 0V rails. E-STOP (NC) on 24V rail.","Rung 1: NO 1PB — NC 2PB — 1TR coil (TON timer).","Rung 2: NO 1TR-1 (timed contact, draw with downward arrow) — CR1 coil.","Rung 3: NC CR1-1 — Y (yellow light). On before timer expires.","Rung 4: NO CR1-2 — G (green light). On after timer expires.","2PB cancels the timer at any time."],
    tips:["TON: coil energizes immediately, timed contact closes after delay","Timed contact drawn with a downward arrow below the bars","Yellow NC CR1 = on before; Green NO CR1 = on after"],
    checkpoints:["1TR coil labeled TON","Timed contact with downward arrow","CR1 energizes after timer","NC CR1 → Y light","NO CR1 → G light","2PB NC cancels timer"],
    diagram:<DiagThreeLightsTimer/> },
  { id:4, name:"Single-Acting Cylinder w/ Limit Switch", diff:"Beginner", ch:"Ch. 7", type:"guided",
    params:["24V / 0V rails. E-STOP (NC) on 24V rail.","Rung 1: NC STOP — NO START — CR1 coil. CR1-1 seal-in parallel with START.","Rung 2: NO CR1-2 — NC 2LS (opens when cylinder fully extends) — SOL-A coil (circle with wave).","Rung 3: NO CR1-3 — G (green light, cycle active).","Pneumatic: Air supply → FRL → 3/2 NO solenoid valve (SOL-A) → single-acting spring-return cylinder. Mark 1LS at retract end and 2LS at extend end."],
    tips:["SOL-A symbol is a circle with a squiggle/wave inside","FRL always first after supply","2LS is NC — extension trips it open, cutting SOL-A power"],
    checkpoints:["CR1 seal-in rung","SOL-A solenoid coil with wave symbol","2LS NC in SOL rung","G light on third rung","FRL on pneumatic","3/2 valve symbol","1LS and 2LS on cylinder"],
    diagram:<DiagBasicCylinder/> },
  { id:5, name:"Jogging Circuit", diff:"Intermediate", ch:"Ch. 4", type:"guided",
    params:["24V / 0V rails. E-STOP (NC) on 24V rail.","Rung 1: NC STOP — NO START — NC JOG — NC OL — M coil. M seal-in (M-1) in parallel with START only, between the START dot and the JOG NC dot.","Rung 2: NO JOG — NC OL — M coil. No seal-in on this rung.","When JOG is pressed: NC JOG breaks the seal-in path, Rung 2 powers M directly. Motor runs only while JOG is held."],
    tips:["NC JOG in Rung 1 must be placed AFTER the seal-in branch junction","Rung 2 has no seal-in — motor stops when JOG is released","OL is NC, in series on both rungs"],
    checkpoints:["NC JOG after seal-in junction in Rung 1","M seal-in between START dot and JOG NC dot","Separate JOG rung NO JOG only","NC OL in both rungs","M coil on both rungs"],
    diagram:<DiagJogging/> },
  { id:6, name:"Forward / Reverse with Electrical Interlock", diff:"Intermediate", ch:"Ch. 5", type:"guided",
    params:["24V / 0V rails. E-STOP (NC) on 24V rail.","Rung 1: NC STOP — NO F-PB — NC R (interlock) — NC OL — F coil. F-1 seal-in parallel with F-PB.","Rung 2: NC STOP — NO R-PB — NC F (interlock) — NC OL — R coil. R-1 seal-in parallel with R-PB.","Rung 3: NO F-2 — G light.","The NC R in Rung 1 and NC F in Rung 2 prevent F and R energizing simultaneously."],
    tips:["NC R in fwd rung blocks reverse from stealing the circuit","If F pulls in, NC F opens, preventing R from energizing","Seal-ins go in parallel with their own start PB only"],
    checkpoints:["NC R interlock in Forward rung","NC F interlock in Reverse rung","F-1 seal-in parallel with F-PB","R-1 seal-in parallel with R-PB","NC OL in both rungs","G light run indicator"],
    diagram:<DiagFwdRev/> },
  { id:7, name:"Double-Acting Cylinder — Auto Retract", diff:"Intermediate", ch:"Ch. 7", type:"guided",
    params:["24V / 0V rails. E-STOP (NC) on 24V rail. Draw ladder AND pneumatic.","Rung 1: NC STOP — NO START — NO 1LS (home) — CR1 coil. CR1-1 seal-in parallel with START.","Rung 2: NO CR1-2 — NC SOL-B (interlock) — SOL-A coil (extend).","Rung 3: NO 2LS (fully extended) — NC SOL-A (interlock) — SOL-B coil (retract).","Rung 4: NO CR1-3 — G light.","Pneumatic: FRL → 5/2 double-solenoid valve → double-acting cylinder. 1LS at retract, 2LS at extend."],
    tips:["NC SOL-B in SOL-A rung prevents both solenoids energizing together","1LS in start rung ensures cylinder is home","2LS at full extension triggers auto-retract"],
    checkpoints:["1LS home condition in start rung","CR1 seal-in","NC SOL-B in SOL-A rung","NC SOL-A in SOL-B rung","2LS triggers retract","G light rung","5/2 valve on pneumatic","Both LS on cylinder"],
    diagram:<DiagDoubleActing/> },
  // CHALLENGES
  { id:8, name:"Latching Light", diff:"Beginner", ch:"Design", type:"challenge",
    goal:"Nothing is powered until START has been pressed. Once START is pressed, a green light turns on and stays on even after START is released. A STOP button turns the green light back off. Use one relay.",
    hints:["You will need a seal-in (latching) contact to hold the relay in","The green light should be on a separate rung driven by the relay","Think about what keeps the relay energized after START is released"],
    checkpoints:["G light off before START","G light on and latched after START released","STOP kills G light","E-STOP kills everything","One relay used"] },
  { id:9, name:"AND Logic — Two Buttons, One Light", diff:"Beginner", ch:"Design", type:"challenge",
    goal:"A blue light should only turn on when BOTH PB1 AND PB2 are pressed at the same time. If either is released, the light goes off immediately. No latching — on only while both are held. No relay needed.",
    hints:["Series wiring = AND logic","Both contacts must be closed for current to flow","No seal-in needed — this is a momentary output"],
    checkpoints:["B light only on when both PB1 and PB2 held","Light off when either released","No latching","E-STOP present","Series wiring used"] },
  { id:10, name:"OR Logic — Either Button, One Light", diff:"Beginner", ch:"Design", type:"challenge",
    goal:"A yellow light should turn on when PB1 OR PB2 is pressed (or both). Releasing both turns it off. No latching. No relay needed.",
    hints:["Parallel wiring = OR logic","Two contacts in parallel means either one can pass current","E-STOP still goes on the rail"],
    checkpoints:["Y light on when PB1 pressed","Y light on when PB2 pressed","Y light on when both pressed","Light off when both released","Parallel wiring used"] },
  { id:11, name:"Light Sequence with Interlock", diff:"Intermediate", ch:"Design", type:"challenge",
    goal:"When the system starts, a red light is on. When PB1 is pressed, red turns off and green turns on. When PB2 is pressed, green turns off and red comes back on. The two lights must never be on at the same time. Use one control relay.",
    hints:["NC contact of the relay drives the red light — on when relay is off","NO contact drives the green light — on when relay is on","PB1 energizes the relay (with seal-in), PB2 de-energizes it"],
    checkpoints:["R light on at start","PB1 switches R to G","PB2 switches G back to R","R and G never on simultaneously","One relay used","E-STOP kills all"] },
  { id:12, name:"Timed Automatic Shutoff", diff:"Intermediate", ch:"Design", type:"challenge",
    goal:"Pressing START energizes SOL-A and starts a timer. After 5 seconds the solenoid automatically shuts off. STOP can cancel at any time. A yellow light is on while the solenoid is active. A green light comes on once the timer has expired.",
    hints:["Timer and solenoid both need to run from the same START logic","A timed-open (TO) contact opens after the delay — use this to kill the solenoid","A timed-closed (TC) contact closes after the delay — use for the green light"],
    checkpoints:["SOL-A energizes on START","Timer starts simultaneously","SOL-A de-energizes after 5 seconds","Y light on while SOL-A active","G light on after timer expires","STOP cancels everything"] },
  { id:13, name:"Three-Step Indicator Panel", diff:"Intermediate", ch:"Design", type:"challenge",
    goal:"Three pushbuttons (PB1, PB2, PB3) and three lights (R, Y, G). Pressing PB1 turns on red only. PB2 turns on yellow only. PB3 turns on green only. Only one light on at a time. Pressing the same button again turns its light off.",
    hints:["Each pushbutton needs its own relay with a seal-in","Each relay should have NC contacts in the other two relay rungs (interlocks)","Think of this like a forward/reverse interlock but with three outputs"],
    checkpoints:["PB1 → R only","PB2 → Y only","PB3 → G only","No two lights on simultaneously","Interlocking NC contacts between all three relays","E-STOP kills all"] },
  { id:14, name:"Four-Light Fault Indicator", diff:"Advanced", ch:"Design", type:"challenge",
    goal:"Normal run (START pressed, no faults): green light on. Low pressure fault (PS1 trips): yellow on, green off. Overtemp fault (TS1 trips): red on, green and yellow off. Both faults: blue on, all others off. Priority: both faults (B) > overtemp (R) > low pressure (Y) > normal (G). E-STOP kills everything.",
    hints:["Use a dedicated relay for each condition","NC contacts from higher-priority relays block lower-priority lights","The both-faults condition needs AND logic — PS1 and TS1 both active","Priority is enforced by interlocking NC contacts of higher-priority relays into lower-priority rungs"],
    checkpoints:["G on during normal run","Y on (G off) during low pressure only","R on (G and Y off) during overtemp only","B on (all others off) during both faults","Priority order enforced","E-STOP kills all","NC interlocks between states"] },
];

const DC = { Beginner:"#16a34a", Intermediate:"#d97706", Advanced:"#dc2626" };
const TC = { guided:"#3b82f6", challenge:"#8b5cf6" };

const CREATIVE_TWISTS = [
  {
    id: "fault-annunciator",
    levels: ["Beginner", "Intermediate", "Advanced"],
    types: ["guided", "challenge"],
    title: "Fault Annunciator",
    prompt: "Add a red FAULT light that turns on whenever a stop condition is active (E-STOP, STOP, or overload/fault input).",
  },
  {
    id: "manual-auto-selector",
    levels: ["Intermediate", "Advanced"],
    types: ["guided", "challenge"],
    title: "Manual / Auto Selector",
    prompt: "Add a selector switch with MANUAL and AUTO modes. MANUAL should be momentary control, AUTO should allow normal latch/sequence behavior.",
  },
  {
    id: "restart-confirm",
    levels: ["Beginner", "Intermediate", "Advanced"],
    types: ["guided", "challenge"],
    title: "Restart Confirm",
    prompt: "After E-STOP recovery, require a dedicated RESET pushbutton before START can energize outputs again.",
  },
  {
    id: "prestart-delay",
    levels: ["Intermediate", "Advanced"],
    types: ["guided", "challenge"],
    title: "Pre-Start Delay",
    prompt: "Add a 2-second delay before the primary output (motor/solenoid/light) energizes after START.",
  },
  {
    id: "run-healthy-window",
    levels: ["Beginner", "Intermediate"],
    types: ["guided", "challenge"],
    title: "Healthy Window",
    prompt: "Show a green RUN light only when all required permissives are healthy and the process is actively running.",
  },
  {
    id: "jam-recovery",
    levels: ["Intermediate", "Advanced"],
    types: ["guided", "challenge"],
    title: "Jam Recovery",
    prompt: "Add a JAM input that immediately drops outputs and latches an alarm until RESET is pressed.",
  },
  {
    id: "energy-saver",
    levels: ["Beginner", "Intermediate"],
    types: ["guided", "challenge"],
    title: "Energy Saver",
    prompt: "Add logic so indicator lights and auxiliary coils de-energize automatically after idle timeout, while safety logic remains active.",
  },
  {
    id: "proof-of-home",
    levels: ["Intermediate", "Advanced"],
    types: ["guided", "challenge"],
    title: "Proof-of-Home Start",
    prompt: "Require a HOME limit switch confirmation before START is allowed to run the cycle.",
  },
];

function pickCreativeTwist(circuit, excludeId = null) {
  if (!circuit || !circuit.diff || !circuit.type) return null;

  const pool = CREATIVE_TWISTS.filter((twist) => {
    return twist.levels.includes(circuit.diff) && twist.types.includes(circuit.type);
  });

  if (!pool.length) return null;

  const withoutPrevious = excludeId ? pool.filter((twist) => twist.id !== excludeId) : pool;
  const options = withoutPrevious.length ? withoutPrevious : pool;

  return options[Math.floor(Math.random() * options.length)];
}

// ═══════════════════════════════════════════════════════════════════
// API KEY SCREEN
// ═══════════════════════════════════════════════════════════════════
function ApiKeyScreen({ onSave }) {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const save = () => {
    if (!key.startsWith("sk-ant-")) {
      setErr("Key should start with sk-ant-  — check you copied the full key.");
      return;
    }
    localStorage.setItem("anthropic_api_key", key.trim());
    onSave(key.trim());
  };

  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(circle at 12% 8%, #fff5e8 0%, #f7f8ff 46%, #eef7ff 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"'Nunito','Trebuchet MS',sans-serif"}}>
      <div style={{background:"rgba(255,255,255,0.9)",borderRadius:18,padding:"36px 32px",maxWidth:480,width:"100%",boxShadow:"0 16px 38px rgba(77,96,131,0.12)",border:"1px solid #dbe7f5",backdropFilter:"blur(4px)"}}>
        <div style={{fontSize:9,letterSpacing:5,color:"#475569",textTransform:"uppercase",marginBottom:8}}>Electrical Control for Machines — 7th Ed.</div>
        <h1 style={{fontSize:22,fontWeight:900,color:"#0f172a",marginBottom:4}}>Ladder Logic Practice</h1>
        <p style={{fontSize:12,color:"#64748b",marginBottom:28,lineHeight:1.7}}>
          AI grading is powered by the Anthropic API. You need a free API key to use it — grading costs roughly <strong>1–2 cents per submission</strong>.
        </p>
        <div style={{marginBottom:8}}>
          <label style={{fontSize:11,color:"#475569",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:6}}>Anthropic API Key</label>
          <div style={{display:"flex",gap:6}}>
            <input
              type={show?"text":"password"}
              value={key}
              onChange={e=>{setKey(e.target.value);setErr("");}}
              placeholder="sk-ant-api03-..."
              style={{flex:1,padding:"10px 12px",border:"1px solid #dbe7f5",borderRadius:12,fontSize:12,fontFamily:"'IBM Plex Mono','Courier New',monospace",outline:"none",color:"#0f172a",background:"#fff"}}
              onKeyDown={e=>e.key==="Enter"&&save()}
            />
            <button onClick={()=>setShow(!show)} style={{background:"#eef4ff",border:"1px solid #d4e1f2",borderRadius:12,padding:"0 12px",cursor:"pointer",fontSize:12,color:"#64748b",fontFamily:"'Nunito','Trebuchet MS',sans-serif"}}>
              {show?"Hide":"Show"}
            </button>
          </div>
          {err && <div style={{color:"#dc2626",fontSize:11,marginTop:6}}>{err}</div>}
        </div>
        <button onClick={save} style={{width:"100%",background:"linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)",border:"none",borderRadius:12,color:"#fff",padding:"12px",cursor:"pointer",fontSize:13,fontWeight:700,letterSpacing:1,fontFamily:"'Nunito','Trebuchet MS',sans-serif",marginTop:4}}>
          START PRACTICING →
        </button>
        <div style={{marginTop:20,background:"#f3f7ff",borderRadius:12,padding:"12px 14px",border:"1px solid #dbe7f5"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#475569",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>How to get a free API key</div>
          <div style={{fontSize:11,color:"#64748b",lineHeight:1.8}}>
            1. Go to <strong>console.anthropic.com</strong><br/>
            2. Sign up for a free account<br/>
            3. Click API Keys → Create Key<br/>
            4. Copy and paste it above
          </div>
        </div>
        <p style={{fontSize:10,color:"#94a3b8",marginTop:14,textAlign:"center"}}>Your key is stored only in your browser — never sent anywhere except directly to Anthropic.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CANVAS
// ═══════════════════════════════════════════════════════════════════
function Canvas({ onSubmit, onTest, isSandbox }) {
  const ref = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#111111");
  const [lw, setLw] = useState(2);
  const [fontSize, setFontSize] = useState(14);
  const [hist, setHist] = useState([]);
  const [textPos, setTextPos] = useState(null);
  const [currentText, setCurrentText] = useState("");
  const [showSymbols, setShowSymbols] = useState(false);
  const [symbolMode, setSymbolMode] = useState(null);
  const last = useRef(null);
  const textInputRef = useRef(null);

  const drawGrid = (ctx, w, h) => {
    ctx.fillStyle="#fff"; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle="#dde6f0"; ctx.lineWidth=0.5;
    for(let x=0;x<w;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<h;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  };

  const drawNode = (ctx, x, y, r = 3) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fill();
  };

  const drawPushbutton = (ctx, x, y, isNC) => {
    const lx = x - 10;
    const rx = x + 10;
    const mid = (lx + rx) / 2;
    ctx.beginPath(); ctx.moveTo(x-24, y); ctx.lineTo(lx, y); ctx.stroke();
    drawNode(ctx, lx, y);
    drawNode(ctx, rx, y);
    if (isNC) {
      ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(rx, y); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mid, y - 12);
      ctx.lineTo(mid, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(lx + 1, y - 6);
      ctx.lineTo(rx - 1, y - 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mid, y - 14);
      ctx.lineTo(mid, y - 6);
      ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(rx, y); ctx.lineTo(x+24, y); ctx.stroke();
  };

  const drawLimitSwitch = (ctx, x, y, isNC) => {
    const lx = x - 10;
    const rx = x + 10;

    ctx.beginPath(); ctx.moveTo(x-24, y); ctx.lineTo(lx, y); ctx.stroke();
    drawNode(ctx, lx, y);
    drawNode(ctx, rx, y);

    ctx.beginPath();
    ctx.moveTo(lx + 2, y);
    ctx.lineTo(lx + 10, y - 4);
    ctx.lineTo(lx + 10, y + 4);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lx + 2, y);
    ctx.lineTo(isNC ? rx - 2 : rx - 5, isNC ? y - 1 : y + 5);
    ctx.stroke();

    ctx.beginPath(); ctx.moveTo(rx, y); ctx.lineTo(x+24, y); ctx.stroke();
  };

  const drawSymbol = (ctx, symbolName, x, y) => {
    ctx.strokeStyle="#111"; ctx.lineWidth=2.5; ctx.fillStyle="#111";
    ctx.lineCap="round"; ctx.lineJoin="round";
    const s = 24;
    switch(symbolName) {
      case "NO Contact":
        ctx.beginPath(); ctx.moveTo(x-s, y); ctx.lineTo(x-12, y); ctx.stroke();
        ctx.beginPath(); ctx.arc(x-10, y, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x-10, y-9); ctx.lineTo(x-10, y+9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x+10, y-9); ctx.lineTo(x+10, y+9); ctx.stroke();
        ctx.beginPath(); ctx.arc(x+10, y, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x+10, y); ctx.lineTo(x+s, y); ctx.stroke();
        break;
      case "NC Contact":
        ctx.beginPath(); ctx.moveTo(x-s, y); ctx.lineTo(x-10, y); ctx.stroke();
        drawNode(ctx, x-10, y);
        drawNode(ctx, x+10, y);
        ctx.beginPath(); ctx.moveTo(x-10, y-9); ctx.lineTo(x-10, y+9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x+10, y-9); ctx.lineTo(x+10, y+9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x-7, y+7); ctx.lineTo(x+7, y-7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x+10, y); ctx.lineTo(x+s, y); ctx.stroke();
        break;
      case "NO Pushbutton":
        drawPushbutton(ctx, x, y, false);
        break;
      case "NC Pushbutton":
        drawPushbutton(ctx, x, y, true);
        break;
      case "Coil":
        ctx.beginPath(); ctx.moveTo(x-s, y); ctx.lineTo(x-12, y); ctx.stroke();
        ctx.beginPath(); ctx.arc(x+5, y, 13, 0, Math.PI*2); ctx.stroke();
        ctx.font="bold 10px Arial"; ctx.fillText("CR", x+2, y+5);
        ctx.beginPath(); ctx.moveTo(x+18, y); ctx.lineTo(x+s, y); ctx.stroke();
        break;
      case "Solenoid":
        ctx.beginPath(); ctx.moveTo(x-s, y); ctx.lineTo(x-10, y); ctx.stroke();
        drawNode(ctx, x-10, y);
        drawNode(ctx, x+10, y);
        ctx.beginPath();
        ctx.moveTo(x-8, y);
        ctx.lineTo(x-3, y);
        ctx.lineTo(x+2, y-8);
        ctx.lineTo(x+7, y+8);
        ctx.lineTo(x+8, y);
        ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x+10, y); ctx.lineTo(x+s, y); ctx.stroke();
        break;
      case "Pilot Light":
        ctx.beginPath(); ctx.moveTo(x-s, y); ctx.lineTo(x-12, y); ctx.stroke();
        ctx.beginPath(); ctx.arc(x+5, y, 12, 0, Math.PI*2); ctx.stroke();
        const r = 18;
        for(let i=0; i<4; i++) {
          const a = (Math.PI/2)*i + Math.PI/4;
          ctx.beginPath(); ctx.moveTo(x+5+Math.cos(a)*12, y+Math.sin(a)*12);
          ctx.lineTo(x+5+Math.cos(a)*r, y+Math.sin(a)*r); ctx.stroke();
        }
        ctx.font="8px Arial"; ctx.fillText("L", x+4, y+5);
        ctx.beginPath(); ctx.moveTo(x+18, y); ctx.lineTo(x+s, y); ctx.stroke();
        break;
      case "Timer":
        ctx.beginPath(); ctx.moveTo(x-s, y); ctx.lineTo(x-12, y); ctx.stroke();
        ctx.beginPath(); ctx.arc(x+5, y, 13, 0, Math.PI*2); ctx.stroke();
        ctx.font="bold 9px Arial"; ctx.fillText("TR", x+2, y+5);
        ctx.beginPath(); ctx.moveTo(x+18, y); ctx.lineTo(x+s, y); ctx.stroke();
        break;
      case "NO Limit Switch":
        drawLimitSwitch(ctx, x, y, false);
        break;
      case "NC Limit Switch":
        drawLimitSwitch(ctx, x, y, true);
        break;
      case "E-STOP":
        ctx.beginPath(); ctx.moveTo(x-s, y); ctx.lineTo(x-8, y); ctx.stroke();
        drawNode(ctx, x-8, y);
        drawNode(ctx, x+12, y);
        ctx.beginPath(); ctx.moveTo(x-8, y); ctx.lineTo(x+12, y); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x-7, y-1);
        ctx.quadraticCurveTo(x+2, y-14, x+11, y-1);
        ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x+2, y); ctx.lineTo(x+2, y-9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x+12, y); ctx.lineTo(x+s+4, y); ctx.stroke();
        break;
      default: break;
    }
  };

  useEffect(()=>{
    const c=ref.current,ctx=c.getContext("2d");
    drawGrid(ctx,c.width,c.height);
    snap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{ if(textPos&&textInputRef.current) textInputRef.current.focus(); },[textPos]);

  const snap=()=>{const c=ref.current;if(c)setHist(h=>[...h.slice(-30),c.toDataURL()]);};
  const gp=(e)=>{
    const c=ref.current,r=c.getBoundingClientRect();
    const sx=c.width/r.width,sy=c.height/r.height;
    const s=e.touches?e.touches[0]:e;
    return{x:(s.clientX-r.left)*sx,y:(s.clientY-r.top)*sy};
  };

  const commitText=()=>{
    if(textPos&&currentText.trim()){
      const c=ref.current,ctx=c.getContext("2d");
      ctx.font=`${fontSize}px Arial`;
      ctx.fillStyle=color;
      ctx.fillText(currentText,textPos.x,textPos.y);
      snap();
    }
    setTextPos(null);
    setCurrentText("");
  };

  const handleSymbolClick = (symbolName) => {
    setSymbolMode(symbolName);
  };

  const dn=(e)=>{
    e.preventDefault();
    if(symbolMode){
      const c=ref.current, ctx=c.getContext("2d"), p=gp(e);
      drawSymbol(ctx, symbolMode, p.x, p.y);
      snap();
      setSymbolMode(null);
      return;
    }
    if(tool==="text"){
      commitText();
      setTextPos(gp(e));
      setCurrentText("");
      return;
    }
    commitText();
    setDrawing(true);
    last.current=gp(e);
  };
  const mv=(e)=>{
    e.preventDefault();if(!drawing||tool==="text")return;
    const c=ref.current,ctx=c.getContext("2d"),p=gp(e);
    ctx.beginPath();ctx.moveTo(last.current.x,last.current.y);ctx.lineTo(p.x,p.y);
    ctx.strokeStyle=tool==="eraser"?"#fff":color;
    ctx.lineWidth=tool==="eraser"?26:lw;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();
    last.current=p;
  };
  const up=()=>{if(drawing)snap();setDrawing(false);};

  const undo=()=>{
    commitText();
    if(hist.length<2)return;
    const c=ref.current,ctx=c.getContext("2d"),img=new Image();
    img.onload=()=>ctx.drawImage(img,0,0);img.src=hist[hist.length-2];
    setHist(h=>h.slice(0,-1));
  };
  const clear=()=>{
    commitText();
    const c=ref.current,ctx=c.getContext("2d");
    drawGrid(ctx,c.width,c.height);
    snap();
  };

  const previewText=(val)=>{
    if(!textPos||!hist.length)return;
    const c=ref.current,ctx=c.getContext("2d"),img=new Image();
    img.onload=()=>{
      ctx.drawImage(img,0,0);
      ctx.font=`${fontSize}px Arial`;
      ctx.fillStyle=color;
      ctx.fillText(val,textPos.x,textPos.y);
      const w=ctx.measureText(val).width;
      ctx.beginPath();ctx.moveTo(textPos.x+w+1,textPos.y-fontSize+2);ctx.lineTo(textPos.x+w+1,textPos.y+3);
      ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.stroke();
    };
    img.src=hist[hist.length-1];
  };

  const handleTextChange=(e)=>{
    setCurrentText(e.target.value);
    previewText(e.target.value);
  };
  const handleTextKey=(e)=>{
    if(e.key==="Enter"||e.key==="Escape"){e.preventDefault();commitText();}
  };

  const COLS=["#111111","#b91c1c","#1d4ed8","#15803d","#a16207","#6d28d9","#0e7490"];
  const WS=[1,2,3,5,9];
  const FS=[10,12,14,18,24];
  const cursor=symbolMode?"crosshair":tool==="eraser"?"cell":tool==="text"?"text":"crosshair";

  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",background:"rgba(255,255,255,0.88)",border:"1px solid #dbe7f5",borderRadius:12,padding:"8px 11px",boxShadow:"0 8px 18px rgba(77,96,131,0.08)"}}>
        <div style={{display:"flex",gap:4}}>
          {[["pen","✏️"],["text","T"],["eraser","⬜"]].map(([t,l])=>(
            <button key={t} onClick={()=>{commitText();setTool(t);}}
              style={{background:tool===t?"#4f46e5":"#e7eef9",color:tool===t?"#fff":"#4d5c75",border:"none",padding:"6px 10px",cursor:"pointer",fontSize:t==="text"?13:12,fontWeight:t==="text"?"bold":"normal",fontFamily:"'IBM Plex Mono','Courier New',monospace",minWidth:36}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:4}}>
          {COLS.map(c=>(
            <button key={c} onClick={()=>{setColor(c);if(tool==="eraser")setTool("pen");}}
              style={{width:20,height:20,borderRadius:"50%",background:c,border:color===c?"3px solid #1e3a8a":"2px solid #d1d5db",cursor:"pointer",padding:0}}/>
          ))}
        </div>
        {tool!=="text" && (
          <div style={{display:"flex",gap:3,alignItems:"center"}}>
            {WS.map(w=>(
              <button key={w} onClick={()=>setLw(w)}
                style={{width:26,height:26,borderRadius:8,background:lw===w?"#e8eaff":"transparent",border:"1px solid "+(lw===w?"#4f46e5":"#d1ddef"),cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:Math.min(w*2.5,16),height:Math.max(w,1),background:"#6b7280",borderRadius:1}}/>
              </button>
            ))}
          </div>
        )}
        {tool==="text" && (
          <div style={{display:"flex",gap:3,alignItems:"center"}}>
            <span style={{fontSize:9,color:"#94a3b8",letterSpacing:1}}>SIZE</span>
            {FS.map(s=>(
              <button key={s} onClick={()=>setFontSize(s)}
                style={{minWidth:28,height:26,borderRadius:8,background:fontSize===s?"#e8eaff":"transparent",border:"1px solid "+(fontSize===s?"#4f46e5":"#d1ddef"),cursor:"pointer",fontSize:9,color:"#475569",fontFamily:"'IBM Plex Mono','Courier New',monospace"}}>
                {s}
              </button>
            ))}
          </div>
        )}
        <div style={{display:"flex",gap:4,marginLeft:"auto"}}>
          <button onClick={()=>setShowSymbols(!showSymbols)} style={{background:showSymbols?"#dff7f2":"#eef4ff",border:"1px solid "+(showSymbols?"#14b8a6":"#d1ddef"),color:showSymbols?"#0f766e":"#56627a",padding:"6px 10px",cursor:"pointer",fontSize:11,fontFamily:"'IBM Plex Mono','Courier New',monospace",fontWeight:700}}>Symbols</button>
          <button onClick={undo} style={{background:"#eef4ff",border:"1px solid #d1ddef",color:"#56627a",padding:"6px 10px",cursor:"pointer",fontSize:11,fontFamily:"'IBM Plex Mono','Courier New',monospace"}}>Undo</button>
          <button onClick={clear} style={{background:"#eef4ff",border:"1px solid #d1ddef",color:"#56627a",padding:"6px 10px",cursor:"pointer",fontSize:11,fontFamily:"'IBM Plex Mono','Courier New',monospace"}}>Clear</button>
        </div>
      </div>
      {showSymbols && (
        <div style={{background:"rgba(255,255,255,0.92)",border:"1px solid #dbe7f5",borderRadius:12,padding:12,marginBottom:12,boxShadow:"0 8px 18px rgba(77,96,131,0.08)"}}>
          <div style={{fontSize:9,fontWeight:700,color:"#475569",marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Click a symbol, then click the canvas to place it</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,fontSize:9}}>
            {["NO Contact","NC Contact","NO Pushbutton","NC Pushbutton","Coil","Solenoid","Pilot Light","Timer","NO Limit Switch","NC Limit Switch","E-STOP"].map(sym=>(
              <div key={sym} onClick={()=>handleSymbolClick(sym)} style={{padding:8,background:symbolMode===sym?"#e8eaff":"#fff",border:"1px solid "+(symbolMode===sym?"#4f46e5":"#dce7f6"),borderRadius:10,cursor:"pointer",transition:"0.2s"}}
                onMouseEnter={(e)=>{if(symbolMode!==sym)e.currentTarget.style.background="#f5f8ff";}}
                onMouseLeave={(e)=>{e.currentTarget.style.background=symbolMode===sym?"#e8eaff":"#fff";}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:2}}>
                  <SymbolIcon symbol={sym}/>
                </div>
                <strong style={{color:symbolMode===sym?"#4f46e5":"#334155",display:"block",textAlign:"center"}}>{sym}</strong>
                <div style={{fontSize:8,color:"#94a3b8",marginTop:4,textAlign:"center"}}>{symbolMode===sym?"Click canvas to place ->":""}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tool==="text" && (
        <div style={{background:"#f2f7ff",border:"1px solid #cfe0f5",borderRadius:10,padding:"7px 11px",fontSize:10,color:"#3f5a93"}}>
          Click anywhere on the canvas to place text, then type. Press Enter or click elsewhere to confirm.
        </div>
      )}
      <div style={{position:"relative",border:"2px solid #d1ddef",borderRadius:12,overflow:"hidden",cursor,boxShadow:"0 10px 22px rgba(77,96,131,0.08)"}}>
        <canvas ref={ref} width={920} height={560} style={{display:"block",width:"100%",touchAction:"none"}}
          onMouseDown={dn} onMouseMove={mv} onMouseUp={up} onMouseLeave={up}
          onTouchStart={dn} onTouchMove={mv} onTouchEnd={up}/>
        <input ref={textInputRef} value={currentText} onChange={handleTextChange} onKeyDown={handleTextKey} onBlur={commitText}
          style={{position:"absolute",opacity:0,top:0,left:0,width:1,height:1,pointerEvents:"none"}}/>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>{commitText();onSubmit(ref.current.toDataURL("image/png"));}}
          style={{flex:1,background:"linear-gradient(135deg, #4f46e5 0%, #0ea5a4 100%)",border:"none",color:"#fff",padding:"12px",cursor:"pointer",fontSize:14,fontWeight:700,letterSpacing:1,fontFamily:"'IBM Plex Mono','Courier New',monospace"}}>
          CHECK FOR MISTAKES →
        </button>
        <button onClick={()=>{commitText();onTest(ref.current.toDataURL("image/png"));}}
          style={{flex:1,background:"linear-gradient(135deg, #0ea5a4 0%, #f97316 100%)",border:"none",color:"#fff",padding:"12px",cursor:"pointer",fontSize:14,fontWeight:700,letterSpacing:1,fontFamily:"'IBM Plex Mono','Courier New',monospace"}}>
          ⚡ TEST MY CIRCUIT
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("anthropic_api_key") || "");
  const [sel, setSel] = useState(null);
  const [phase, setPhase] = useState("select");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [drawn, setDrawn] = useState(null);
  const [showRef, setShowRef] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [filter, setFilter] = useState("All");
  const [panel, setPanel] = useState(null);
  const [phase2, setPhase2] = useState(null); // null | "sim"
  const [aiSimDef, setAiSimDef] = useState(null);   // AI-generated sim definition
  const [testError, setTestError] = useState("");
  const [creativeTwist, setCreativeTwist] = useState(null);
  const [lastTwistId, setLastTwistId] = useState(null);

  const rollCreativeTwist = (circuit = sel) => {
    const picked = pickCreativeTwist(circuit, lastTwistId);
    if (!picked) return;
    setCreativeTwist(picked);
    setLastTwistId(picked.id);
  };

  if (!apiKey) return <ApiKeyScreen onSave={setApiKey}/>;

  const grade = async (dataUrl) => {
    setDrawn(dataUrl); setPhase("feedback"); setLoading(true); setFeedback("");
    try {
      const b64 = dataUrl.split(",")[1];
      const isChallenge = sel.type === "challenge";
      const twistNote = creativeTwist
        ? `\n\nCreative Twist (bonus objective): ${creativeTwist.title}\n${creativeTwist.prompt}\nIn your feedback, explicitly say "Twist complete" or "Twist not complete". Do not reduce the base score if the core circuit is correct but the twist is not implemented.`
        : "";
      const res = await fetch("/api/grade", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1400,
          system:`You are an industrial controls instructor grading ladder logic diagrams (hand-drawn or PLC-style). You use "Electrical Control for Machines, 7th Edition" (Lobsiger, Giuliani, Rexford) as your curriculum. Accept EITHER style: (1) NEMA hand-drawn style: 24V/0V rails, NO contacts = two vertical bars with filled dots, NC contacts = same with diagonal slash, coils = circle with label inside, solenoid coils = circle with wave, pilot lights = circle with 4 rays labeled G/R/Y/B, limit switches = small box with roller actuator, relay contacts labeled CR1-1/CR1-2 etc, E-STOP NC on 24V rail. (2) PLC-style: labeled rectangular contact blocks with tag names (e.g. a box labeled CR1, STOP, START etc.), coils as labeled output blocks or parentheses. Both are correct — do not penalize for using PLC notation if the logic is correct. Grade the logic and circuit structure, not just the symbol style. Be encouraging, specific, practical. Plain text only. Score out of 10.`,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:"image/png",data:b64}},
            {type:"text",text:isChallenge
              ?`Design Challenge. Goal: "${sel.goal}"\n\nCheckpoints:\n${sel.checkpoints.map((c,i)=>`${i+1}. ${c}`).join("\n")}\n\nScore out of 10. Praise what they got right. Give 2-4 improvements. Reward creative correct solutions. Flag missing safety elements.${twistNote}`
              :`Circuit: "${sel.name}" (${sel.ch})\n\nParameters:\n${sel.params.map((p,i)=>`${String.fromCharCode(65+i)}. ${p}`).join("\n")}\n\nCheckpoints:\n${sel.checkpoints.map((c,i)=>`${i+1}. ${c}`).join("\n")}\n\nScore out of 10. Be specific about symbol accuracy and rung structure. Give 2-4 improvements. Note missing safety elements. Be encouraging.${twistNote}`
            }
          ]}]
        })
      });
      if (res.status === 401) { setFeedback("Invalid API key. Click the 🔑 button in the header to update it."); setLoading(false); return; }
      const data = await res.json();
      if (data.error) { setFeedback("API error: " + (data.error.message || data.error || JSON.stringify(data))); setLoading(false); return; }
      setFeedback(data.content?.map(b=>b.text||"").join("\n") || "Could not get feedback.");
    } catch(err) { setFeedback("Network error: " + err.message); }
    setLoading(false);
  };

  const testCircuit = async (dataUrl) => {
    setTestError("");
    setAiSimDef(null);
    setPhase2("sim-loading");
    try {
      const b64 = dataUrl.split(",")[1];
      const res = await fetch("/api/grade", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:2000,
          system:`You are a ladder logic circuit parser. You will be given an image of a hand-drawn or PLC-style 24VDC ladder logic diagram. Extract the circuit topology and return it as a strict JSON object. Return ONLY raw JSON, no markdown, no explanation, no code fences. Schema: {"rungs":[{"id":"r1","series":[...elements...],"outputs":["COIL_ID"]}],"coils":{"COIL_ID":{"label":"CR1","type":"relay"}},"inputs":{"INPUT_ID":{"label":"START","type":"pb_no"}}}. Element types: {type:"ESTOP",id:"ESTOP"}, {type:"NO",id:"START",label:"START"}, {type:"NC",id:"STOP",label:"STOP"}, {type:"NO_LS",id:"1LS",label:"1LS"}, {type:"NC_LS",id:"2LS",label:"2LS"}, {type:"PARALLEL",branches:[[...],[...]]}. For relay contacts CR1-1/CR1-2 use base id e.g. id:"CR1". Coil types: relay, light, sol, motor. Light colors: G=#16a34a R=#dc2626 Y=#eab308 B=#2563eb. Input types: estop, pb_no, pb_nc, ls_no, ls_nc. If too unclear return {"error":"Could not parse: [specific reason]"}`,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:"image/png",data:b64}},
            {type:"text",text:"Parse this ladder logic diagram into the JSON schema. Return only raw JSON."}
          ]}]
        })
      });
      if (res.status === 401) { setTestError("Invalid API key."); setPhase2(null); return; }
      const data = await res.json();
      if (data.error) { setTestError("API error: " + (data.error.message || data.error)); setPhase2(null); return; }
      const raw = data.content?.map(b=>b.text||"").join("") || "";
      const cleaned = raw.replace(/```json|```/g,"").trim();
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch(parseErr) {
        setTestError("AI returned invalid JSON. Try redrawing with clearer labels and lines.");
        setPhase2(null);
        return;
      }
      if (parsed.error) {
        setTestError("Could not simulate: " + parsed.error);
        setPhase2(null);
        return;
      }
      if (!parsed.rungs || !parsed.coils || !parsed.inputs) {
        setTestError("AI could not identify a complete circuit. Make sure rails, contacts, and coils are clearly drawn and labeled.");
        setPhase2(null);
        return;
      }
      setAiSimDef(parsed);
      setPhase2("sim");
    } catch(err) {
      setTestError("Network error: " + err.message);
      setPhase2(null);
    }
  };

  const reset = () => {
    setSel(null);
    setPhase("select");
    setPhase2(null);
    setFeedback("");
    setDrawn(null);
    setShowRef(false);
    setShowHints(false);
    setPanel(null);
    setAiSimDef(null);
    setTestError("");
    setCreativeTwist(null);
    setLastTwistId(null);
  };
  const clearKey = () => { localStorage.removeItem("anthropic_api_key"); setApiKey(""); };

  const filters = ["All","Beginner","Intermediate","Advanced","Challenges"];
  const visible = CIRCUITS.filter(c => {
    if(filter==="All") return true;
    if(filter==="Challenges") return c.type==="challenge";
    return c.diff===filter;
  });

  const startRandomCircuit = () => {
    if (!visible.length) return;

    const picked = visible[Math.floor(Math.random() * visible.length)];
    setSel(picked);
    setPhase("brief");
    setShowRef(false);
    setShowHints(false);
    setPanel(null);
    setPhase2(null);
    setAiSimDef(null);
    setTestError("");

    const twist = pickCreativeTwist(picked);
    setCreativeTwist(twist);
    setLastTwistId(twist?.id || null);
  };

  return (
    <div data-soft-ui="1" style={{minHeight:"100vh",background:"radial-gradient(circle at 8% -6%, #fff2df 0%, #f7f8ff 44%, #eaf7ff 100%)",fontFamily:"'Nunito','Trebuchet MS',sans-serif",color:"#2f3348",padding:"16px 14px 24px"}}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&family=IBM+Plex+Mono:wght@400;500;700&display=swap");

        [data-soft-ui="1"] {
          --ui-ink: #2f3348;
          --ui-muted: #5c6a82;
          --ui-border: #dbe7f5;
          --ui-panel: rgba(255, 255, 255, 0.88);
          --ui-shadow: 0 14px 32px rgba(77, 96, 131, 0.1);
        }

        [data-soft-ui="1"] button {
          border-radius: 12px !important;
          font-family: "Nunito", "Trebuchet MS", sans-serif !important;
          letter-spacing: 0.35px !important;
          transition: transform 0.12s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }

        [data-soft-ui="1"] button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(76, 96, 131, 0.16);
        }

        [data-soft-ui="1"] button:active {
          transform: translateY(0);
        }

        [data-soft-ui="1"] input,
        [data-soft-ui="1"] textarea {
          border-radius: 12px !important;
          font-family: "Nunito", "Trebuchet MS", sans-serif !important;
        }

        [data-soft-ui="1"] .soft-panel {
          background: var(--ui-panel);
          border: 1px solid var(--ui-border);
          box-shadow: var(--ui-shadow);
          backdrop-filter: blur(4px);
        }

        [data-soft-ui="1"] .soft-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        [data-soft-ui="1"] .soft-grid-select {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
        }

        [data-soft-ui="1"] .mono {
          font-family: "IBM Plex Mono", "Courier New", monospace;
        }

        @media (max-width: 930px) {
          [data-soft-ui="1"] .soft-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{maxWidth:1040,margin:"0 auto"}}>
        <div className="soft-panel" style={{background:"linear-gradient(135deg, #ffffff 0%, #f8f5ff 48%, #ecf8ff 100%)",borderRadius:16,padding:"14px 20px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:9,letterSpacing:4,color:"#607089",textTransform:"uppercase",marginBottom:3,fontWeight:700}}>Electrical Control for Machines — 7th Ed.</div>
            <h1 style={{margin:0,fontSize:22,fontWeight:900,color:"#2f3348",letterSpacing:0.4}}>Ladder Logic Practice</h1>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {sel && phase!=="select" && <button onClick={reset} style={{background:"#eef4ff",border:"1px solid #d3e0f2",color:"#55647d",cursor:"pointer",fontSize:10,padding:"6px 12px"}}>← ALL</button>}
            <button onClick={clearKey} title="Change API Key" style={{background:"#fff",border:"1px solid #d3e0f2",color:"#55647d",cursor:"pointer",fontSize:11,padding:"6px 10px"}}>🔑 API Key</button>
            <div className="mono" style={{color:"#607089",fontSize:10,letterSpacing:0.6,paddingLeft:8,borderLeft:"1px solid #d3e0f2"}}>v{packageJson.version}</div>
          </div>
        </div>

        {phase==="select" && (
          <>
            <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
              {filters.map(f=>(
                <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?"#4f46e5":"rgba(255,255,255,0.86)",color:filter===f?"#f8faff":"#55647d",border:"1px solid "+(filter===f?"#4f46e5":"#d7e4f4"),padding:"7px 12px",cursor:"pointer",fontSize:11,fontWeight:700}}>
                  {f}
                </button>
              ))}
              <button
                onClick={startRandomCircuit}
                style={{background:"linear-gradient(135deg, #0891b2 0%, #f97316 100%)",color:"#fff",border:"1px solid transparent",padding:"7px 12px",cursor:"pointer",fontSize:11,fontWeight:800}}
              >
                RANDOM + TWIST
              </button>
            </div>
            <div className="soft-grid-select">
              <button onClick={()=>{setSel({id:"sandbox",name:"Sandbox Mode",type:"sandbox"});setPhase("draw");setShowRef(false);setShowHints(false);setCreativeTwist(null);setLastTwistId(null);setPanel(null);}}
                style={{background:"linear-gradient(140deg, #06b6d4 0%, #f59e0b 100%)",border:"2px solid #67d4dc",borderRadius:14,padding:"15px",textAlign:"left",cursor:"pointer",transition:"all 0.12s",color:"#fff"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 12px 24px rgba(52,125,133,0.28)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{fontSize:11,letterSpacing:2,fontWeight:800,marginBottom:6}}>EXPERIMENTAL</div>
                <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Sandbox Mode</div>
                <div style={{fontSize:11}}>Free-form circuit building • Test & simulate • No grading</div>
              </button>
              {visible.map(c=>(
                <button key={c.id} onClick={()=>{setSel(c);setPhase("brief");setShowRef(false);setShowHints(false);setCreativeTwist(null);setLastTwistId(null);setPanel(null);setPhase2(null);setAiSimDef(null);setTestError("");}}
                  className="soft-panel"
                  style={{background:"rgba(255,255,255,0.88)",border:"2px solid #e0ebf8",borderRadius:14,padding:"14px",textAlign:"left",cursor:"pointer",transition:"all 0.12s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=TC[c.type];e.currentTarget.style.transform="translateY(-1px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#e0ebf8";e.currentTarget.style.transform="none";}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:9,color:DC[c.diff],letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>{c.diff}</span>
                    <span style={{fontSize:9,background:TC[c.type]+"18",color:TC[c.type],border:`1px solid ${TC[c.type]}33`,borderRadius:4,padding:"1px 6px",letterSpacing:1}}>{c.type==="challenge"?"CHALLENGE":"GUIDED"}</span>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:"#0f172a",lineHeight:1.35,marginBottom:3}}>{c.name}</div>
                  <div style={{fontSize:10,color:"#94a3b8"}}>{c.ch} · {c.checkpoints.length} checkpoints</div>
                </button>
              ))}
            </div>
          </>
        )}

        {phase==="brief" && sel && sel.type!=="sandbox" && (
          <div className="soft-grid-2">
            <div className="soft-panel" style={{borderRadius:14,padding:20}}>
              {sel.type==="challenge" ? (
                <>
                  <div style={{fontSize:9,letterSpacing:4,color:"#8b5cf6",textTransform:"uppercase",marginBottom:8,fontWeight:700}}>Design Challenge — {sel.ch}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#0f172a",marginBottom:12}}>{sel.name}</div>
                  <div style={{fontSize:10,color:"#64748b",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Your circuit must do the following:</div>
                  <p style={{fontSize:13,color:"#334155",lineHeight:1.8,margin:"0 0 16px",background:"#faf5ff",border:"1px solid #e9d5ff",borderRadius:7,padding:"12px 14px"}}>{sel.goal}</p>
                  <button onClick={()=>setShowHints(!showHints)} style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:5,color:"#7c3aed",padding:"7px 13px",cursor:"pointer",fontSize:10,letterSpacing:1}}>
                    {showHints?"HIDE":"SHOW"} HINTS
                  </button>
                  {showHints && <div style={{background:"#faf5ff",borderRadius:7,padding:"10px 13px",marginTop:10}}>{sel.hints.map((h,i)=><div key={i} style={{fontSize:12,color:"#6d28d9",marginBottom:5,lineHeight:1.55}}><span style={{color:"#ddd6fe"}}>{i+1}.  </span>{h}</div>)}</div>}
                </>
              ) : (
                <>
                  <div style={{fontSize:9,letterSpacing:4,color:"#3b82f6",textTransform:"uppercase",marginBottom:8,fontWeight:700}}>Lab Circuit — {sel.ch}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#0f172a",marginBottom:12}}>{sel.name}</div>
                  <div style={{fontSize:10,color:"#64748b",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Design a circuit with the following parameters:</div>
                  {sel.params.map((p,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}><span style={{color:"#1e40af",fontWeight:700,flexShrink:0,fontSize:12}}>{String.fromCharCode(65+i)}.</span><span style={{fontSize:12,color:"#334155",lineHeight:1.65}}>{p}</span></div>)}
                  <div style={{background:"#f8fafc",borderRadius:7,padding:"10px 13px",marginTop:14}}>
                    <div style={{fontSize:9,letterSpacing:3,color:"#94a3b8",textTransform:"uppercase",marginBottom:7}}>Key Concepts</div>
                    {sel.tips.map((t,i)=><div key={i} style={{fontSize:11,color:"#475569",marginBottom:5,lineHeight:1.55}}><span style={{color:"#cbd5e1"}}>{i+1}.  </span>{t}</div>)}
                  </div>
                  {sel.diagram && <>
                    <button onClick={()=>setShowRef(!showRef)} style={{marginTop:12,background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:5,color:"#64748b",padding:"7px 13px",cursor:"pointer",fontSize:10,letterSpacing:1}}>
                      {showRef?"HIDE":"SHOW"} REFERENCE DIAGRAM
                    </button>
                    {showRef && <div style={{marginTop:12}}>{sel.diagram}</div>}
                  </>}
                </>
              )}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div className="soft-panel" style={{borderRadius:14,padding:20,flex:1}}>
                <div style={{fontSize:9,letterSpacing:4,color:"#d97706",textTransform:"uppercase",marginBottom:10,fontWeight:700}}>Grading Checkpoints</div>
                {sel.checkpoints.map((cp,i)=><div key={i} style={{display:"flex",gap:9,marginBottom:8,alignItems:"flex-start"}}><span style={{color:"#e2e8f0",fontSize:13,lineHeight:1.1,flexShrink:0}}>□</span><span style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{cp}</span></div>)}
              </div>
              <div style={{background:creativeTwist?"#fffbeb":"#fff7ed",border:"1px solid "+(creativeTwist?"#fcd34d":"#fed7aa"),borderRadius:10,padding:16}}>
                <div style={{fontSize:9,letterSpacing:3,color:"#b45309",textTransform:"uppercase",marginBottom:8,fontWeight:700}}>Creative Twist</div>
                {creativeTwist ? (
                  <>
                    <div style={{fontSize:12,fontWeight:700,color:"#7c2d12",marginBottom:6}}>{creativeTwist.title}</div>
                    <div style={{fontSize:11,color:"#9a3412",lineHeight:1.6}}>{creativeTwist.prompt}</div>
                  </>
                ) : (
                  <div style={{fontSize:11,color:"#9a3412",lineHeight:1.6}}>Roll a remix objective to make this circuit more realistic and challenging.</div>
                )}
                <div style={{display:"flex",gap:8,marginTop:10}}>
                  <button
                    onClick={()=>rollCreativeTwist(sel)}
                    style={{flex:1,background:"#b45309",border:"none",borderRadius:6,color:"#fff7ed",padding:"8px 10px",cursor:"pointer",fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:1,fontWeight:700}}
                  >
                    {creativeTwist ? "REROLL TWIST" : "ROLL TWIST"}
                  </button>
                  {creativeTwist && (
                    <button
                      onClick={()=>setCreativeTwist(null)}
                      style={{background:"transparent",border:"1px solid #fdba74",borderRadius:6,color:"#b45309",padding:"8px 10px",cursor:"pointer",fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:1}}
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>
              <button onClick={()=>setPhase("draw")} style={{background:sel.type==="challenge"?"#7c3aed":"#1d4ed8",border:"none",borderRadius:9,color:"#fff",padding:"15px",cursor:"pointer",fontSize:13,fontFamily:"'Courier New',monospace",letterSpacing:3,fontWeight:700}}>
                START DRAWING →
              </button>
              <button onClick={()=>{setPhase("draw");setPhase2("sim");}} style={{background:"#0f766e",border:"none",borderRadius:9,color:"#fff",padding:"12px",cursor:"pointer",fontSize:12,fontFamily:"'Courier New',monospace",letterSpacing:2,fontWeight:700}}>
                ⚡ SIMULATE CIRCUIT
              </button>
            </div>
          </div>
        )}

        {phase==="draw" && sel && (
          <div style={{display:"flex",flexDirection:"column",gap:10,position:"relative"}}>
            {/* Top bar */}
            <div className="soft-panel" style={{borderRadius:14,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
              <div>
                <span style={{fontSize:9,color:DC[sel.diff],letterSpacing:3,textTransform:"uppercase",fontWeight:700,marginRight:10}}>{sel.diff}</span>
                <span style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{sel.name}</span>
                {creativeTwist && sel.type!=="sandbox" && (
                  <div style={{fontSize:10,color:"#b45309",letterSpacing:1,marginTop:4}}>
                    Twist: {creativeTwist.title}
                  </div>
                )}
              </div>
              <div style={{display:"flex",gap:7}}>
                <button onClick={()=>setPanel(panel==="brief"?null:"brief")} style={{background:panel==="brief"?"#1e293b":"none",color:panel==="brief"?"#fff":"#64748b",border:"1px solid #e2e8f0",borderRadius:5,fontSize:10,cursor:"pointer",padding:"4px 10px",fontFamily:"'Courier New',monospace",display:sel.type==="sandbox"?"none":"block"}}>
                  📋 BRIEF
                </button>
                <button onClick={()=>setPhase2(phase2==="sim"?null:"sim")} style={{background:phase2==="sim"?"#0f766e":"#f0fdf4",color:phase2==="sim"?"#fff":"#0f766e",border:"1px solid #99f6e4",borderRadius:5,fontSize:10,cursor:"pointer",padding:"4px 10px",fontFamily:"'Courier New',monospace",fontWeight:700}}>
                  ⚡ SIM
                </button>
                {sel.type!=="sandbox" && (
                  <button onClick={()=>rollCreativeTwist(sel)} style={{background:"#fff7ed",color:"#9a3412",border:"1px solid #fdba74",borderRadius:5,fontSize:10,cursor:"pointer",padding:"4px 10px",fontFamily:"'Courier New',monospace",fontWeight:700}}>
                    🎲 {creativeTwist ? "NEW TWIST" : "TWIST"}
                  </button>
                )}
                {creativeTwist && sel.type!=="sandbox" && (
                  <button onClick={()=>setPanel(panel==="twist"?null:"twist")} style={{background:panel==="twist"?"#b45309":"#fffbeb",color:panel==="twist"?"#fff":"#b45309",border:"1px solid #fcd34d",borderRadius:5,fontSize:10,cursor:"pointer",padding:"4px 10px",fontFamily:"'Courier New',monospace"}}>
                    {panel==="twist"?"HIDE TWIST":"VIEW TWIST"}
                  </button>
                )}
                {sel.type==="guided"&&sel.diagram&&(
                  <button onClick={()=>setPanel(panel==="ref"?null:"ref")} style={{background:panel==="ref"?"#1e293b":"#f1f5f9",color:panel==="ref"?"#fff":"#64748b",border:"1px solid #e2e8f0",borderRadius:5,fontSize:10,cursor:"pointer",padding:"4px 10px"}}>
                    {panel==="ref"?"HIDE REF":"REF"}
                  </button>
                )}
                {sel.type==="challenge"&&(
                  <button onClick={()=>setPanel(panel==="hints"?null:"hints")} style={{background:panel==="hints"?"#7c3aed":"#f5f3ff",color:panel==="hints"?"#fff":"#7c3aed",border:"1px solid #ddd6fe",borderRadius:5,fontSize:10,cursor:"pointer",padding:"4px 10px"}}>
                    {panel==="hints"?"HIDE HINTS":"HINTS"}
                  </button>
                )}
              </div>
            </div>
            {/* Slide-in panel — overlays the canvas without navigating away */}
            {panel && (
              <div className="soft-panel" style={{position:"absolute",top:52,right:0,width:"min(420px,95%)",maxHeight:"75vh",overflowY:"auto",borderRadius:14,padding:18,zIndex:100,boxShadow:"0 14px 34px rgba(77,96,131,0.2)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#0f172a",letterSpacing:1}}>
                      {panel==="brief"?"BRIEF":panel==="ref"?"REFERENCE DIAGRAM":panel==="hints"?"HINTS":"CREATIVE TWIST"}
                  </span>
                  <button onClick={()=>setPanel(null)} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#94a3b8",lineHeight:1}}>✕</button>
                </div>
                {panel==="ref" && sel.diagram && sel.diagram}
                {panel==="hints" && sel.hints && sel.hints.map((h,i)=>(
                  <div key={i} style={{fontSize:12,color:"#6d28d9",marginBottom:7,lineHeight:1.6}}>
                    <span style={{color:"#ddd6fe"}}>{i+1}.  </span>{h}
                  </div>
                ))}
                {panel==="twist" && creativeTwist && (
                  <div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:8,padding:"12px 14px"}}>
                    <div style={{fontSize:9,letterSpacing:3,color:"#b45309",textTransform:"uppercase",marginBottom:7,fontWeight:700}}>Active Remix Objective</div>
                    <div style={{fontSize:13,color:"#7c2d12",fontWeight:700,marginBottom:6}}>{creativeTwist.title}</div>
                    <div style={{fontSize:12,color:"#9a3412",lineHeight:1.7}}>{creativeTwist.prompt}</div>
                  </div>
                )}
                {panel==="brief" && (
                  sel.type==="challenge" ? (
                    <>
                      <p style={{fontSize:12,color:"#334155",lineHeight:1.8,background:"#faf5ff",border:"1px solid #e9d5ff",borderRadius:7,padding:"10px 12px",marginBottom:12}}>{sel.goal}</p>
                      <div style={{fontSize:9,letterSpacing:3,color:"#94a3b8",textTransform:"uppercase",marginBottom:8}}>Checkpoints</div>
                      {sel.checkpoints.map((cp,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6}}><span style={{color:"#e2e8f0",flexShrink:0}}>□</span><span style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{cp}</span></div>)}
                    </>
                  ) : (
                    <>
                      <div style={{fontSize:10,color:"#64748b",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Parameters</div>
                      {sel.params.map((p,i)=><div key={i} style={{display:"flex",gap:7,marginBottom:7,alignItems:"flex-start"}}><span style={{color:"#1e40af",fontWeight:700,flexShrink:0,fontSize:12}}>{String.fromCharCode(65+i)}.</span><span style={{fontSize:11,color:"#334155",lineHeight:1.6}}>{p}</span></div>)}
                      <div style={{fontSize:9,letterSpacing:3,color:"#94a3b8",textTransform:"uppercase",margin:"12px 0 8px"}}>Checkpoints</div>
                      {sel.checkpoints.map((cp,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6}}><span style={{color:"#e2e8f0",flexShrink:0}}>□</span><span style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{cp}</span></div>)}
                    </>
                  )
                )}
              </div>
            )}
            {phase2==="sim-loading" && (
              <div className="soft-panel" style={{borderRadius:14,padding:40,textAlign:"center"}}>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <div style={{width:36,height:36,border:"3px solid #e2e8f0",borderTop:"3px solid #0f766e",borderRadius:"50%",margin:"0 auto 16px",animation:"spin 0.8s linear infinite"}}/>
                <div style={{fontSize:13,color:"#475569",fontFamily:"'Courier New',monospace",letterSpacing:1}}>READING YOUR CIRCUIT...</div>
                <div style={{fontSize:10,color:"#94a3b8",marginTop:8}}>AI is parsing your drawing into a live simulation</div>
              </div>
            )}
            {testError && phase2!=="sim" && phase2!=="sim-loading" && (
              <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:16,display:"flex",gap:12,alignItems:"flex-start"}}>
                <span style={{fontSize:18,flexShrink:0}}>⚠️</span>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#dc2626",marginBottom:4,fontFamily:"'Courier New',monospace"}}>SIMULATION FAILED</div>
                  <div style={{fontSize:12,color:"#7f1d1d",lineHeight:1.7}}>{testError}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:8}}>Tips: make sure all contacts and coils are clearly labeled, rails are visible, and lines are connected.</div>
                  <button onClick={()=>setTestError("")} style={{marginTop:10,background:"none",border:"1px solid #fecaca",borderRadius:5,color:"#dc2626",padding:"4px 10px",cursor:"pointer",fontSize:10,fontFamily:"'Courier New',monospace"}}>DISMISS</button>
                </div>
              </div>
            )}
            {phase2==="sim" && (
              <Simulator
                circuit={sel}
                circuitId={aiSimDef ? null : sel.id}
                simDef={aiSimDef || undefined}
                onClose={()=>{if(sel?.type==="sandbox"){setPhase("draw")}setPhase2(null);setAiSimDef(null);}}
              />
            )}
            <div style={{display: phase2==="sim" || phase2==="sim-loading" ? "none" : "block"}}>
              <Canvas onSubmit={grade} onTest={testCircuit} isSandbox={sel.type==="sandbox"}/>
            </div>
          </div>
        )}

        {phase==="feedback" && sel && (
          <div className="soft-grid-2">
            <div className="soft-panel" style={{borderRadius:14,padding:14}}>
              <div style={{fontSize:9,letterSpacing:4,color:"#94a3b8",textTransform:"uppercase",marginBottom:9}}>Your Drawing</div>
              {drawn&&<img src={drawn} alt="drawing" style={{width:"100%",borderRadius:7,border:"1px solid #e5e7eb"}}/>}
              <div style={{display:"flex",gap:7,marginTop:10}}>
                <button onClick={()=>{setPhase("draw");setFeedback("");setDrawn(null);}} style={{flex:1,background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:7,color:"#64748b",padding:"9px",cursor:"pointer",fontSize:10,letterSpacing:1,fontFamily:"'Courier New',monospace"}}>↩ REDRAW</button>
                <button onClick={reset} style={{flex:1,background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:7,color:"#64748b",padding:"9px",cursor:"pointer",fontSize:10,letterSpacing:1,fontFamily:"'Courier New',monospace"}}>NEW CIRCUIT</button>
              </div>
            </div>
            <div className="soft-panel" style={{borderRadius:14,padding:18}}>
              <div style={{fontSize:9,letterSpacing:4,color:"#1d4ed8",textTransform:"uppercase",marginBottom:10,fontWeight:700}}>Instructor Feedback</div>
              {loading ? (
                <div style={{display:"flex",flexDirection:"column",gap:9,marginTop:14}}>
                  <style>{`@keyframes pulse{0%,100%{opacity:.15}50%{opacity:.5}}`}</style>
                  {[100,80,95,60,88,72].map((w,i)=><div key={i} style={{height:10,borderRadius:3,background:"#e2e8f0",width:w+"%",animation:`pulse 1.3s ease-in-out ${i*0.13}s infinite`}}/>)}
                  <div style={{color:"#94a3b8",fontSize:10,marginTop:5}}>Analysing your diagram...</div>
                </div>
              ) : (
                <pre style={{whiteSpace:"pre-wrap",fontFamily:"'Courier New',monospace",fontSize:12,color:"#334155",lineHeight:1.85,margin:0,maxHeight:520,overflowY:"auto"}}>{feedback}</pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
