import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { StudentContextProvider } from './contexts/StudentContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StudentContextProvider>
            <App />
        </StudentContextProvider>
    </StrictMode>
);
