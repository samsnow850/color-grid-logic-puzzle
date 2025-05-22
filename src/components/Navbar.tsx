
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from './Logo';
import { Menu, User, Trophy, Settings, LogOut, Home, Info, FileText, HelpCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [profileData, setProfileData] = useState<{ avatar_url?: string; display_name?: string } | null>(null);
  const navigate = useNavigate();
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch user profile data
  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url, display_name')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setProfileData(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    
    getProfile();
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-8 w-auto text-primary" />
              <span className="font-bold text-lg hidden sm:inline-block">Color Grid Logic</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center ml-10 space-x-1">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Button>
              </Link>
              <Link to="/game">
                <Button 
                  variant={isActive('/game') ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid-3x3"><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
                  <span>Play</span>
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button 
                  variant={isActive('/leaderboard') ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboard</span>
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant={isActive('/about') ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Info className="w-4 h-4" />
                  <span>About</span>
                </Button>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8 border border-primary/10">
                      {profileData?.avatar_url ? (
                        <AvatarImage 
                          src={profileData.avatar_url} 
                          alt={profileData.display_name || user.email || "User"} 
                        />
                      ) : (
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(profileData?.display_name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profileData?.display_name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account & Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button 
                      className="flex items-center w-full cursor-pointer" 
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
            
            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                    <Home className="mr-2 h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link to="/game" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
                    <span>Play Game</span>
                  </Link>
                  <Link to="/leaderboard" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                    <Trophy className="mr-2 h-5 w-5" />
                    <span>Leaderboard</span>
                  </Link>
                  <Link to="/about" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                    <Info className="mr-2 h-5 w-5" />
                    <span>About</span>
                  </Link>
                  <Link to="/sitemap" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                    <FileText className="mr-2 h-5 w-5" />
                    <span>Sitemap</span>
                  </Link>
                  
                  <div className="border-t my-4"></div>
                  
                  {user ? (
                    <>
                      <Link to="/account" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                        <User className="mr-2 h-5 w-5" />
                        <span>Account & Settings</span>
                      </Link>
                      <button 
                        className="flex items-center py-2 px-3 rounded-md hover:bg-accent text-left w-full" 
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        <span>Sign out</span>
                      </button>
                    </>
                  ) : (
                    <Link to="/auth" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                      <User className="mr-2 h-5 w-5" />
                      <span>Sign In</span>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
