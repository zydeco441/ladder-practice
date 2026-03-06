# Symbol Workfile

Use this file to define your exact symbol geometry.
When you are ready, tell me: use SYMBOL_WORKFILE and I will paste your versions into src/App.jsx.

Rules:
- Keep function names exactly the same.
- Keep parameter names the same.
- You can change coordinates, arcs, lines, and labels.
- Start with the default code below and tweak it.

## 1) Diagram Symbols (used in reference diagrams)

### NO
```jsx
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
```

### NC
```jsx
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
```

### Coil
```jsx
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
```

### SolCoil
```jsx
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
```

### Light
```jsx
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
```

### LS
```jsx
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
```

### TimerCoil
```jsx
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
```

### EStop
```jsx
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
```

## 2) Optional: Symbol picker icon and canvas stamp symbols

If you also want the Symbols tray and click-to-place symbols to match your new style,
add your edits for `SymbolIcon(...)` and `drawSymbol(...)` here too.

You can paste full replacement blocks below:

```jsx
// SymbolIcon replacement
function SymbolIcon({ symbol }) {
  // your version
}
```

```js
// drawSymbol replacement (inside Canvas)
const drawSymbol = (ctx, symbolName, x, y) => {
  // your version
};
```
