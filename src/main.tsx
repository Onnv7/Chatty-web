import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { AuthProvider } from './common/context/auth.context.tsx';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
    <ToastContainer />
  </AuthProvider>,
);
