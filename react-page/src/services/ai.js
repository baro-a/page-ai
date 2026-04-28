import { buildPrompt } from '../utils/prompt'

async function callGemma4(prompt, key){
  // Generic REST wrapper for Gemma-like services. Adjust endpoint as needed.
  const url = 'https://api.example.com/gemma4/generate';
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ prompt })
  });
  if(!resp.ok) throw new Error(`Gemma error ${resp.status}`);
  const j = await resp.json();
  // try several common shapes
  return j.output || j.text || (j.candidates && j.candidates[0] && j.candidates[0].output) || JSON.stringify(j);
}

async function callClaude(prompt, key){
  // Generic wrapper for Anthropic/Claude-style endpoints. Adjust payload to match your provider.
  const url = 'https://api.anthropic.com/v1/complete';
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'X-API-Key': key },
    body: JSON.stringify({ prompt, max_tokens: 800 })
  });
  if(!resp.ok) throw new Error(`Claude error ${resp.status}`);
  const j = await resp.json();
  return j.completion || j.output || JSON.stringify(j);
}

// generateEssay: 실제 API 키가 설정되면 외부 호출 시도, 없으면 스텁 반환
export async function generateEssay({title, context, meta}){
  const prompt = buildPrompt({title, context, meta})

  // 우선 순위: localStorage 키 -> Vite env
  const gemmaKey = localStorage.getItem('gemma_api_key') || import.meta.env.VITE_GEMMA_KEY || '';
  const claudeKey = localStorage.getItem('claude_api_key') || import.meta.env.VITE_CLAUDE_KEY || '';

  if(gemmaKey){
    try{ return await callGemma4(prompt, gemmaKey); }catch(e){ console.warn('Gemma 호출 실패:', e.message) }
  }

  if(claudeKey){
    try{ return await callClaude(prompt, claudeKey); }catch(e){ console.warn('Claude 호출 실패:', e.message) }
  }

  // 로컬 스텁 폴백
  return new Promise((res)=>{
    const sample = `이 글은 "${title||'무제'}"에 대한 자동 생성된 요약입니다.\n\n(데모 텍스트)`;
    setTimeout(()=>res(sample), 500);
  });
}
