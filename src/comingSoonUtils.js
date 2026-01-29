// Utility functions for ComingSoon component

export function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function hash01(n) {
  const s = Math.sin(n * 999.123 + 0.12345) * 43758.5453;
  return s - Math.floor(s);
}

export function projectY(x, y, z, rotY, persp) {
  const c = Math.cos(rotY);
  const s = Math.sin(rotY);
  const xr = x * c + z * s;
  const zr = -x * s + z * c;
  const k = persp / (persp + zr);
  return { x: xr * k, y: y * k, k, zr };
}

export function buildPointCloudFromLogoVector({
  w,
  h,
  density,
  threshold = 40,
  step = 1,
}) {
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ctx = off.getContext("2d");
  if (!ctx) return [];

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);

  const s = Math.min(w, h) * 0.1;
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(s, s);

  ctx.strokeStyle = "white";
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  ctx.lineWidth = 0.235;
  ctx.rotate(-0.28);

  // Logo strokes
  ctx.beginPath();
  ctx.arc(-0.14, 0.14, 1.06, 2.52, 4.2, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0.3, 0.1, 1.06, 5.72, 7.45, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-1.1, 0.58);
  ctx.lineTo(-0.26, 0.64);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-0.4, 0.74);
  ctx.quadraticCurveTo(0.08, 0.22, 0.94, -0.34);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-0.22, 0.9);
  ctx.lineTo(-0.15, 1.15);
  ctx.stroke();

  ctx.restore();

  const img = ctx.getImageData(0, 0, w, h).data;
  const pts = [];

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      const r = img[i];
      if (r > threshold) pts.push([x, y]);
    }
  }

  const target = Math.max(240, density);
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(hash01(i) * (i + 1));
    const tmp = pts[i];
    pts[i] = pts[j];
    pts[j] = tmp;
  }

  const out = pts.slice(0, Math.min(target, pts.length));

  // Center to canvas
  for (let i = 0; i < out.length; i++) {
    out[i][0] -= w / 2;
    out[i][1] -= h / 2;
  }

  // Hard-center by bbox
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (let i = 0; i < out.length; i++) {
    const x = out[i][0];
    const y = out[i][1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  for (let i = 0; i < out.length; i++) {
    out[i][0] -= cx;
    out[i][1] -= cy;
  }

  return out;
}
