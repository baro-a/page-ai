const KEY = 'page-essays-v1'

export function loadEssays(){
  try{
    const raw = localStorage.getItem(KEY) || '[]';
    return JSON.parse(raw);
  }catch(e){ return [] }
}

export function saveEssay(item){
  const arr = loadEssays();
  const idx = arr.findIndex(x=>x.id===item.id);
  if(idx>=0) arr[idx] = item; else arr.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function updateEssay(id, patch){
  const arr = loadEssays();
  const idx = arr.findIndex(x=>x.id===id);
  if(idx<0) return null;
  arr[idx] = {...arr[idx], ...patch};
  localStorage.setItem(KEY, JSON.stringify(arr));
  return arr[idx];
}

export function deleteEssay(id){
  const arr = loadEssays().filter(x=>x.id!==id);
  localStorage.setItem(KEY, JSON.stringify(arr));
}
