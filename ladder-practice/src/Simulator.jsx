import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
// CIRCUIT LOGIC DEFINITIONS
// Each circuit is defined as rungs, each rung as a logic expression
// and a set of output coils it drives.
//
// Element types:
//   { type:"NO", id:"START", label:"START" }       — NO pushbutton/contact
//   { type:"NC", id:"STOP",  label:"STOP"  }       — NC contact (closed unless tag is energized)
//   { type:"NO_LS", id:"1LS", label:"1LS"  }       — NO limit switch (toggled manually)
//   { type:"NC_LS", id:"2LS", label:"2LS"  }       — NC limit switch
//   { type:"ESTOP", id:"ESTOP" }                    — NC E-STOP
//   { type:"PARALLEL", branches:[[...],[...]] }     — parallel group (OR)
//   { type:"PS", id:"PS1", label:"PS1\n80PSI" }    — pressure switch NO
//   { type:"SSW", id:"SSW1", label:"SSW1" }        — selector switch NO
//
// outputs: array of coil ids this rung drives when energized
// outputs can be "coil", "sol", "light", "motor", "timer"
// ═══════════════════════════════════════════════════════════════════

export const SIM_CIRCUITS = {

  1: { // Start/Stop light
    elements: ["ESTOP","STOP","CR1","G"],
    rungs: [
      {
        id: "r1",
        series: [
          {type:"ESTOP", id:"ESTOP"},
          {type:"NC", id:"STOP", label:"STOP"},
          {type:"PARALLEL", branches:[
            [{type:"NO", id:"START", label:"START"}],
            [{type:"NO", id:"CR1", label:"CR1-1"}],
          ]},
        ],
        outputs: ["CR1"],
      },
      {
        id: "r2",
        series: [{type:"NO", id:"CR1", label:"CR1-2"}],
        outputs: ["G"],
      },
    ],
    coils: {
      CR1: {label:"CR1", type:"relay"},
      G:   {label:"G",   type:"light", color:"#16a34a"},
    },
    inputs: {
      ESTOP: {label:"E-STOP", type:"estop", default:true},
      STOP:  {label:"STOP",   type:"pb_nc"},
      START: {label:"START",  type:"pb_no"},
    },
  },

  2: { // Two lights G/R
    rungs: [
      {
        id:"r1",
        series:[
          {type:"ESTOP",id:"ESTOP"},
          {type:"NC",id:"STOP",label:"STOP"},
          {type:"PARALLEL",branches:[
            [{type:"NO",id:"START",label:"START"}],
            [{type:"NO",id:"CR1",label:"CR1-1"}],
          ]},
        ],
        outputs:["CR1"],
      },
      {id:"r2", series:[{type:"NO",id:"CR1",label:"CR1-2"}], outputs:["G"]},
      {id:"r3", series:[{type:"NC",id:"CR1",label:"CR1-3"}], outputs:["R"]},
    ],
    coils:{
      CR1:{label:"CR1",type:"relay"},
      G:{label:"G",type:"light",color:"#16a34a"},
      R:{label:"R",type:"light",color:"#dc2626"},
    },
    inputs:{
      ESTOP:{label:"E-STOP",type:"estop",default:true},
      STOP:{label:"STOP",type:"pb_nc"},
      START:{label:"START",type:"pb_no"},
    },
  },

  4: { // Single acting cylinder
    rungs:[
      {
        id:"r1",
        series:[
          {type:"ESTOP",id:"ESTOP"},
          {type:"NC",id:"STOP",label:"STOP"},
          {type:"PARALLEL",branches:[
            [{type:"NO",id:"START",label:"START"}],
            [{type:"NO",id:"CR1",label:"CR1-1"}],
          ]},
        ],
        outputs:["CR1"],
      },
      {
        id:"r2",
        series:[
          {type:"NO",id:"CR1",label:"CR1-2"},
          {type:"NC_LS",id:"2LS",label:"2LS"},
        ],
        outputs:["SOLA"],
      },
      {id:"r3",series:[{type:"NO",id:"CR1",label:"CR1-3"}],outputs:["G"]},
    ],
    coils:{
      CR1:{label:"CR1",type:"relay"},
      SOLA:{label:"SOL-A",type:"sol"},
      G:{label:"G",type:"light",color:"#16a34a"},
    },
    inputs:{
      ESTOP:{label:"E-STOP",type:"estop",default:true},
      STOP:{label:"STOP",type:"pb_nc"},
      START:{label:"START",type:"pb_no"},
      "2LS":{label:"2LS (extend end)",type:"ls_nc"},
    },
  },

  5: { // Jogging
    rungs:[
      {
        id:"r1",
        series:[
          {type:"ESTOP",id:"ESTOP"},
          {type:"NC",id:"STOP",label:"STOP"},
          {type:"PARALLEL",branches:[
            [{type:"NO",id:"START",label:"START"}],
            [{type:"NO",id:"M",label:"M-1"}],
          ]},
          {type:"NC",id:"JOG",label:"JOG"},
          {type:"NC",id:"OL",label:"OL"},
        ],
        outputs:["M"],
      },
      {
        id:"r2",
        series:[
          {type:"NO",id:"JOG",label:"JOG"},
          {type:"NC",id:"OL",label:"OL"},
        ],
        outputs:["M"],
      },
    ],
    coils:{
      M:{label:"M",type:"motor"},
    },
    inputs:{
      ESTOP:{label:"E-STOP",type:"estop",default:true},
      STOP:{label:"STOP",type:"pb_nc"},
      START:{label:"START",type:"pb_no"},
      JOG:{label:"JOG",type:"pb_no"},
      OL:{label:"OL (overload)",type:"ls_nc"},
    },
  },

  6: { // Forward/Reverse
    rungs:[
      {
        id:"r1",
        series:[
          {type:"ESTOP",id:"ESTOP"},
          {type:"NC",id:"STOP",label:"STOP"},
          {type:"PARALLEL",branches:[
            [{type:"NO",id:"FPB",label:"F-PB"}],
            [{type:"NO",id:"F",label:"F-1"}],
          ]},
          {type:"NC",id:"R",label:"R"},
          {type:"NC",id:"OL",label:"OL"},
        ],
        outputs:["F"],
      },
      {
        id:"r2",
        series:[
          {type:"ESTOP",id:"ESTOP"},
          {type:"NC",id:"STOP",label:"STOP"},
          {type:"PARALLEL",branches:[
            [{type:"NO",id:"RPB",label:"R-PB"}],
            [{type:"NO",id:"R",label:"R-1"}],
          ]},
          {type:"NC",id:"F",label:"F"},
          {type:"NC",id:"OL",label:"OL"},
        ],
        outputs:["R"],
      },
      {id:"r3",series:[{type:"NO",id:"F",label:"F-2"}],outputs:["G"]},
    ],
    coils:{
      F:{label:"F (Fwd)",type:"motor"},
      R:{label:"R (Rev)",type:"motor"},
      G:{label:"G",type:"light",color:"#16a34a"},
    },
    inputs:{
      ESTOP:{label:"E-STOP",type:"estop",default:true},
      STOP:{label:"STOP",type:"pb_nc"},
      FPB:{label:"F-PB (Forward)",type:"pb_no"},
      RPB:{label:"R-PB (Reverse)",type:"pb_no"},
      OL:{label:"OL (overload)",type:"ls_nc"},
    },
  },

  7: { // Double acting cylinder
    rungs:[
      {
        id:"r1",
        series:[
          {type:"ESTOP",id:"ESTOP"},
          {type:"NC",id:"STOP",label:"STOP"},
          {type:"PARALLEL",branches:[
            [{type:"NO",id:"START",label:"START"},
             {type:"NO_LS",id:"1LS",label:"1LS"}],
            [{type:"NO",id:"CR1",label:"CR1-1"}],
          ]},
        ],
        outputs:["CR1"],
      },
      {
        id:"r2",
        series:[
          {type:"NO",id:"CR1",label:"CR1-2"},
          {type:"NC",id:"SOLB",label:"SOL-B"},
        ],
        outputs:["SOLA"],
      },
      {
        id:"r3",
        series:[
          {type:"NO_LS",id:"2LS",label:"2LS"},
          {type:"NC",id:"SOLA",label:"SOL-A"},
        ],
        outputs:["SOLB"],
      },
      {id:"r4",series:[{type:"NO",id:"CR1",label:"CR1-3"}],outputs:["G"]},
    ],
    coils:{
      CR1:{label:"CR1",type:"relay"},
      SOLA:{label:"SOL-A",type:"sol"},
      SOLB:{label:"SOL-B",type:"sol"},
      G:{label:"G",type:"light",color:"#16a34a"},
    },
    inputs:{
      ESTOP:{label:"E-STOP",type:"estop",default:true},
      STOP:{label:"STOP",type:"pb_nc"},
      START:{label:"START",type:"pb_no"},
      "1LS":{label:"1LS (home/retract end)",type:"ls_no"},
      "2LS":{label:"2LS (extend end)",type:"ls_no"},
    },
  },

};

