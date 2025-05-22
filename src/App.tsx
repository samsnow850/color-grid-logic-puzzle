
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import Index from './pages/Index';
import Game from './pages/Game';
import About from './pages/About';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Leaderboard from './pages/Leaderboard';
import Sitemap from './pages/Sitemap';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import AboutDev from './pages/AboutDev';
import DailyPuzzle from './pages/DailyPuzzle';

const queryClient = new QueryClient()

const App = () => {
  // Set document title
  React.useEffect(() => {
    document.title = "Color Grid Logic";
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/game" element={<Game />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<Account />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about-dev" element={<AboutDev />} />
              <Route path="/daily-puzzle" element={<DailyPuzzle />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-center" expand={true} richColors />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
