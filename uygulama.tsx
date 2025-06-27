import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { stackClientApp } from "./stack";

function HandlerRoutes() {
  const location = useLocation();
  
  return (
    <StackHandler app={stackClientApp} location={location.pathname} fullPage />
  );
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Routes>
              <Route path="/handler/*" element={<HandlerRoutes />} />
              <Route path="/" element={<div>hello world</div>} />
            </Routes>
          </StackTheme>
        </StackProvider>
      </BrowserRouter>
    </Suspense>
  );
}
// src/App.tsx

import './App.css';
import { RepoMonitor } from './components/RepoMonitor';
import { DependencyScanner } from './components/DependencyScanner'; // Yeni bileşeni import et

const REPO_OWNER = 'reactkick';
const REPO_NAME = 'reactkick';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RepoMonitor />
        <hr style={{ width: '80%', margin: '20px 0' }} />
        {/* Yeni bileşeni buraya ekliyoruz */}
        <DependencyScanner owner={REPO_OWNER} repo={REPO_NAME} />
      </header>
    </div>
  );
}

export default App;