// ═══════════════════════════════════════════════════════════════════
// LOGIC SOLVER
// Evaluates all rungs given current state, returns new coil states
// Runs iteratively until stable (handles seal-ins)
// ═══════════════════════════════════════════════════════════════════
function solveCircuit(rungs, inputState, prevCoils) {
  let coils = {...prevCoils};

  // Reset all coil states before solving
  for (const k of Object.keys(coils)) coils[k] = false;

  // Iterate until stable (max 20 passes for relay chains)
  for (let pass = 0; pass < 20; pass++) {
    const prev = {...coils};

    for (const rung of rungs) {
      const powered = evalSeries(rung.series, inputState, coils);
      for (const out of rung.outputs) {
        if (powered) coils[out] = true;
      }
    }

    // Check if stable
    let stable = true;
    for (const k of Object.keys(coils)) {
      if (coils[k] !== prev[k]) { stable = false; break; }
    }
    if (stable) break;
  }

  return coils;
}

function evalSeries(series, inputState, coils) {
  for (const el of series) {
    if (!evalElement(el, inputState, coils)) return false;
  }
  return true;
}

function evalElement(el, inputState, coils) {
  switch(el.type) {
    case "ESTOP":
      return inputState["ESTOP"] !== false; // default true (closed)
    case "NO": {
      // Could be a physical input OR a relay contact
      const v = inputState[el.id] !== undefined ? inputState[el.id] : (coils[el.id] || false);
      return v === true;
    }
    case "NC": {
      const v = inputState[el.id] !== undefined ? inputState[el.id] : (coils[el.id] || false);
      return v === false; // NC = closed when tag is NOT energized
    }
    case "NO_LS":
      return inputState[el.id] === true;
    case "NC_LS":
      return inputState[el.id] !== true;
    case "PS":
      return inputState[el.id] === true;
    case "SSW":
      return inputState[el.id] === true;
    case "PARALLEL":
      return el.branches.some(branch => evalSeries(branch, inputState, coils));
    default:
      return false;
  }
}

