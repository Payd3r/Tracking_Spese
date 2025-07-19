import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect } from "react";
import Home from "./pages/Home";
import AddTransaction from "./pages/AddTransaction";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Transactions from "./pages/Transactions";
import AccountManagement from "./pages/AccountManagement";
import CategoryManagement from "./pages/CategoryManagement";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

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
