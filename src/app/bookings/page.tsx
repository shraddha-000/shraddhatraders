'use client';

import * as React from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Booking, BookingStatus } from '@/lib/types';
import { format } from 'date-fns';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const getStatusVariant = (status: BookingStatus) => {
  switch (status) {
    case 'Completed':
      return 'secondary';
    case 'Confirmed':
      return 'default';
    case 'Pending':
      return 'outline';
    case 'Cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function BookingsPage() {
  const db = useFirestore();
  const { toast } = useToast();

  const [phone, setPhone] = React.useState('');
  const [userBookings, setUserBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length !== 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit phone number.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setUserBookings([]);

    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('phone', '==', phone));
      const querySnapshot = await getDocs(q);
      
      const bookingsData: Booking[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Manually convert Timestamps to Dates
        const bookingDate = data.bookingDate instanceof Timestamp ? data.bookingDate.toDate() : new Date(data.bookingDate);
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : undefined);
        
        bookingsData.push({
          id: doc.id,
          name: data.name,
          phone: data.phone,
          vehicleType: data.vehicleType,
          serviceType: data.serviceType,
          status: data.status,
          bookingDate,
          createdAt,
        });
      });

      setUserBookings(bookingsData.sort((a, b) => b.bookingDate.getTime() - a.bookingDate.getTime()));

    } catch (error) {
      console.error("Error fetching bookings: ", error);
      toast({
        title: 'Error',
        description: 'Could not fetch bookings. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <Card className="bg-card/30 backdrop-blur-lg border border-border/10">
            <CardHeader>
              <CardTitle className="text-3xl font-headline">My Bookings</CardTitle>
              <CardDescription>Enter your phone number to find your service appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8 max-w-lg">
                <Input 
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2" />}
                  Search Bookings
                </Button>
              </form>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                        </TableCell>
                      </TableRow>
                    ) : !hasSearched ? (
                       <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                          Enter your phone number to find your bookings.
                        </TableCell>
                      </TableRow>
                    ) : userBookings.length > 0 ? (
                      userBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.serviceType}</TableCell>
                          <TableCell>{format(booking.bookingDate, 'PPp')}</TableCell>
                          <TableCell>{booking.vehicleType}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                          No bookings found for this phone number.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
