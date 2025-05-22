
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageWrapper from '@/components/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  User, 
  Settings, 
  Trophy, 
  Info, 
  FileText, 
  Mail, 
  Shield, 
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';

const SitemapSection = ({ 
  title, 
  icon, 
  links 
}: { 
  title: string; 
  icon: React.ReactNode; 
  links: { title: string; path: string; description: string }[] 
}) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>
          {links.length} page{links.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {links.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              className="group flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
            >
              <div className="space-y-1">
                <h4 className="font-medium group-hover:text-primary transition-colors">{link.title}</h4>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                <span className="sr-only">Visit {link.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Sitemap = () => {
  const mainLinks = [
    { title: 'Home', path: '/', description: 'Main page with game overview' },
    { title: 'Play Game', path: '/game', description: 'Play Color Grid Logic puzzles' },
  ];
  
  const accountLinks = [
    { title: 'Sign In / Sign Up', path: '/auth', description: 'Log in or create an account' },
    { title: 'Account Settings', path: '/account', description: 'Manage your profile and preferences' },
  ];
  
  const communityLinks = [
    { title: 'Leaderboard', path: '/leaderboard', description: 'See how you rank against other players' },
  ];
  
  const infoLinks = [
    { title: 'About', path: '/about', description: 'Learn about Color Grid Logic' },
    { title: 'Contact', path: '/contact', description: 'Get in touch with us' },
  ];
  
  const legalLinks = [
    { title: 'Privacy Policy', path: '/privacy-policy', description: 'How we handle your data' },
    { title: 'Terms of Use', path: '/terms-of-use', description: 'Rules for using our service' },
  ];
  
  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-12 bg-gradient-to-b from-background via-background to-purple-50/30 dark:to-purple-900/5">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Sitemap</h1>
                <p className="text-muted-foreground">Navigate through all available pages</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SitemapSection
                title="Main"
                icon={<Home className="h-5 w-5" />}
                links={mainLinks}
              />
              
              <SitemapSection
                title="Account"
                icon={<User className="h-5 w-5" />}
                links={accountLinks}
              />
              
              <SitemapSection
                title="Community"
                icon={<Trophy className="h-5 w-5" />}
                links={communityLinks}
              />
              
              <SitemapSection
                title="Information"
                icon={<Info className="h-5 w-5" />}
                links={infoLinks}
              />
              
              <SitemapSection
                title="Legal"
                icon={<Shield className="h-5 w-5" />}
                links={legalLinks}
              />
            </div>
            
            <Card className="mt-8 border border-primary/20 bg-primary/5 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">Need Help?</h3>
                      <p className="text-sm text-muted-foreground">Can't find what you're looking for?</p>
                    </div>
                  </div>
                  <Button asChild className="w-full md:w-auto">
                    <Link to="/contact">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Sitemap;
