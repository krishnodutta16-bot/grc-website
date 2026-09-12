import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/workshops', label: 'Workshops' },
    { path: '/news', label: 'News' },
    { path: '/research', label: 'Research' },
    { path: '/partners', label: 'Partners' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://horizons-cdn.hostinger.com/a400c83b-ae48-4e69-a0ca-cf741e042871/423b6b71968246dd21ed8789bef1797c.png" 
              alt="GRC Logo" 
              className="h-8 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {!currentUser ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to={isAdmin ? '/admin' : '/dashboard'}>
                    {isAdmin ? 'Admin' : 'Dashboard'}
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary ${
                          isActive(link.path) ? 'text-primary' : 'text-foreground/80'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="flex flex-col gap-3 pt-6 border-t">
                    {!currentUser ? (
                      <>
                        <Button variant="outline" asChild className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                          <Link to="/login">Login</Link>
                        </Button>
                        <Button asChild className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                          <Link to="/signup">Sign Up</Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" asChild className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                          <Link to={isAdmin ? '/admin' : '/dashboard'}>
                            {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;