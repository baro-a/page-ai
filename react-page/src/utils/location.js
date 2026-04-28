export async function requestLocation(){
  if(!navigator.geolocation) throw new Error('이 브라우저는 위치 기능을 지원하지 않습니다');
  return new Promise((resolve, reject)=>{
    navigator.geolocation.getCurrentPosition(async(pos)=>{
      const { latitude:lat, longitude:lon } = pos.coords;
      // reverse geocode via Nominatim
      try{
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ko`, { headers:{ 'User-Agent':'PageAI/1.0' } });
        const data = await resp.json();
        const addr = data.address || {};
        const parts = [ addr.city || addr.town || addr.county || addr.state, addr.suburb || addr.neighbourhood || addr.road ].filter(Boolean);
        const label = parts.join(' ') || `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
        const out = { label, lat, lon, raw: data };
        // persist locally
        localStorage.setItem('user_location', label);
        localStorage.setItem('user_lat', lat);
        localStorage.setItem('user_lng', lon);
        resolve(out);
      }catch(e){
        const label = `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
        localStorage.setItem('user_location', label);
        localStorage.setItem('user_lat', lat);
        localStorage.setItem('user_lng', lon);
        resolve({ label, lat, lon, raw: null });
      }
    }, (err)=>{
      reject(new Error(err.message || '위치 가져오기 실패'));
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  });
}

export function getSavedLocation(){
  const label = localStorage.getItem('user_location') || '';
  const lat = localStorage.getItem('user_lat') || '';
  const lon = localStorage.getItem('user_lng') || '';
  return { label, lat, lon };
}
