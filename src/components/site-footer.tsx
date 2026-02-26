import { Wrench } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-muted/40 border-t border-border/40">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <p className="text-center text-sm leading-loose text-muted-foreground">
              Built for Shraddha Traders.
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
