import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4">
          <span className="font-semibold">📱 Offline Mode</span> - CabStats is working offline!
        </div>
      )}

      {/* Install button */}
      {showInstallButton && (
        <div className="bg-green-500 text-white text-center py-2 px-4">
          <span className="font-semibold">📱 Install CabStats</span> -
          <button
            onClick={handleInstallClick}
            className="ml-2 underline hover:no-underline font-bold"
          >
            Click here to install
          </button>
        </div>
      )}

      <header className="App-header">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <img src={logo} className="App-logo mx-auto mb-6" alt="logo" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to CabStats
          </h1>
          <p className="text-gray-600 mb-6">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/App.js</code> and save to reload.
          </p>
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${isOnline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
              {isOnline ? '🟢 Online' : '🟡 Offline'}
            </span>
          </div>
          <a
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;
