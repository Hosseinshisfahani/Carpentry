// MainPackingDiagram.jsx
import React, { useMemo, useRef, useState, useLayoutEffect, useCallback } from "react";

/** Utility: clamp */
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/** Choose a nice grid step for the current scale so lines neither crowd nor vanish */
function niceStep(scale) {
  // World units per 100 screen px target
  const targetWorldPer100px = 50; // aim ~50 world units per 100px
  const worldPerPx = 1 / scale;
  const raw = targetWorldPer100px * worldPerPx;
  const base = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
  for (let i = 0; i < base.length; i++) {
    if (raw <= base[i]) return base[i];
  }
  return 1000;
}

/** Align a 1px stroke to device pixels for crispness */
function crisp(n, scale = 1) {
  // Place strokes on half-pixels in screen space
  return Math.round(n * scale) / scale + 0.5 / scale;
}

/** Convert bottom-left world (x,y) to SVG (x, yTopLeft) */
function worldToSvgY(y, binH) {
  return binH - y;
}

/** Helper functions for coordinate transformation */
const yTop = (yBottom, h, binH, scale) => (binH - (yBottom + h)) * scale;
const yCenter = (yBottom, h, binH, scale) => (binH - (yBottom + h / 2)) * scale;
const yLine = (yWorld, binH, scale) => (binH - yWorld) * scale;

