export async function buildEssayCanvasDataUrl({title, body, image}){
  const w = 1200, h = 1600;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  // background
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,w,h);
  // title
  ctx.fillStyle = '#111'; ctx.font = 'bold 48px serif';
  const padding = 60; let y = padding + 48;
  wrapText(ctx, title || '무제', padding, y, w - padding*2, 52);
  // body (shortened)
  const bodyStart = 220;
  ctx.font = '20px serif'; ctx.fillStyle = '#222';
  wrapText(ctx, body || '', padding, bodyStart, w - padding*2, 32, 18);

  // draw image if provided (fit into bottom area)
  if(image){
    await new Promise((resolve)=>{
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = ()=>{
        // fit image into a box at bottom
        const maxW = w - padding*2;
        const maxH = 380;
        let iw = img.width, ih = img.height;
        const ratio = Math.min(maxW / iw, maxH / ih, 1);
        const dw = Math.round(iw * ratio);
        const dh = Math.round(ih * ratio);
        const dx = Math.round((w - dw) / 2);
        const dy = h - padding - dh;
        ctx.drawImage(img, dx, dy, dw, dh);
        resolve();
      };
      img.onerror = ()=>{ resolve(); };
      img.src = image;
      // if image is not a data URL it may fail due to CORS; try to still proceed
      // In worst case, we ignore image.
    });
  }
  return canvas.toDataURL('image/png');
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines){
  if(!text) return;
  const words = text.split(/\s+/);
  let line = '', lines = 0;
  for(let n=0;n<words.length;n++){
    const testLine = line + (line? ' ' : '') + words[n];
    const metrics = ctx.measureText(testLine);
    if(metrics.width > maxWidth && line){
      ctx.fillText(line, x, y);
      line = words[n]; y += lineHeight; lines++;
      if(maxLines && lines>=maxLines) { ctx.fillText('...', x, y); return; }
    } else { line = testLine; }
  }
  if(line) ctx.fillText(line, x, y);
}
