export function buildPrompt({title, context, meta}){
  const lines = []
  lines.push(`제목: ${title || '무제'}`)
  if(meta && meta.emotion) lines.push(`감정: ${meta.emotion}`)
  if(meta && meta.format) lines.push(`형식: ${meta.format}`)
  if(context) lines.push('\n상황/문맥:\n' + context)

  lines.push('\n요청: 위 내용을 바탕으로 감성적인 한국어 에세이 형식으로 3-5문단을 작성해줘. 짧은 도입, 핵심, 마무리로 구성하고 자연스러운 흐름을 유지해줘.')
  return lines.join('\n')
}
