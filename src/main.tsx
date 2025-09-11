import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/click-states.css';
import App from './App.tsx';
import './i18n'; // Import i18n configuration

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(<App />);
