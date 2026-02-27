'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import type { Booking } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Wrench, Printer, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReceiptPage() {
  const { id: bookingId } = useParams<{ id: string }>();
  const db = useFirestore();
  const { toast } = useToast();

  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!bookingId || !db) return;

    const fetchBooking = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'bookings', bookingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Convert Timestamps to Dates
          const bookingDate = data.bookingDate instanceof Timestamp ? data.bookingDate.toDate() : new Date(data.bookingDate);
          const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : undefined);
          
          setBooking({ id: docSnap.id, ...data, bookingDate, createdAt } as Booking);
        } else {
          toast({
            title: 'Not Found',
            description: 'Could not find the specified booking.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast({
          title: 'Error',
          description: 'Failed to fetch booking details.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, db, toast]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!booking || typeof booking.amount === 'undefined') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted p-4 text-center">
        <p>Booking not found or a bill has not been generated for this service yet.</p>
      </div>
    );
  }

  const subtotal = booking.amount || 0;
  const tax = subtotal * 0.18; // Assuming 18% tax
  const total = subtotal + tax;

  return (
    <div className="bg-muted min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4 print:hidden">
          <Button onClick={handlePrint}>
            <Printer className="mr-2" /> Print Receipt
          </Button>
        </div>
        <Card className="shadow-lg" id="receipt">
          <CardHeader className="bg-muted/30 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Wrench className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold">Shraddha Traders</h1>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4"/><span>Near Sambhajirao Mane, Rukdi.</span></p>
                        <p className="flex items-center gap-2"><Phone className="h-4 w-4"/><span>7040333288</span></p>
                    </div>
                </div>
                <div className="text-left sm:text-right">
                    <CardTitle className="text-3xl font-headline text-primary">INVOICE</CardTitle>
                    <p className="text-sm text-muted-foreground">#{booking.id.substring(0, 7).toUpperCase()}</p>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2 text-muted-foreground">Bill To</h3>
                <p className="font-medium">{booking.name}</p>
                <p className="text-muted-foreground">{booking.phone}</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold mb-1 text-muted-foreground">Invoice Date</h3>
                <p>{format(new Date(), 'PPP')}</p>
                <h3 className="font-semibold mb-1 mt-2 text-muted-foreground">Service Date</h3>
                <p>{format(booking.bookingDate, 'PPP')}</p>
              </div>
            </div>

            
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                      <tr>
                          <th className="p-3 text-left font-medium">Service Description</th>
                          <th className="p-3 text-right font-medium">Amount</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr className="border-b">
                          <td className="p-3">
                              <p className="font-medium">{booking.serviceType}</p>
                              <p className="text-muted-foreground text-xs">{booking.vehicleType}</p>
                          </td>
                          <td className="p-3 text-right">₹{subtotal.toFixed(2)}</td>
                      </tr>
                  </tbody>
              </table>
            </div>

            <div className="w-full sm:w-2/3 md:w-1/2 ml-auto mt-6 space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes (18%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold text-primary">
                    <span>Total Amount</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>
             <div className="mt-8">
              <h3 className="font-semibold mb-2 text-muted-foreground">Payment Details</h3>
              <div className="text-sm">
                <p>Status: <span className="font-medium">{booking.paymentStatus}</span></p>
                {booking.paymentStatus === 'Paid' && <p>Method: <span className="font-medium">{booking.paymentMethod}</span></p>}
              </div>
            </div>

            <div className="mt-12 text-center text-xs text-muted-foreground">
                <p>Thank you for your business!</p>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 p-4 text-center text-xs text-muted-foreground">
             This is a computer-generated invoice and does not require a signature.
          </CardFooter>
        </Card>
      </div>
      <style jsx global>{`
        @media print {
          body {
            background-color: #fff;
          }
          .print\\:hidden {
            display: none;
          }
          #receipt {
             box-shadow: none !important;
             border: none !important;
          }
           .bg-muted, .bg-muted\\/30 {
             background-color: transparent !important;
           }
        }
      `}</style>
    </div>
  );
}
