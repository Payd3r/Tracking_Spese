import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Prevent overscroll in PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
  // Prevent overscroll on touch devices
  document.addEventListener('touchmove', (e) => {
    const target = e.target as HTMLElement;
    const scrollable = target.closest('.fullscreen-container, .page-content, [data-scrollable]');
    
    if (!scrollable) {
      e.preventDefault();
    }
  }, { passive: false });

  // Prevent overscroll on wheel events
  document.addEventListener('wheel', (e) => {
    const target = e.target as HTMLElement;
    const scrollable = target.closest('.fullscreen-container, .page-content, [data-scrollable]');
    
    if (!scrollable) {
      e.preventDefault();
    }
  }, { passive: false });

  // Prevent overscroll on key events
  document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
      const target = e.target as HTMLElement;
      const scrollable = target.closest('.fullscreen-container, .page-content, [data-scrollable]');
      
      if (!scrollable) {
        e.preventDefault();
      }
    }
  });
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />)