export default function MainPackingDiagram({
  bin = { width: 500, height: 250 },
  rects = [],
  initialScale = 1,
  rtl = true,
  showExport = true,
  className = "",
}) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);

  // viewport size (CSS pixels)
  const [vp, setVp] = useState({ w: 600, h: 400 });
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setVp({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // pan & zoom state (in WORLD units for pan; scale is screen/world)
  const [scale, setScale] = useState(initialScale);
  const [pan, setPan] = useState({ x: 0, y: 0 }); // world units of bottom-left corner of viewport

  // Fit bin initially
  useLayoutEffect(() => {
    const margin = 24; // screen px
    const sx = (vp.w - margin * 2) / bin.width;
    const sy = (vp.h - margin * 2) / bin.height;
    const s = Math.max(0.1, Math.min(sx, sy));
    setScale(s);
    // center
    const worldW = vp.w / s;
    const worldH = vp.h / s;
    const x = (bin.width - worldW) / 2;
    const y = (bin.height - worldH) / 2;
    setPan({ x: clamp(x, -bin.width, bin.width), y: clamp(y, -bin.height, bin.height) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vp.w, vp.h, bin.width, bin.height]);

  // Wheel zoom (cursor-centered) - use direct event listener to avoid passive listener issues
  const wheelHandler = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY;
      const factor = Math.exp(-delta * 0.0015); // smooth
      const newScale = clamp(scale * factor, 0.1, 10);

      // Convert mouse position to world coords before and after; adjust pan to keep cursor fixed
      const bbox = svgRef.current.getBoundingClientRect();
      const mx = e.clientX - bbox.left;
      const my = e.clientY - bbox.top;

      const worldXBefore = pan.x + mx / scale;
      const worldYBefore = pan.y + (vp.h - my) / scale;

      const worldXAfter = pan.x + mx / newScale;
      const worldYAfter = pan.y + (vp.h - my) / newScale;

      const panX = pan.x + (worldXBefore - worldXAfter);
      const panY = pan.y + (worldYBefore - worldYAfter);

      setScale(newScale);
      setPan({ x: panX, y: panY });
    },
    [scale, pan, vp.h]
  );

  // Attach wheel event listener directly to avoid passive listener issues
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.addEventListener('wheel', wheelHandler, { passive: false });
    return () => svg.removeEventListener('wheel', wheelHandler);
  }, [wheelHandler]);

  // Drag pan
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const onPointerDown = (e) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x - dx / scale, y: p.y + dy / scale })); // dy inverted (bottom-left world)
  };
  const onPointerUp = (e) => {
    dragging.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };

  // Clamp pan so bin never fully disappears (allow some overscroll)
  useLayoutEffect(() => {
    const worldW = vp.w / scale;
    const worldH = vp.h / scale;
    const margin = 0.2 * Math.max(bin.width, bin.height); // allow some slack
    const minX = -margin;
    const maxX = bin.width - worldW + margin;
    const minY = -margin;
    const maxY = bin.height - worldH + margin;
    setPan((p) => ({
      x: clamp(p.x, minX, maxX),
      y: clamp(p.y, minY, maxY),
    }));
  }, [scale, vp.w, vp.h, bin.width, bin.height]);

  // Grid steps
  const step = useMemo(() => niceStep(scale), [scale]);
  const major = step * 5;

  // Screen transform helpers
  const worldToScreenX = (x) => (x - pan.x) * scale;
  const worldToScreenY = (y) => (vp.h - (y - pan.y) * scale);

  // Export SVG
  const exportSVG = () => {
    const node = svgRef.current.cloneNode(true);
    // Inline width/height so viewers know the size
    node.setAttribute("width", `${vp.w}`);
    node.setAttribute("height", `${vp.h}`);
    const blob = new Blob([node.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "packing.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export PNG
  const exportPNG = () => {
    const svg = svgRef.current.cloneNode(true);
    svg.setAttribute("width", `${vp.w}`);
    svg.setAttribute("height", `${vp.h}`);
    const svgBlob = new Blob([svg.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = vp.w * window.devicePixelRatio;
      canvas.height = vp.h * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.drawImage(img, 0, 0, vp.w, vp.h);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = "packing.png";
        a.click();
      });
    };
    img.src = url;
  };

  const labelAnchor = rtl ? "end" : "start";

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ width: "100%", height: "100%", position: "relative", background: "var(--mui-palette-background-default,#fff8f0)" }}
    >
      {showExport && (
        <div style={{ position: "absolute", top: 8, [rtl ? "left" : "right"]: 8, display: "flex", gap: 8, zIndex: 2 }}>
          <button onClick={exportSVG}>Export SVG</button>
          <button onClick={exportPNG}>Export PNG</button>
        </div>
      )}

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${vp.w} ${vp.h}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ touchAction: "none", display: "block" }}
      >
        {/* background */}
        <rect x="0" y="0" width={vp.w} height={vp.h} fill="transparent" />

        {/* GRID (compute visible world bounds) */}
        {(() => {
          const worldLeft = pan.x;
          const worldRight = pan.x + vp.w / scale;
          const worldBottom = pan.y;
          const worldTop = pan.y + vp.h / scale;

          const xStart = Math.floor(worldLeft / step) * step;
          const yStart = Math.floor(worldBottom / step) * step;

          const lines = [];

          for (let x = xStart; x <= worldRight; x += step) {
            const sx = crisp(worldToScreenX(x), 1);
            const isMajor = Math.abs(Math.round(x / major) - x / major) < 1e-6;
            lines.push(
              <line
                key={`vx-${x}`}
                x1={sx}
                y1={0}
                x2={sx}
                y2={vp.h}
                stroke={isMajor ? "rgba(0,0,0,.18)" : "rgba(0,0,0,.08)"}
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
            );
          }
          for (let y = yStart; y <= worldTop; y += step) {
            const sy = crisp(yLine(y, bin.height, scale), 1); // Use explicit helper
            const isMajor = Math.abs(Math.round(y / major) - y / major) < 1e-6;
            lines.push(
              <line
                key={`hz-${y}`}
                x1={0}
                y1={sy}
                x2={vp.w}
                y2={sy}
                stroke={isMajor ? "rgba(0,0,0,.18)" : "rgba(0,0,0,.08)"}
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
            );
          }
          return <g>{lines}</g>;
        })()}

        {/* BIN OUTLINE */}
        {(() => {
          const x0 = worldToScreenX(0);
          const y0 = yLine(0, bin.height, scale); // Use explicit helper
          const x1 = worldToScreenX(bin.width);
          const y1 = yLine(bin.height, bin.height, scale); // Use explicit helper
          const w = x1 - x0;
          const h = y0 - y1;
          return (
            <rect
              x={x0 + 0.5} y={y1 + 0.5} width={w - 1} height={h - 1}
              fill="rgba(255,255,255,0.7)"
              stroke="rgba(0,0,0,.7)"
              strokeWidth={1}
              shapeRendering="crispEdges"
            />
          );
        })()}

        {/* RECTANGLES */}
        <g>
          {rects.map((r) => {
            const x = worldToScreenX(r.x);
            const rectYTop = yTop(r.y, r.h, bin.height, scale); // Use explicit helper
            const w = r.w * scale;
            const h = r.h * scale;
            const labelYCenter = yCenter(r.y, r.h, bin.height, scale); // Use explicit helper

            return (
              <g key={r.id}>
                <rect
                  x={crisp(x)} y={crisp(rectYTop)}
                  width={Math.max(0, w - 1)} height={Math.max(0, h - 1)}
                  fill="rgba(100,150,220,.35)"
                  stroke="rgba(0,0,0,.7)"
                  strokeWidth={1}
                  shapeRendering="crispEdges"
                />
                {/* label with backdrop */}
                <g transform={`translate(${x + w / 2}, ${labelYCenter})`}>
                  <rect x={-36} y={-12} width={72} height={24} rx={4} ry={4} fill="rgba(255,255,255,.85)"/>
                  <text
                    x={0}
                    y={5}
                    fontSize={12}
                    textAnchor="middle"
                    style={{ fontFamily: "ui-sans-serif, system-ui" }}
                    fill="black"
                  >
                    {r.id} • {r.w}×{r.h}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* AXES TICKS (major only, with labels) */}
        {(() => {
          const labels = [];
          for (let x = 0; x <= bin.width; x += major) {
            const sx = worldToScreenX(x);
            labels.push(
              <g key={`tx-${x}`}>
                <line x1={crisp(sx)} y1={crisp(vp.h - 16)} x2={crisp(sx)} y2={crisp(vp.h)} stroke="rgba(0,0,0,.6)" />
                <text x={sx + (rtl ? -4 : 4)} y={vp.h - 20} fontSize={11} textAnchor={labelAnchor} fill="rgba(0,0,0,.8)">
                  {x}
                </text>
              </g>
            );
          }
          for (let y = 0; y <= bin.height; y += major) {
            const sy = yLine(y, bin.height, scale); // Use explicit helper
            labels.push(
              <g key={`ty-${y}`}>
                <line x1={crisp(0)} y1={crisp(sy)} x2={crisp(16)} y2={crisp(sy)} stroke="rgba(0,0,0,.6)" />
                <text x={rtl ? vp.w - 4 : 20} y={sy - 4} fontSize={11} textAnchor={rtl ? "end" : "start"} fill="rgba(0,0,0,.8)">
                  {y}
                </text>
              </g>
            );
          }
          return <g>{labels}</g>;
        })()}
      </svg>
    </div>
  );
}