import React from 'react'

export default function PageEssay(){
  return (
    <section className="space-y-6">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold">새 React 페이지: PageEssay</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">이 페이지는 기존 `index_v4.html`를 대체하지 않고 병행 개발할 수 있도록 만들어졌습니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded">
          <h3 className="font-medium">빠른 액세스</h3>
          <button className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded" onClick={()=>window.open('index_v4.html','_blank')}>원본 index_v4.html 열기</button>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded">
          <h3 className="font-medium">컴포넌트 개발</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">여기에 기존 기능(히어로, 에세이 작성 등)을 React 컴포넌트로 하나씩 옮겨가면 됩니다.</p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded">
        <h3 className="font-medium">다음 단계</h3>
        <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300">
          <li>필요한 기능(서재/작성/카메라 등)을 컴포넌트로 분리</li>
          <li>로컬스토리지 인터페이스를 공유 유틸로 추출</li>
          <li>AI 호출 로직은 환경변수 또는 .env로 관리</li>
        </ol>
      </div>
    </section>
  )
}
