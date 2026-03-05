import { useState, useEffect, useCallback } from "react";

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

function RungSVG({ rung, inputState, coils, coilDefs, onToggle, powered }) {
  const H = 54, PAD = 18;
  // Build flat list of elements with x positions
  const items = flattenRung(rung.series);
  const totalW = items.length * 56 + 80;
  const W = Math.max(totalW, 320);
  const midY = H / 2 + 8;

  const wire = powered ? POWERED : DEAD;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",overflow:"visible"}}>
      {/* Left rail */}
      <line x1={PAD} y1={4} x2={PAD} y2={H-4} stroke={wire} strokeWidth="3"/>
      {/* Main wire */}
      <line x1={PAD} y1={midY} x2={W-PAD-32} y2={midY} stroke={wire} strokeWidth="2"/>
      {/* Elements */}
      {items.map((item, i) => {
        const x = PAD + 16 + i * 56;
        return (
          <ElementSVG key={i} el={item} x={x} y={midY} inputState={inputState}
            coils={coils} powered={powered} onToggle={onToggle}/>
        );
      })}
      {/* Output coils */}
      {rung.outputs.map((outId, i) => {
        const def = coilDefs[outId] || {label:outId, type:"relay"};
        const cx = W - PAD - 28;
        const cy = midY + i * 22;
        return (
          <CoilSVG key={outId} x={cx} y={cy} def={def} energized={coils[outId]}/>
        );
      })}
    </svg>
  );
}

function flattenRung(series) {
  const out = [];
  for (const el of series) {
    if (el.type === "PARALLEL") {
      // For display, show the parallel branches flattened with a "/" separator
      for (let bi = 0; bi < el.branches.length; bi++) {
        for (const sub of el.branches[bi]) out.push({...sub, _parallel:true, _branchIdx:bi, _parentParallel:el});
        if (bi < el.branches.length - 1) out.push({type:"_PAR_SEP"});
      }
    } else {
      out.push(el);
    }
  }
  return out;
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

  // Early return AFTER all hooks
  if (!simDef) {
    return (
      <div style={{background:"#fff",borderRadius:10,padding:28,textAlign:"center",border:"1px solid #e2e8f0"}}>
        <div style={{fontSize:13,color:"#64748b",marginBottom:12}}>Simulator not available for this circuit yet.</div>
        <div style={{fontSize:11,color:"#94a3b8",marginBottom:16}}>Available for: Start/Stop, Two Lights, Single-Acting Cylinder, Jogging, Forward/Reverse, Double-Acting Cylinder.</div>
        <button onClick={onClose} style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:7,padding:"8px 20px",cursor:"pointer",fontSize:12,fontFamily:"'Courier New',monospace",color:"#64748b"}}>← BACK</button>
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
    <div style={{display:"flex",flexDirection:"column",gap:12,fontFamily:"'Courier New',monospace"}}>
      {/* Header */}
      <div style={{background:"#1e293b",borderRadius:9,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:9,letterSpacing:4,color:"#475569",textTransform:"uppercase",marginBottom:2}}>Circuit Simulator</div>
          <div style={{fontSize:14,fontWeight:700,color:"#f8fafc"}}>{circuit.name}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={handleReset} style={{background:"none",border:"1px solid #334155",borderRadius:5,color:"#64748b",cursor:"pointer",fontSize:10,padding:"5px 10px",letterSpacing:1}}>↺ RESET</button>
          <button onClick={onClose} style={{background:"none",border:"1px solid #334155",borderRadius:5,color:"#64748b",cursor:"pointer",fontSize:10,padding:"5px 10px",letterSpacing:1}}>← BACK</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:12}}>
        {/* Ladder diagram */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:16}}>
          <div style={{fontSize:9,letterSpacing:4,color:"#94a3b8",textTransform:"uppercase",marginBottom:12}}>Live Ladder Diagram</div>
          {/* Rail labels */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"0 2px",marginBottom:4}}>
            <span style={{fontSize:10,fontWeight:700,color:INK}}>24V</span>
            <span style={{fontSize:10,fontWeight:700,color:INK}}>0V</span>
          </div>
          <div style={{borderLeft:"3px solid #1e293b",borderRight:"3px solid #1e293b",padding:"4px 0"}}>
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
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:14}}>
            <div style={{fontSize:9,letterSpacing:4,color:"#94a3b8",textTransform:"uppercase",marginBottom:10}}>Inputs / Switches</div>
            {Object.entries(simDef.inputs).map(([id, def]) => {
              const active = inputState[id];
              const bg = getInputColor(id, def);
              const isPB = def.type === "pb_no";
              return (
                <div key={id} style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:"#475569",marginBottom:4}}>{def.label}</div>
                  <button
                    onClick={()=>handleToggle(id, def.type)}
                    onMouseDown={isPB ? ()=>setInputState(p=>({...p,[id]:true})) : undefined}
                    onMouseUp={isPB ? ()=>setInputState(p=>({...p,[id]:false})) : undefined}
                    onMouseLeave={isPB ? ()=>setInputState(p=>({...p,[id]:false})) : undefined}
                    style={{
                      width:"100%",
                      padding:"8px 10px",
                      background: bg,
                      border:"2px solid "+(active?"#1e293b":"#e2e8f0"),
                      borderRadius:7,
                      cursor:"pointer",
                      fontSize:10,
                      fontFamily:"'Courier New',monospace",
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
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:14}}>
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
