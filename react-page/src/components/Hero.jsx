import React from 'react'

const FEATURES = [
  {title:'AI 보조 작성', desc:'프롬프트 기반으로 감성 에세이를 자동 생성합니다.'},
  {title:'이미지·오디오 포함', desc:'사진 캡처 및 녹음 기능으로 기록을 풍부하게 합니다.'},
  {title:'웹툰 모드', desc:'AI가 만든 패널을 웹툰 형식으로 미리보기합니다.'}
]

export default function Hero({onCreate}){
  return (
    <section className="p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-lg shadow">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold">Page — 감성 에세이 작성 도우미</h2>
            <p className="mt-3 text-indigo-100 max-w-xl">로컬에서 에세이를 작성하고, AI 보조 생성, 이미지·오디오 첨부, 웹툰 모드까지 지원하는 개인 기록 도구입니다.</p>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-white text-indigo-700 rounded font-semibold" onClick={()=>onCreate()}>작성 시작</button>
              <button className="px-4 py-2 bg-white text-indigo-700 rounded font-semibold" onClick={()=>onCreate && onCreate('openPortal')}>포털</button>
              <a className="px-4 py-2 border border-white rounded text-sm" href="index_v4.html" target="_blank" rel="noreferrer">원본 열기</a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FEATURES.map(f=> (
              <div key={f.title} className="p-3 bg-white bg-opacity-10 rounded">
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm mt-1 text-indigo-100">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
