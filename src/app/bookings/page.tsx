import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { bookings } from '@/lib/data';
import type { BookingStatus } from '@/lib/types';
import { format } from 'date-fns';

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
  // In a real app, this data would be fetched for the logged-in user.
  // For this demo, we'll use the static mock data.
  const userBookings = bookings;

  return (
    <div className="flex flex-col min-h-dvh">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <Card className="bg-card/30 backdrop-blur-lg border border-border/10">
            <CardHeader>
              <CardTitle className="text-3xl font-headline">My Bookings</CardTitle>
              <CardDescription>Here is a list of your past and upcoming service appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userBookings.length > 0 ? (
                      userBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
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
                        <TableCell colSpan={5} className="text-center h-24">
                          You have no bookings yet.
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
