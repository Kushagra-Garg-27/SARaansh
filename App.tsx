import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CasesList } from './pages/CasesList';
import { CaseDetail } from './pages/CaseDetail';
import { AuditLog } from './pages/AuditLog';
import { LandingPage } from './pages/LandingPage';

export default function App() {
  const [viewState, setViewState] = useState<'landing' | 'transitioning' | 'dashboard'>('landing');
  const [activePage, setActivePage] = useState('dashboard');

  // Handle the cinematic transition sequence
  const handleEnterPlatform = () => {
    setViewState('transitioning');
    
    // Duration matches the fade-out animation + slight buffer
    setTimeout(() => {
      setViewState('dashboard');
    }, 600);
  };

  const handleReturnToLanding = () => {
    setViewState('landing');
    setActivePage('dashboard');
  };

  if (viewState === 'landing' || viewState === 'transitioning') {
    return (
      <LandingPage 
        onEnter={handleEnterPlatform} 
        isExiting={viewState === 'transitioning'} 
      />
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'cases':
        return <CasesList onNavigate={setActivePage} />;
      case 'case-detail':
        return <CaseDetail />;
      case 'audit':
        return <AuditLog />;
      case 'settings':
        return (
          <div className="flex items-center justify-center h-full text-neutral-400 animate-enter">
            <div className="text-center">
              <h2 className="text-xl font-bold text-neutral-600 mb-2 font-display">System Settings</h2>
              <p>Configuration panel enabled for Admin role only.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <Layout 
      activePage={activePage} 
      onNavigate={setActivePage} 
      onLogoClick={handleReturnToLanding}
    >
      {renderPage()}
    </Layout>
  );
}