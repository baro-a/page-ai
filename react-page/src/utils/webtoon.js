export function parseWebtoon(raw){
  // raw: JSON string or array of panels
  if(!raw) return [];
  let obj = raw;
  if(typeof raw === 'string'){
    try{ obj = JSON.parse(raw); }catch(e){
      // try to extract JSON substring
      const m = raw.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if(m) obj = JSON.parse(m[0]); else throw e;
    }
  }
  if(!Array.isArray(obj)) throw new Error('웹툰 데이터는 배열이어야 합니다');
  // normalize panels: {image, text}
  const panels = obj.map((p, idx)=>{
    if(typeof p === 'string') return { image: p, text: '' };
    return { image: p.image || p.img || p.src || '', text: p.text || p.caption || p.title || '' };
  }).filter(p=>p.image || p.text);
  return panels;
}
