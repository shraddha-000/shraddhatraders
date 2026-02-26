'use client';

import Link from 'next/link';
import { Wrench, Menu, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const isAdminRoute = pathname.startsWith('/admin');
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      toast({ title: 'Logged out successfully.' });
      router.push('/admin/login');
    } catch (error) {
      toast({ title: 'Error logging out.', variant: 'destructive' });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">Shraddha Traders</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Home
            </Link>
            <Link
              href="/bookings"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              My Bookings
            </Link>
          </nav>
        </div>
        
        <div className="md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
               <div className="p-4">
                <Link href="/" className="mb-8 flex items-center space-x-2">
                    <Wrench className="h-6 w-6 text-primary" />
                    <span className="font-bold">Shraddha Traders</span>
                </Link>
                <nav className="flex flex-col gap-4">
                    <Link href="/" className="text-lg font-medium">Home</Link>
                    <Link href="/bookings" className="text-lg font-medium">My Bookings</Link>
                    <Link href="/admin/login" className="text-lg font-medium">Admin</Link>
                </nav>
               </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add a search bar here later */}
          </div>
          <nav className="hidden md:flex items-center">
            {isAdminRoute && !loading && user ? (
              <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                Logout
              </Button>
            ) : (
              <Button asChild>
                <Link href="/admin/login">Admin Login</Link>
              </Button>
            )}
          </nav>
        </div>

      </div>
    </header>
  );
}