// ═══════════════════════════════════════════════════════════════════
// RUNG RENDERER — draws one rung as SVG with power-flow highlight
// ═══════════════════════════════════════════════════════════════════
const POWERED = "#f59e0b";
const DEAD    = "#94a3b8";
const INK     = "#1e293b";

// Calculate how many "slots" an element takes up horizontally
function elementWidth(el) {
  if (el.type === "PARALLEL") {
    const branchW = el.branches.map(b => b.reduce((s, e) => s + elementWidth(e), 0));
    return Math.max(...branchW);
  }
  return 1;
}

// Calculate total slots for a series
function seriesWidth(series) {
  return series.reduce((s, e) => s + elementWidth(e), 0);
}

const SLOT = 58; // px per contact slot
const PAD  = 22;
const COIL_W = 36;

function RungSVG({ rung, inputState, coils, coilDefs, onToggle, powered }) {
  const totalSlots = seriesWidth(rung.series);
  const W = Math.max(PAD + totalSlots * SLOT + COIL_W + PAD + 20, 340);

  // Height: need room for parallel branches
  // Find max parallel branches in this rung
  let maxBranches = 1;
  for (const el of rung.series) {
    if (el.type === "PARALLEL") maxBranches = Math.max(maxBranches, el.branches.length);
  }
  const BRANCH_H = 46;
  const H = Math.max(60, maxBranches * BRANCH_H + 20);
  const midY = maxBranches === 1 ? H / 2 + 4 : BRANCH_H / 2 + 10;

  const wire = powered ? POWERED : DEAD;
  const coilX = PAD + totalSlots * SLOT + 4;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",overflow:"visible",marginBottom:2}}>
      {/* Left rail */}
      <line x1={PAD} y1={4} x2={PAD} y2={H-4} stroke={wire} strokeWidth="3"/>
      {/* Right rail stub */}
      <line x1={W-PAD} y1={4} x2={W-PAD} y2={H-4} stroke={wire} strokeWidth="3"/>
      {/* Render series elements */}
      <SeriesSVG
        series={rung.series}
        x0={PAD}
        y={midY}
        H={H}
        inputState={inputState}
        coils={coils}
        powered={powered}
        onToggle={onToggle}
      />
      {/* Wire from last element to coil */}
      <line x1={coilX} y1={midY} x2={coilX+4} y2={midY} stroke={wire} strokeWidth="2"/>
      {/* Output coils */}
      {rung.outputs.map((outId, i) => {
        const def = coilDefs[outId] || {label:outId, type:"relay"};
        return (
          <CoilSVG key={outId} x={coilX+4} y={midY + i*26} def={def} energized={coils[outId]}/>
        );
      })}
      {/* Wire from coil to right rail */}
      <line x1={coilX+36} y1={midY} x2={W-PAD} y2={midY} stroke={wire} strokeWidth="2"/>
    </svg>
  );
}

