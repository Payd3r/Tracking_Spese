import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useRef } from "react";
import Home from "./pages/Home";
import AddTransaction from "./pages/AddTransaction";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Transactions from "./pages/Transactions";
import AccountManagement from "./pages/AccountManagement";
import CategoryManagement from "./pages/CategoryManagement";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

// Hook per gesture di swipe
const useSwipeBack = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  // Minima distanza per considerare un swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && distanceX > minSwipeDistance) {
      // Swipe da sinistra a destra - torna indietro
      navigate(-1);
    }
  };

  useEffect(() => {
    // Applica solo su mobile e solo nelle pagine che non sono la home
    if (window.innerWidth <= 768 && location.pathname !== '/') {
      document.addEventListener('touchstart', onTouchStart);
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);

      return () => {
        document.removeEventListener('touchstart', onTouchStart);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      };
    }
  }, [location.pathname, navigate]);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchInterval: 60 * 1000, // 1 minute
    },
  },
});

const AppContent = () => {
  const { isOnline, triggerSync } = useOnlineStatus();
  useSwipeBack(); // Aggiungo il hook per le gesture

  useEffect(() => {
    // Trigger sync when app loads and is online, but only once
    if (isOnline) {
      const timer = setTimeout(() => {
        triggerSync();
      }, 2000); // Wait 2 seconds before first sync
      
      return () => clearTimeout(timer);
    }
  }, [isOnline]); // Remove triggerSync from dependencies to avoid infinite loop

  return (
    <BrowserRouter>
      <div className="relative fullscreen-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/accounts" element={<AccountManagement />} />
          <Route path="/settings/categories" element={<CategoryManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNavigation />
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="tracking-spese-theme">
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <AppContent />
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
