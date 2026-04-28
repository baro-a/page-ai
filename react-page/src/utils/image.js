export async function compressDataUrl(dataUrl, maxBytes = 300000, initialQuality = 0.9){
  // dataUrl -> Blob size 검사 후 canvas로 재조정
  function dataUrlToImage(src){
    return new Promise((res, rej)=>{
      const img = new Image();
      img.onload = ()=>res(img);
      img.onerror = rej;
      img.src = src;
    });
  }

  function dataUrlSize(url){
    // approximate bytes from base64
    const base64 = url.split(',')[1] || '';
    return Math.round((base64.length * 3) / 4);
  }

  const img = await dataUrlToImage(dataUrl);
  let quality = initialQuality;
  let width = img.width; let height = img.height;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // downscale loop and quality loop
  for(let attempt=0; attempt<8; attempt++){
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let out = canvas.toDataURL('image/jpeg', quality);
    const size = dataUrlSize(out);
    if(size <= maxBytes || (width<=200 && quality<=0.3)) return out;
    // reduce quality first, then size
    if(quality > 0.4) quality = Math.max(0.3, quality - 0.15);
    else { width = Math.round(width * 0.85); height = Math.round(height * 0.85); }
  }
  // final attempt
  return canvas.toDataURL('image/jpeg', 0.35);
}