// Renders a series of elements starting at x0, returns end x
function SeriesSVG({ series, x0, y, H, inputState, coils, powered, onToggle }) {
  let x = x0;
  const els = [];
  for (let i = 0; i < series.length; i++) {
    const el = series[i];
    const w = elementWidth(el) * SLOT;
    if (el.type === "PARALLEL") {
      els.push(
        <ParallelSVG key={i} el={el} x={x} y={y} H={H}
          inputState={inputState} coils={coils} powered={powered} onToggle={onToggle}/>
      );
    } else {
      // Wire before contact
      els.push(<line key={`w${i}`} x1={x} y1={y} x2={x+8} y2={y} stroke={powered?POWERED:DEAD} strokeWidth="2"/>);
      els.push(
        <ElementSVG key={`e${i}`} el={el} x={x+8} y={y}
          inputState={inputState} coils={coils} powered={powered} onToggle={onToggle}/>
      );
    }
    x += w;
  }
  // Final wire segment
  els.push(<line key="wfinal" x1={x} y1={y} x2={x} y2={y} stroke={powered?POWERED:DEAD} strokeWidth="2"/>);
  return <>{els}</>;
}

// Renders a PARALLEL element: draws each branch stacked vertically with vertical connector lines
function ParallelSVG({ el, x, y, H, inputState, coils, powered, onToggle }) {
  const branches = el.branches;
  const nBranches = branches.length;
  const BRANCH_H = 46;
  const totalH = nBranches * BRANCH_H;
  const startY = y - (totalH / 2) + BRANCH_H / 2;
  const maxW = Math.max(...branches.map(b => seriesWidth(b))) * SLOT;

  const els = [];

  // Left vertical connector
  els.push(<line key="lv" x1={x+4} y1={startY} x2={x+4} y2={startY+(nBranches-1)*BRANCH_H} stroke={powered?POWERED:DEAD} strokeWidth="1.5"/>);
  // Right vertical connector
  els.push(<line key="rv" x1={x+maxW+4} y1={startY} x2={x+maxW+4} y2={startY+(nBranches-1)*BRANCH_H} stroke={powered?POWERED:DEAD} strokeWidth="1.5"/>);

  branches.forEach((branch, bi) => {
    const by = startY + bi * BRANCH_H;

    const bPowered = powered && evalSeries(branch, inputState, coils);
    const wire = bPowered ? POWERED : DEAD;

    // Horizontal wire from left connector to first element
    els.push(<line key={`bl${bi}`} x1={x+4} y1={by} x2={x+12} y2={by} stroke={wire} strokeWidth="2"/>);

    // Elements in this branch
    let bx = x + 12;
    branch.forEach((bel, bei) => {
      els.push(<line key={`bw${bi}-${bei}`} x1={bx} y1={by} x2={bx+4} y2={by} stroke={wire} strokeWidth="2"/>);
      els.push(
        <ElementSVG key={`be${bi}-${bei}`} el={bel} x={bx+4} y={by}
          inputState={inputState} coils={coils} powered={bPowered} onToggle={onToggle}/>
      );
      bx += elementWidth(bel) * SLOT;
    });

    // Wire from last element to right connector
    els.push(<line key={`br${bi}`} x1={bx} y1={by} x2={x+maxW+4} y2={by} stroke={wire} strokeWidth="2"/>);
  });

  // Wire out from right connector to next element
  els.push(<line key="rout" x1={x+maxW+4} y1={y} x2={x+maxW+SLOT} y2={y} stroke={powered?POWERED:DEAD} strokeWidth="2"/>);

  return <>{els}</>;
}

