import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { StudentContextProvider } from '@/contexts/StudentContext.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StudentContextProvider>
            <App />
            <Toaster />
        </StudentContextProvider>
    </StrictMode>
);
