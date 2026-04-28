import React, { useState } from 'react';
import { ArrowRight, BookOpen, Zap } from 'lucide-react';

// --- 1. 컴포넌트 정의 ---

// 1.1. Hero Section
const HeroSection = () => (
  <section className="py-24 md:py-36 border-b border-gray-800/50">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
          Ideas. Crafted.</span>
        <br />
        <span className="text-gray-200">
          Experiences.
        </span>
      </h1>
      <p className="max-w-3xl mx-auto text-xl text-gray-400 mb-10 md:mb-16">
        우리는 단순한 디자인을 넘어, 사용자의 감성과 비즈니스의 목표를 연결하는 깊이 있는 경험을 설계합니다.
      </p>
      <div className="flex justify-center gap-4">
        <button className="flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition duration-300 shadow-lg shadow-indigo-500/30 transform hover:scale-[1.02]">
          프로젝트 보기
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
        <button className="flex items-center px-8 py-3 text-lg font-semibold rounded-full border border-gray-600 hover:bg-gray-800 text-gray-300 transition duration-300">
          문의하기
        </button>
      </div>
    </div>
  </section>
);

// 1.2. Core Values Section (서비스/핵심 가치)
const CoreValuesSection = () => {
  const values = [
    { icon: Zap, title: "전략적 사고", description: "단순한 미학을 넘어, 비즈니스 목표 달성을 위한 명확한 로드맵을 제시합니다." },
    { icon: BookOpen, title: "사용자 중심 설계", description: "사용자의 행동 패턴과 심리를 깊이 이해하여 직관적인 인터페이스를 구축합니다." },
    { icon: Zap, title: "완벽한 실행력", description: "기획부터 개발, 배포까지 전 과정에서 최고 수준의 완성도를 유지합니다." },
  ];

  return (
    <section className="py-20 md:py-28 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          우리가 집중하는 가치
        </h2>
        <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
          우리의 모든 작업은 명확한 목적과 깊은 통찰력에서 시작됩니다.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="p-8 bg-gray-900/50 border border-gray-800 rounded-xl shadow-xl hover:border-indigo-500 transition duration-300 transform hover:-translate-y-1 group cursor-pointer"
            >
              <div className="p-3 inline-flex items-center justify-center rounded-full bg-indigo-600/20 group-hover:bg-indigo-600/30 transition mb-4">
                <value.icon className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
              <p className="text-gray-400 text-lg">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 1.3. Portfolio Showcase (작품 전시)
const PortfolioShowcase = () => (
  <section className="py-20 md:py-28 border-b border-gray-800/50">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        최근 작업물
      </h2>
      <p className="text-xl text-gray-400 mb-12">
        다양한 산업과 목표를 가진 클라이언트들의 성공 사례를 확인해 보세요.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Card 1 */}
        <div className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-indigo-600 transition duration-500 transform hover:scale-[1.01]">
          <div className="h-48 bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://via.placeholder.com/600x400/1e293b/ffffff?text=E-commerce+UI')" }}></div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-2">E-commerce 플랫폼 리뉴얼</h3>
            <p className="text-indigo-400 text-sm mb-3">UI/UX Design | React</p>
            <p className="text-gray-400 mb-4 line-clamp-3">사용자 여정 분석을 통해 구매 전환율을 25% 개선한 대규모 리뉴얼 프로젝트입니다.</p>
            <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center">
                자세히 보기 <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>
        </div>
        {/* Placeholder for other cards */}
        <div class="col-span-1"></div>
        <div class="col-span-1"></div>
      </div>
    </section>
  </>
);

// --------------------------------------------------------------------
// 전체 컴포넌트 구조 (실제 사용 시 React 환경에 맞게 조정 필요)
// --------------------------------------------------------------------

