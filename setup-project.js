#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 사용자로부터 프로젝트 이름 입력 받기
rl.question('프로젝트 이름을 입력하세요(실행 중인 폴더에 설치 시 . 입력): ', (projectName) => {
  console.log(`\n${projectName} 프로젝트 설정을 시작합니다...`);
  
  try {
    // 1. Vite 프로젝트 생성
    console.log('\n1. Vite React 프로젝트 생성 중...');
    execSync(`npm create vite@latest ${projectName} -- --template react`, { stdio: 'inherit' });
    
    // 프로젝트 디렉토리로 이동
    process.chdir(projectName);
    
    // 2. 필요한 라이브러리 설치
    console.log('\n2. 라이브러리 설치 중...');
    execSync('npm install tailwindcss @tailwindcss/vite zustand @tanstack/react-query', { stdio: 'inherit' });
    
    // 3. Vite 설정 파일 수정
    console.log('\n3. Vite 설정 파일 수정 중...');
    const viteConfigPath = path.join(process.cwd(), 'vite.config.js');
    const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
`;
    fs.writeFileSync(viteConfigPath, viteConfigContent);
    
    // 4. CSS 파일에 Tailwind 임포트 추가
    const cssPath = path.join(process.cwd(), 'src/index.css');
    const cssContent = `@import "tailwindcss";

/* 전역 스타일을 이곳에 추가하세요 */
`;
    fs.writeFileSync(cssPath, cssContent);
    
    // 5. FSD 아키텍처 폴더 구조 생성
    console.log('\n4. FSD 아키텍처 폴더 구조 생성 중...');
    const directories = [
      'src/app',
      'src/processes',
      'src/pages',
      'src/widgets',
      'src/features',
      'src/entities',
      'src/shared/api',
      'src/shared/config',
      'src/shared/lib',
      'src/shared/ui',
    ];
    
    directories.forEach(dir => {
      fs.mkdirSync(dir, { recursive: true });
      // 각 폴더에 index.js 파일 생성
      fs.writeFileSync(path.join(dir, 'index.js'), '// 컴포넌트 export용 파일입니다.');
    });
    
    // 6. App.jsx 파일을 app 폴더로 이동 및 수정
    const appContent = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            FSD 아키텍처 프로젝트
          </h1>
          <p className="text-gray-600">
            Feature-Sliced Design 아키텍처를 사용한 프로젝트가 준비되었습니다.
          </p>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
`;
    fs.writeFileSync(path.join(process.cwd(), 'src/app/App.jsx'), appContent);
    
    // 7. main.jsx 수정
    const mainPath = path.join(process.cwd(), 'src/main.jsx');
    const mainContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
    fs.writeFileSync(mainPath, mainContent);
    
    // 8. README 업데이트
    const readmePath = path.join(process.cwd(), 'README.md');
    const readmeContent = `# ${projectName}

## 기술 스택
- React
- Vite
- Tailwind CSS v4 (Vite 플러그인 방식)
- Zustand (상태 관리)
- React Query (서버 상태 관리)

## 폴더 구조 (FSD 아키텍처)
- app/ - 애플리케이션 초기화, 전역 스타일 등
- processes/ - 비즈니스 프로세스와 workflows
- pages/ - 라우트에 해당하는 페이지 컴포넌트
- widgets/ - 페이지를 구성하는 독립적인 블록
- features/ - 사용자 상호작용을 다루는 기능
- entities/ - 비즈니스 엔티티(사용자, 상품 등)
- shared/ - 재사용 가능한 기능과 UI 컴포넌트

## 시작하기
\`\`\`
npm install
npm run dev
\`\`\`
`;
    fs.writeFileSync(readmePath, readmeContent);
    
    console.log('\n✅ 프로젝트 설정이 완료되었습니다!');
    console.log(`\n프로젝트 실행 방법:
cd ${projectName}
npm run dev`);
    
    rl.close();
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    rl.close();
  }
}); 