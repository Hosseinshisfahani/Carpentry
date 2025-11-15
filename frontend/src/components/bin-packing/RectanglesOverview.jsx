// =============================================
// RectanglesOverview.jsx — Enhanced v2
// - Responsive SVG (ResizeObserver)
// - Auto layout all input rectangles (distinct from main diagram)
// - Group badges (unique sizes + counts)
// - Hover/tooltip with size and packed/unpacked status
// =============================================
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';

function useMeasure() {
  const ref = useRef(null);
  const [w, setW] = useState(720);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      setW(entries[0].contentRect.width);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

const PACKED_COLOR = '#d9edf7';
const UNPACKED_COLOR = '#e0e0e0';
const STROKE = 'rgba(0,0,0,.7)';

const crisp = (n) => Math.round(n) + 0.5; // align 1px strokes
const yTop = (yBottom, h, binH, scale) => (binH - (yBottom + h)) * scale;
const yCenter = (yBottom, h, binH, scale) => (binH - (yBottom + h / 2)) * scale;

const RectanglesOverview = ({ visualizationData, zoom = 1.4 }) => {
  const { all_input_rects = [], unpacked_rects = [] } = visualizationData;
  const [wrapRef, wrapWidth] = useMeasure();

  // group by size (normalize orientation)
  const groups = useMemo(() => {
    const map = new Map();
    all_input_rects.forEach((r) => {
      const a = Math.min(r.width, r.height);
      const b = Math.max(r.width, r.height);
      const key = `${a}×${b}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([k, count]) => ({ key: k, count }));
  }, [all_input_rects]);

  // flags packed/unpacked
  const isUnpacked = (rect) => unpacked_rects.some(u =>
    (u.width === rect.width && u.height === rect.height) ||
    (u.width === rect.height && u.height === rect.width)
  );

  // auto layout metrics (no bin) so this view differs from main
  const padding = 16;
  const svgWidth = Math.max(640, wrapWidth);
  const available = svgWidth - padding * 2;
  const spacing = 8;
  const targetRowHeight = 100;
  const maxH = Math.max(1, ...all_input_rects.map(r => r.height));
  const baseScale = targetRowHeight / maxH;

  const layoutRects = [];
  let x = padding, y = padding, tallest = 0;
  all_input_rects.forEach((r, i) => {
    const w = Math.max(10, r.width * baseScale);
    const h = Math.max(10, r.height * baseScale);
    if (x + w > padding + available) { x = padding; y += tallest + spacing; tallest = 0; }
    layoutRects.push({ x, y, w, h, rect: r, unpacked: unpacked_rects.some(u => (u.width === r.width && u.height === r.height) || (u.width === r.height && u.height === r.width)) });
    tallest = Math.max(tallest, h);
    x += w + spacing;
  });
  const svgHeight = y + tallest + padding + 28; // legend space

  // tooltip
  const [hover, setHover] = useState(null);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle2">نمای کلی قطعات</Typography>
        <Stack direction="row" spacing={1}>
          {groups.map(g => <Chip key={g.key} size="small" label={`${g.key} × ${g.count}`} />)}
        </Stack>
      </Stack>

      <Box ref={wrapRef} sx={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', backgroundColor: '#fff' }}>
        <svg 
          width="100%" 
          height={svgHeight * zoom} 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          style={{ display: 'block', maxWidth: '100%' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* auto-laid rectangles (overview) */}
          {layoutRects.map((it, idx) => (
            <g key={idx}
               onMouseEnter={(e) => setHover({ clientX: e.clientX, clientY: e.clientY, r: it.rect, unpacked: it.unpacked, idx })}
               onMouseMove={(e) => setHover((prev) => prev ? { ...prev, clientX: e.clientX, clientY: e.clientY } : null)}
               onMouseLeave={() => setHover(null)}
            >
              <rect x={crisp(it.x)} y={crisp(it.y)} width={Math.max(0, it.w - 1)} height={Math.max(0, it.h - 1)}
                    fill={it.unpacked ? UNPACKED_COLOR : PACKED_COLOR}
                    stroke={STROKE} strokeWidth="1" shapeRendering="crispEdges" />
              <text x={it.x + it.w / 2} y={it.y + it.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#263238">
                {`${it.rect.width}×${it.rect.height}`}
              </text>
            </g>
          ))}

          {/* legend */}
          <g>
            <rect x={padding} y={svgHeight - 24} width={12} height={12} fill={PACKED_COLOR} stroke={STROKE} strokeWidth="0.5" />
            <text x={padding + 16} y={svgHeight - 14} fontSize="10" fill="#000">چیده شده</text>
            <rect x={padding + 90} y={svgHeight - 24} width={12} height={12} fill={UNPACKED_COLOR} stroke={STROKE} strokeWidth="0.5" />
            <text x={padding + 106} y={svgHeight - 14} fontSize="10" fill="#000">چیده نشده</text>
          </g>
        </svg>
      </Box>

      {hover && (
        <Box sx={{ position: 'fixed', left: hover.clientX + 12, top: hover.clientY + 12, zIndex: 10, pointerEvents: 'none', bgcolor: '#212121', color: '#fff', px: 1, py: 0.5, borderRadius: 1, fontSize: 12, boxShadow: 2 }}>
          #{hover.idx + 1} — {hover.r.width}×{hover.r.height} {hover.unpacked ? '• چیده نشده' : '• چیده شده'}
        </Box>
      )}
    </Box>
  );
};

export default RectanglesOverview;