function ElementSVG({ el, x, y, inputState, coils, powered, onToggle }) {
  if (el.type === "_PAR_SEP") return null;

  const isActive = getElementActive(el, inputState, coils);
  const c = powered && isActive ? POWERED : DEAD;
  const isClickable = ["NO","NC","ESTOP","NO_LS","NC_LS","PS","SSW"].includes(el.type);
  const lbl = el.label || el.id || "";

  const handleClick = () => {
    if (!isClickable) return;
    onToggle(el.id, el.type);
  };

  return (
    <g onClick={handleClick} style={{cursor:isClickable?"pointer":"default"}}>
      {/* label */}
      <text x={x+12} y={y-14} textAnchor="middle" fontSize="8" fill={INK} fontFamily="Arial Narrow,Arial">{lbl}</text>

      {el.type === "ESTOP" && (
        <>
          <line x1={x} y1={y} x2={x+6} y2={y} stroke={c} strokeWidth="2"/>
          <circle cx={x+6} cy={y} r="2" fill={c}/>
          <line x1={x+6} y1={y-7} x2={x+6} y2={y+7} stroke={c} strokeWidth="1.5"/>
          <line x1={x+18} y1={y-7} x2={x+18} y2={y+7} stroke={c} strokeWidth="1.5"/>
          <circle cx={x+18} cy={y} r="2" fill={c}/>
          <line x1={x+18} y1={y} x2={x+24} y2={y} stroke={c} strokeWidth="2"/>
          {/* diagonal slash */}
          <line x1={x+3} y1={y+7} x2={x+21} y2={y-7} stroke={c} strokeWidth="1.5"/>
        </>
      )}

      {(el.type === "NO" || el.type === "NO_LS" || el.type === "PS" || el.type === "SSW") && (
        <>
          <line x1={x} y1={y} x2={x+6} y2={y} stroke={c} strokeWidth="2"/>
          <circle cx={x+6} cy={y} r="2" fill={c}/>
          <line x1={x+6} y1={y-7} x2={x+6} y2={y+7} stroke={c} strokeWidth="1.5"/>
          <line x1={x+18} y1={y-7} x2={x+18} y2={y+7} stroke={c} strokeWidth="1.5"/>
          <circle cx={x+18} cy={y} r="2" fill={c}/>
          <line x1={x+18} y1={y} x2={x+24} y2={y} stroke={c} strokeWidth="2"/>
        </>
      )}

      {(el.type === "NC" || el.type === "NC_LS") && (
        <>
          <line x1={x} y1={y} x2={x+6} y2={y} stroke={c} strokeWidth="2"/>
          <circle cx={x+6} cy={y} r="2" fill={c}/>
          <line x1={x+6} y1={y-7} x2={x+6} y2={y+7} stroke={c} strokeWidth="1.5"/>
          <line x1={x+18} y1={y-7} x2={x+18} y2={y+7} stroke={c} strokeWidth="1.5"/>
          <circle cx={x+18} cy={y} r="2" fill={c}/>
          <line x1={x+18} y1={y} x2={x+24} y2={y} stroke={c} strokeWidth="2"/>
          <line x1={x+3} y1={y+6} x2={x+21} y2={y-6} stroke={c} strokeWidth="1.5"/>
        </>
      )}

      {/* Active state indicator dot */}
      {isClickable && isActive && (
        <circle cx={x+12} cy={y+13} r="3" fill={POWERED} opacity="0.9"/>
      )}
      {isClickable && !isActive && (
        <circle cx={x+12} cy={y+13} r="3" fill="#e2e8f0"/>
      )}
    </g>
  );
}

function getElementActive(el, inputState, coils) {
  switch(el.type) {
    case "ESTOP": return inputState["ESTOP"] !== false;
    case "NO": {
      const v = inputState[el.id] !== undefined ? inputState[el.id] : (coils[el.id]||false);
      return v === true;
    }
    case "NC": {
      const v = inputState[el.id] !== undefined ? inputState[el.id] : (coils[el.id]||false);
      return v === false;
    }
    case "NO_LS": return inputState[el.id] === true;
    case "NC_LS": return inputState[el.id] !== true;
    case "PS": return inputState[el.id] === true;
    case "SSW": return inputState[el.id] === true;
    case "PARALLEL": return el.branches.some(b => b.every(e => getElementActive(e, inputState, coils)));
    default: return false;
  }
}

