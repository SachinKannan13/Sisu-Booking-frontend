import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#fbf9f3',
              color: '#1c1c1c',
              border: '1px solid #eceae4'
            },
            success: { iconTheme: { primary: '#f5a623', secondary: '#1c1c1c' } },
            error: { iconTheme: { primary: '#c85250', secondary: '#1c1c1c' } }
          }}
        />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
