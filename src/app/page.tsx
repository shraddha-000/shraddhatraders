import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { services } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BookingForm } from '@/components/booking-form';
import { cn } from '@/lib/utils';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <div className="flex flex-col min-h-dvh">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => {
                const serviceImage = PlaceHolderImages.find((img) => img.id === service.imageId);
                return (
                  <Card
                    key={service.id}
                    className="bg-card/30 backdrop-blur-lg border border-border/10 shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                  >
                    <CardHeader>
                      {serviceImage && (
                        <div className="aspect-video relative mb-4">
                          <Image
                            src={serviceImage.imageUrl}
                            alt={service.title}
                            fill
                            className="rounded-t-lg object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            data-ai-hint={serviceImage.imageHint}
                          />
                        </div>
                      )}
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

        <section id="booking-form" className="py-16 md:py-24 bg-background/80">
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