function CoilSVG({ x, y, def, energized }) {
  const c = energized ? POWERED : DEAD;
  const glow = energized && (def.type === "light" || def.type === "motor" || def.type === "sol");

  return (
    <g>
      {glow && <circle cx={x+11} cy={y} r="16" fill={def.color||POWERED} opacity="0.18"/>}
      <circle cx={x+11} cy={y} r="11" fill="none" stroke={c} strokeWidth={energized?2:1.5}/>
      {def.type === "sol" && (
        <path d={`M${x+4},${y} q2,-3,4,0 q2,3,4,0 q2,-3,3,0`} fill="none" stroke={c} strokeWidth="1.2"/>
      )}
      {def.type === "light" && (
        <>
          <line x1={x+4} y1={y-7} x2={x+18} y2={y+7} stroke={c} strokeWidth="1.2"/>
          <line x1={x+18} y1={y-7} x2={x+4} y2={y+7} stroke={c} strokeWidth="1.2"/>
          {/* 4 rays when energized */}
          {energized && <>
            <line x1={x-1} y1={y-10} x2={x+2} y2={y-14} stroke={def.color||POWERED} strokeWidth="1.5"/>
            <line x1={x+23} y1={y-10} x2={x+20} y2={y-14} stroke={def.color||POWERED} strokeWidth="1.5"/>
            <line x1={x-1} y1={y+10} x2={x+2} y2={y+14} stroke={def.color||POWERED} strokeWidth="1.5"/>
            <line x1={x+23} y1={y+10} x2={x+20} y2={y+14} stroke={def.color||POWERED} strokeWidth="1.5"/>
          </>}
        </>
      )}
      {(def.type === "relay" || def.type === "motor") && (
        <text x={x+11} y={y+3} textAnchor="middle" fontSize="7" fill={c} fontFamily="Arial Narrow,Arial">{def.label}</text>
      )}
      {def.type === "light" && (
        <text x={x+11} y={y+3} textAnchor="middle" fontSize="8" fontWeight="bold" fill={energized?(def.color||POWERED):DEAD} fontFamily="Arial Narrow,Arial">{def.label}</text>
      )}
      <text x={x+11} y={y+20} textAnchor="middle" fontSize="8" fill={INK} fontFamily="Arial Narrow,Arial">
        {def.type==="sol"?def.label:def.type==="light"?"":def.label}
      </text>
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SIMULATOR COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function Simulator({ circuit, circuitId, simDef: simDefProp, onClose }) {
  const simDef = simDefProp || SIM_CIRCUITS[circuitId];

  // Build initial input state from defaults — must come before any early return
  const buildInitialState = useCallback(() => {
    if (!simDef) return {};
    const s = {};
    for (const [id, def] of Object.entries(simDef.inputs)) {
      if (def.type === "estop") s[id] = true; // E-STOP closed by default
      else if (def.type === "pb_nc") s[id] = false; // STOP not pressed
      else if (def.type === "pb_no") s[id] = false;
      else if (def.type === "ls_no") s[id] = false;
      else if (def.type === "ls_nc") s[id] = false;
      else s[id] = def.default || false;
    }
    return s;
  }, [simDef]);

  const [inputState, setInputState] = useState(buildInitialState);
  const [coils, setCoils] = useState({});

  // Solve circuit whenever inputs change
  useEffect(() => {
    const initCoils = {};
    for (const k of Object.keys(simDef.coils)) initCoils[k] = false;
    const solved = solveCircuit(simDef.rungs, inputState, initCoils);
    setCoils(solved);
  }, [inputState, simDef]);

  const handleToggle = (id, type) => {
    setInputState(prev => {
      const def = simDef.inputs[id];
      if (!def) return prev;

      if (def.type === "pb_no") {
        // Momentary — toggle on click, but we'll use mousedown/up in the buttons panel
        return {...prev, [id]: !prev[id]};
      }
      if (def.type === "pb_nc") {
        return {...prev, [id]: !prev[id]};
      }
      if (def.type === "estop") {
        return {...prev, [id]: !prev[id]};
      }
      // LS and switches — toggle
      return {...prev, [id]: !prev[id]};
    });
  };

  const handleReset = () => setInputState(buildInitialState());

  // Track which momentary buttons are held — release on window mouseup/touchend
  const heldRef = useRef(null);
  useEffect(() => {
    const release = () => {
      if (heldRef.current) {
        setInputState(p => ({...p, [heldRef.current]: false}));
        heldRef.current = null;
      }
    };
    window.addEventListener("mouseup", release);
    window.addEventListener("touchend", release);
    return () => {
      window.removeEventListener("mouseup", release);
      window.removeEventListener("touchend", release);
    };
  }, []);

  // Early return AFTER all hooks
  if (!simDef) {
    return (
      <div style={{background:"rgba(255,255,255,0.9)",borderRadius:14,padding:28,textAlign:"center",border:"1px solid #dbe7f5",boxShadow:"0 14px 28px rgba(77,96,131,0.1)"}}>
        <div style={{fontSize:13,color:"#64748b",marginBottom:12}}>Simulator not available for this circuit yet.</div>
        <div style={{fontSize:11,color:"#94a3b8",marginBottom:16}}>Available for: Start/Stop, Two Lights, Single-Acting Cylinder, Jogging, Forward/Reverse, Double-Acting Cylinder.</div>
        <button onClick={onClose} style={{background:"#eef4ff",border:"1px solid #d3e0f2",borderRadius:10,padding:"8px 20px",cursor:"pointer",fontSize:12,fontFamily:"'IBM Plex Mono','Courier New',monospace",color:"#64748b"}}>← BACK</button>
      </div>
    );
  }

  // Determine which rungs are powered
  const getRungPowered = (rung) => {
    return evalSeries(rung.series, inputState, coils);
  };

  const getInputColor = (id, def) => {
    const active = inputState[id];
    if (def.type === "estop") return active ? "#16a34a" : "#dc2626";
    if (def.type === "pb_no") return active ? POWERED : "#e2e8f0";
    if (def.type === "pb_nc") return active ? "#dc2626" : "#16a34a"; // STOP pressed = red
    if (def.type === "ls_no" || def.type === "ls_nc") return active ? POWERED : "#e2e8f0";
    return active ? POWERED : "#e2e8f0";
  };

  const getInputLabel = (id, def) => {
    const active = inputState[id];
    if (def.type === "estop") return active ? "CLOSED ✓" : "TRIPPED ✗";
    if (def.type === "pb_nc") return active ? "PRESSED" : "RELEASED";
    return active ? "ON / TRIPPED" : "OFF / CLEAR";
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12,fontFamily:"'Nunito','Trebuchet MS',sans-serif"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg, #ffffff 0%, #f8f5ff 50%, #ecf8ff 100%)",borderRadius:14,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #dbe7f5",boxShadow:"0 12px 24px rgba(77,96,131,0.09)"}}>
        <div>
          <div style={{fontSize:9,letterSpacing:3,color:"#5d6c84",textTransform:"uppercase",marginBottom:2,fontWeight:700}}>Circuit Simulator</div>
          <div style={{fontSize:14,fontWeight:700,color:"#2f3348"}}>{circuit.name}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={handleReset} style={{background:"#eef4ff",border:"1px solid #d3e0f2",borderRadius:10,color:"#5b6a82",cursor:"pointer",fontSize:10,padding:"6px 10px",fontFamily:"'IBM Plex Mono','Courier New',monospace"}}>RESET</button>
          <button onClick={onClose} style={{background:"#eef4ff",border:"1px solid #d3e0f2",borderRadius:10,color:"#5b6a82",cursor:"pointer",fontSize:10,padding:"6px 10px",fontFamily:"'IBM Plex Mono','Courier New',monospace"}}>BACK</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:12}}>
        {/* Ladder diagram */}
        <div style={{background:"rgba(255,255,255,0.9)",border:"1px solid #dbe7f5",borderRadius:14,padding:16,boxShadow:"0 10px 22px rgba(77,96,131,0.08)"}}>
          <div style={{fontSize:9,letterSpacing:4,color:"#94a3b8",textTransform:"uppercase",marginBottom:12}}>Live Ladder Diagram</div>
          {/* Rail labels */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"0 2px",marginBottom:4}}>
            <span style={{fontSize:10,fontWeight:700,color:INK}}>24V</span>
            <span style={{fontSize:10,fontWeight:700,color:INK}}>0V</span>
          </div>
          <div style={{borderLeft:"3px solid #334155",borderRight:"3px solid #334155",padding:"4px 0"}}>
            {simDef.rungs.map((rung, i) => {
              const pw = getRungPowered(rung);
              return (
                <div key={rung.id} style={{borderBottom:i<simDef.rungs.length-1?"1px dashed #f1f5f9":"none",padding:"4px 0"}}>
                  <RungSVG
                    rung={rung}
                    inputState={inputState}
                    coils={coils}
                    coilDefs={simDef.coils}
                    onToggle={handleToggle}
                    powered={pw}
                  />
                </div>
              );
            })}
          </div>
          <div style={{marginTop:10,fontSize:10,color:"#94a3b8"}}>
            🟡 = energized / powered &nbsp;|&nbsp; ● dot below contact = currently conducting
          </div>
        </div>

        {/* Controls + Output panel */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {/* Inputs */}
          <div style={{background:"rgba(255,255,255,0.9)",border:"1px solid #dbe7f5",borderRadius:14,padding:14,boxShadow:"0 10px 22px rgba(77,96,131,0.08)"}}>
            <div style={{fontSize:9,letterSpacing:4,color:"#94a3b8",textTransform:"uppercase",marginBottom:10}}>Inputs / Switches</div>
            {Object.entries(simDef.inputs).map(([id, def]) => {
              const active = inputState[id];
              const bg = getInputColor(id, def);
              const isPB = def.type === "pb_no";
              return (
                <div key={id} style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:"#475569",marginBottom:4}}>{def.label}</div>
                  <button
                    onClick={!isPB ? ()=>handleToggle(id, def.type) : undefined}
                    onMouseDown={isPB ? ()=>{ heldRef.current=id; setInputState(p=>({...p,[id]:true})); } : undefined}
                    onTouchStart={isPB ? (e)=>{ e.preventDefault(); heldRef.current=id; setInputState(p=>({...p,[id]:true})); } : undefined}
                    style={{
                      width:"100%",
                      padding:"8px 10px",
                      background: bg,
                      border:"2px solid "+(active?"#334155":"#dbe7f5"),
                      borderRadius:10,
                      cursor:"pointer",
                      fontSize:10,
                      fontFamily:"'IBM Plex Mono','Courier New',monospace",
                      fontWeight:700,
                      color: active&&bg!=="#e2e8f0" ? "#fff" : "#475569",
                      letterSpacing:1,
                      transition:"all 0.08s",
                    }}
                  >
                    {isPB ? "HOLD TO ACTIVATE" : getInputLabel(id, def)}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Outputs */}
          <div style={{background:"rgba(255,255,255,0.9)",border:"1px solid #dbe7f5",borderRadius:14,padding:14,boxShadow:"0 10px 22px rgba(77,96,131,0.08)"}}>
            <div style={{fontSize:9,letterSpacing:4,color:"#94a3b8",textTransform:"uppercase",marginBottom:10}}>Outputs</div>
            {Object.entries(simDef.coils).map(([id, def]) => {
              const on = coils[id];
              const lightColor = def.color || POWERED;
              return (
                <div key={id} style={{
                  display:"flex",alignItems:"center",gap:10,
                  marginBottom:8,padding:"8px 10px",
                  background: on ? (def.type==="light"?lightColor+"22":POWERED+"18") : "#f8fafc",
                  border:"1px solid "+(on?( def.type==="light"?lightColor:POWERED):"#e2e8f0"),
                  borderRadius:7,transition:"all 0.1s",
                }}>
                  <div style={{
                    width:12,height:12,borderRadius:"50%",flexShrink:0,
                    background: on ? (def.type==="light"?lightColor:POWERED) : "#e2e8f0",
                    boxShadow: on ? `0 0 8px ${def.type==="light"?lightColor:POWERED}` : "none",
                    transition:"all 0.1s",
                  }}/>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:on?INK:"#94a3b8"}}>{def.label}</div>
                    <div style={{fontSize:9,color:on?"#475569":"#cbd5e1"}}>
                      {def.type==="relay"?"RELAY":def.type==="sol"?"SOLENOID":def.type==="motor"?"MOTOR":"LIGHT"}
                      {" — "}{on?"ENERGIZED":"DE-ENERGIZED"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