const PortfolioShowcase = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* 네비게이션 바 (간단 버전) */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <div className="text-2xl font-bold text-indigo-400">Studio<span className="text-white">.</span></div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            {['Work', 'Services', 'About', 'Contact'].map(item => (
              <a key={item} href="#{'#' + item.toLowerCase()}">{item}</a>
            ))}
          </nav>
          <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-300">
            문의하기
          </button>
        </div>
      </header>

      <main>
        {/* 히어로 섹션 */}
        <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            브랜딩을 넘어, 경험을 디자인합니다.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
            사용자의 감성을 자극하고 비즈니스의 성장을 견인하는 통합 디자인 솔루션을 제공합니다.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-10 py-3 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
              포트폴리오 보기
            </button>
            <button className="px-10 py-3 text-lg border border-gray-600 hover:border-indigo-500 hover:bg-gray-800 rounded-lg transition duration-300 transform hover:scale-105">
              서비스 문의
            </button>
          </div>
        </section>

        {/* 포트폴리오 섹션 */}
        <div className="py-20 bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center mb-4 text-white">최근 작업물</h2>
                <p className="text-xl text-center mb-12 text-gray-400">우리가 만들어낸 가치와 디자인의 결과물을 확인해 보세요.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 실제 포트폴리오 카드 컴포넌트 사용 권장 */}
                    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden group transform hover:scale-[1.02] transition duration-500">
                        <div className="h-64 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}></div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-2 text-indigo-300">금융 서비스 리브랜딩</h3>
                            <p className="text-gray-400 mb-4">복잡한 금융 프로세스를 직관적인 사용자 경험으로 재해석했습니다.</p>
                            <span className="text-sm text-gray-500">UI/UX Design</span>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden group transform hover:scale-[1.02] transition duration-500">
                        <div className="h-64 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071892200-1488c0202121?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}></div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-2 text-indigo-300">커머스 플랫폼 구축</h3>
                            <p className="text-gray-400 mb-4">사용자 여정 전반을 고려한 최적화된 커머스 경험을 설계했습니다.</p>
                            <span className="text-sm text-gray-500">Web Development & UX</span>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-16">
                    <button className="px-12 py-3 text-lg border-2 border-indigo-500 text-indigo-300 hover:bg-indigo-900/30 hover:border-indigo-400 transition duration-300">
                        전체 포트폴리오 보기
                    </button>
                </div>
            </div>
        </div>

        {/* 서비스 소개 섹션 */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold tracking-tight mb-4 text-white">
                    우리가 제공하는 가치
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    단순한 디자인을 넘어, 비즈니스 목표 달성을 위한 전략적 파트너십을 구축합니다.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* 서비스 카드 1 */}
                <div className="bg-gray-800 p-8 rounded-xl shadow-xl border-t-4 border-indigo-500 hover:shadow-indigo-500/20 transition duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl text-indigo-400 mb-4">💡</div>
                    <h3 className="text-2xl font-bold mb-3 text-white">브랜드 아이덴티티 구축</h3>
                    <p className="text-gray-400 mb-4">로고, 가이드라인, 톤앤매너를 정의하여 일관된 브랜드 경험을 구축합니다.</p>
                    <a href="#" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center">
                        자세히 보기 <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                </div>

                {/* 서비스 2 */}
                <div class="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
                    <div class="text-center">
                        <div class="text-5xl mb-4 text-yellow-400">💻</div>
                        <h3 class="text-2xl font-bold mb-2">UX/UI 디자인</h3>
                        <p class="text-gray-300 mb-4">사용자 여정 전반을 분석하여 직관적이고 매력적인 인터페이스를 설계합니다.</p>
                        <a href="#" class="text-yellow-400 hover:text-yellow-300 font-medium flex items-center justify-center">
                            자세히 보기 <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                    </div>
                </div>

                {/* 서비스 3 */}
                <div class="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
                    <div class="text-center">
                        <div class="text-5xl mb-4 text-green-400">🚀</div>
                        <h3 class="text-2xl font-bold mb-2">브랜드 전략</h3>
                        <p class="text-gray-300 mb-4">시장 분석을 기반으로 목표 고객에게 강력하게 어필하는 브랜드 스토리를 만듭니다.</p>
                        <a href="#" class="text-green-400 hover:text-green-300 font-medium flex items-center justify-center">
                            자세히 보기 <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                </div>
            </div>
        </div>
    </>