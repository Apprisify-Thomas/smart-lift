import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import BackgroundLoop from './components/BackgroundLoop.tsx';

createRoot(document.getElementById('root')!).render(
  <>
    <BackgroundLoop />
    <App />
  </>
);
