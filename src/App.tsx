
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";

import Preview from './pages/Preview'; // Using Preview as the home page
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
import Index from './pages/Index';
import PreviewFooter from './components/PreviewFooter';

const queryClient = new QueryClient()

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Preview />} />
                  <Route path="/classic" element={<Index />} />
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
                  <Route path="/preview" element={<Preview />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <PreviewFooter />
            </div>
            <Toaster position="top-center" expand={true} richColors />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
