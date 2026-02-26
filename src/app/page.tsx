import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { services } from '@/lib/data';
import { BookingForm } from '@/components/booking-form';
import { ShieldCheck, Car, Bike, Cog, Wrench, CarFront, Settings, Construction, Disc } from 'lucide-react';
import * as React from 'react';

const iconMap: { [key: string]: React.ElementType } = {
  ShieldCheck,
  Car,
  Bike,
  Cog,
  Wrench,
  CarFront,
  Settings,
  Construction,
  Disc
};

export default function Home() {
  const brands = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Suzuki', 'Yamaha', 'Royal Enfield', 'MRF', 'CEAT'];
  return (
    <div className="flex flex-col min-h-dvh">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-background to-primary/30" />
          <div className="relative z-10 p-4 max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold tracking-tighter !leading-[1.1]">
              <span className="text-primary">Premium Care</span> for Your Premium Ride
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              From pristine washes to protective coatings, we provide the ultimate treatment your vehicle deserves.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="#booking-form">Book a Service</a>
              </Button>
            </div>
          </div>
        </section>

        <section id="services" className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Services</h2>
              <p className="mt-3 text-muted-foreground md:text-lg">
                We offer a range of specialized services to keep your vehicle in top condition.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon];
                return (
                  <Card
                    key={service.id}
                    className="bg-card/30 backdrop-blur-lg border border-border/10 shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 animate-fade-in-up text-center"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <CardHeader>
                      <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                        {Icon && <Icon className="w-10 h-10 text-primary" />}
                      </div>
                      <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{service.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="brands" className="py-16 md:py-24 bg-background/80">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Brands We Work With</h2>
              <p className="mt-3 text-muted-foreground md:text-lg">
                We use genuine parts from all the leading brands to ensure the best quality for your vehicle.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {brands.map((brand) => (
                <div key={brand} className="text-center">
                  <p className="text-xl font-bold text-muted-foreground grayscale hover:grayscale-0 transition-all duration-300">
                    {brand}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="booking-form" className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-card/30 backdrop-blur-lg border border-border/10 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-headline">Book Your Service</CardTitle>
                  <CardDescription className="md:text-base">
                    Fill out the form below and we'll get back to you to confirm your appointment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingForm services={services} />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
