import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import URLScanner from './components/URLScanner';
import SOCDashboard from './components/SOCDashboard';
import ModelBenchmarkView from './components/ModelBenchmarkView';
import AdminConsole from './components/AdminConsole';
import LoginModal from './components/LoginModal';
import SecurityToolsView from './components/SecurityToolsView';
import BatchScanner from './components/BatchScanner';
import HistoryTable from './components/HistoryTable';
import DeviceManager from './components/DeviceManager';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';
import { getCurrentUser, logoutUser } from './services/api';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [apiOnline, setApiOnline] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('cybershield_jwt_token');
      if (token) {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
          localStorage.setItem('cybershield_user', JSON.stringify(user));
        } catch (e) {
          console.warn('Session verification failed, logging out:', e);
          logoutUser();
          setCurrentUser(null);
        }
      } else {
        const savedUser = localStorage.getItem('cybershield_user');
        if (savedUser) {
          try {
            setCurrentUser(JSON.parse(savedUser));
          } catch (e) {}
        }
      }
    };
    verifySession();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiOnline={apiOnline}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'home' && <LandingPage onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'scanner' && <URLScanner showToast={showToast} />}
        {activeTab === 'soc' && <SOCDashboard />}
        {activeTab === 'devices' && <DeviceManager />}
        {activeTab === 'benchmarks' && <ModelBenchmarkView />}
        {activeTab === 'tools' && <SecurityToolsView />}
        {activeTab === 'admin' && <AdminConsole currentUser={currentUser} showToast={showToast} />}
        {activeTab === 'history' && <HistoryTable />}
        {activeTab === 'batch' && <BatchScanner showToast={showToast} />}
      </main>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setShowLoginModal(false);
            showToast('success', `Authenticated as ${user.email} (${user.role})`);
          }}
        />
      )}

      {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}

      <Footer />
    </div>
  );
};

export default App;
