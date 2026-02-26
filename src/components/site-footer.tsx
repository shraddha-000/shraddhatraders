import { Wrench, MapPin, Phone } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-muted/40 border-t border-border/40">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <p className="text-sm font-bold">
              Shraddha Traders
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-sm text-muted-foreground">
             <a href="https://www.google.com/maps/place/16%C2%B043'28.6%22N+74%C2%B021'32.8%22E" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                <MapPin className="h-4 w-4" />
                <span>Shahu Tarun Mandal, Rukdi.</span>
            </a>
             <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:7040333288" className="hover:text-primary">7040333288</a>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
