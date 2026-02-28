'use client';

import * as React from 'react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Booking } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Loader2, Wrench, Printer, MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ReceiptPageContent({ id }: { id: string }) {
  const db = useFirestore();
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id || !db) {
      setError('Missing booking ID or database connection.');
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const bookingRef = doc(db, 'bookings', id as string);
        const docSnap = await getDoc(bookingRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const bookingDate = data.bookingDate instanceof Timestamp ? data.bookingDate.toDate() : new Date(data.bookingDate);
          const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date());

          setBooking({ id: docSnap.id, ...data, bookingDate, createdAt } as Booking);
        } else {
          setError("No such document!");
          console.log("No such document!");
        }
      } catch (error) {
        setError("Error fetching document.");
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, db]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p>{error || 'Receipt not found.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-dvh py-8 md:py-12 print:py-0">
        <div className="container max-w-2xl">
            <div className="flex justify-end mb-4 print:hidden">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" /> Print Receipt
                </Button>
            </div>
            <Card className="border shadow-lg print:border-none print:shadow-none">
                <CardHeader className="bg-muted/30 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Wrench className="h-6 w-6 text-primary" />
                                <h1 className="text-xl font-bold">Shraddha Traders</h1>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3"/>
                                    <span>Near Sambhajirao Mane, Rukdi.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    <span>7040333288</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <CardTitle className="text-2xl font-bold">Receipt</CardTitle>
                            <CardDescription>#{booking.id.substring(0, 7).toUpperCase()}</CardDescription>
                            <div className="text-sm text-muted-foreground mt-1">
                                Issued: {format(new Date(), 'PP')}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                            <h3 className="font-semibold mb-2">Bill To</h3>
                            <p className="text-sm font-medium">{booking.name}</p>
                            <p className="text-sm text-muted-foreground">{booking.phone}</p>
                        </div>
                        <div className="text-right">
                             <h3 className="font-semibold mb-2">Booking Details</h3>
                             <p className="text-sm">{format(booking.bookingDate, 'PPp')}</p>
                             <p className="text-sm text-muted-foreground">{booking.vehicleType}</p>
                        </div>
                    </div>
                    
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>{booking.serviceType}</TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(booking.amount || 0)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <div className="flex justify-end mt-6">
                        <div className="w-full max-w-xs space-y-2 text-right">
                            <div className="flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-lg">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(booking.amount || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Payment Status</span>
                                {booking.paymentStatus === 'Paid' ? (
                                    <Badge variant="secondary">Paid via {booking.paymentMethod}</Badge>
                                ) : (
                                    <Badge variant="outline">Pending</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="text-center text-xs text-muted-foreground p-6 border-t">
                    Thank you for your business!
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
