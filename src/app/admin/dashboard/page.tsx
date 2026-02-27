'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase'; // import firebase hooks
import { collection, query, orderBy, Firestore } from 'firebase/firestore'; // import firestore functions
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Booking, BookingStatus, PaymentMethod, PaymentStatus } from '@/lib/types';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, CheckCircle, Clock, XCircle, Wrench, Loader2, User, Phone, Car, DollarSign, CreditCard, FileText } from 'lucide-react';
import { deleteBooking, updateBookingStatus, updateBookingPayment } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { GenerateBillDialog } from '@/components/generate-bill-dialog';


const getStatusVariant = (status: BookingStatus) => {
  switch (status) {
    case 'Completed': return 'secondary';
    case 'Confirmed': return 'default';
    case 'Pending': return 'outline';
    case 'Cancelled': return 'destructive';
    default: return 'outline';
  }
};

const statusIcons: { [key in BookingStatus]: React.ReactElement } = {
  Pending: <Clock className="mr-2 h-4 w-4" />,
  Confirmed: <CheckCircle className="mr-2 h-4 w-4 text-green-400" />,
  Completed: <Wrench className="mr-2 h-4 w-4 text-blue-400" />,
  Cancelled: <XCircle className="mr-2 h-4 w-4 text-red-400" />,
};

const getPaymentBadge = (paymentStatus?: PaymentStatus, paymentMethod?: PaymentMethod) => {
    const status = paymentStatus || 'Pending';
    const method = paymentMethod || 'N/A';

    if (status === 'Pending') {
      return <Badge variant="outline">Pending</Badge>;
    }
    
    if (status === 'Paid') {
      if (method === 'Cash') {
        return <Badge variant="secondary"><DollarSign className="mr-1 h-3 w-3" />Paid (Cash)</Badge>;
      }
      if (method === 'Online') {
        return <Badge variant="secondary"><CreditCard className="mr-1 h-3 w-3" />Paid (Online)</Badge>;
      }
      return <Badge variant="secondary">Paid</Badge>;
    }

    return <Badge variant="outline">Pending</Badge>;
}


function BookingActions({ booking, db, onGenerateBill }: { booking: Booking; db: Firestore; onGenerateBill: (booking: Booking) => void; }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = React.useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteBooking(db, booking.id);
    toast({ title: result.success ? 'Success' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive' });
    setIsDeleting(false);
  };
  
  const handleStatusUpdate = async (status: BookingStatus) => {
    setIsUpdating(true);
    const result = await updateBookingStatus(db, booking.id, status);
    toast({ title: result.success ? 'Success' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive' });
    setIsUpdating(false);
  }

  const handlePaymentUpdate = async (paymentStatus: PaymentStatus, paymentMethod: PaymentMethod) => {
    setIsUpdatingPayment(true);
    const result = await updateBookingPayment(db, booking.id, paymentStatus, paymentMethod);
    toast({ title: result.success ? 'Success' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive' });
    setIsUpdatingPayment(false);
  }

  const isActionRunning = isDeleting || isUpdating || isUpdatingPayment;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isActionRunning}>
            <span className="sr-only">Open menu</span>
            {isActionRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onGenerateBill(booking)} disabled={isActionRunning}>
            <FileText className="mr-2 h-4 w-4" /> {booking.amount ? 'Edit Bill' : 'Generate Bill'}
          </DropdownMenuItem>
          {typeof booking.amount !== 'undefined' && (
             <DropdownMenuItem onClick={() => router.push(`/receipt/${booking.id}`)} disabled={isActionRunning}>
                <FileText className="mr-2 h-4 w-4" /> View Receipt
             </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleStatusUpdate('Confirmed')} disabled={booking.status === 'Confirmed' || isActionRunning}>Mark as Confirmed</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusUpdate('Completed')} disabled={booking.status === 'Completed' || isActionRunning}>Mark as Completed</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusUpdate('Cancelled')} disabled={booking.status === 'Cancelled' || isActionRunning}>Mark as Cancelled</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={isActionRunning}>Update Payment</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handlePaymentUpdate('Paid', 'Cash')}>
                      <DollarSign className="mr-2 h-4 w-4" /> Paid (Cash)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePaymentUpdate('Paid', 'Online')}>
                      <CreditCard className="mr-2 h-4 w-4" /> Paid (Online)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handlePaymentUpdate('Pending', 'N/A')}>
                      Mark as Unpaid
                  </DropdownMenuItem>
              </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-600" onClick={handleDelete} disabled={isActionRunning}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default function AdminDashboardPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();

  const bookingsQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'bookings'), orderBy('bookingDate', 'desc'));
  }, [db]);
  
  const { data: allBookings, loading: bookingsLoading } = useCollection<Booking>(bookingsQuery);

  const [filteredBookings, setFilteredBookings] = React.useState<Booking[] | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchFilter, setSearchFilter] = React.useState<string>('');
  const [bookingToBill, setBookingToBill] = React.useState<Booking | null>(null);

  const popularServices = React.useMemo(() => {
    if (!allBookings) return [];
    const serviceCounts = allBookings.reduce((acc, booking) => {
        acc[booking.serviceType] = (acc[booking.serviceType] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    return Object.entries(serviceCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
  }, [allBookings]);


  React.useEffect(() => {
    if (!userLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, userLoading, router]);

  React.useEffect(() => {
    if (!allBookings) return;
    let filtered = allBookings;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    if (searchFilter) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        b.serviceType.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    setFilteredBookings(filtered);
  }, [statusFilter, searchFilter, allBookings]);
  
  const isLoading = userLoading || (bookingsLoading && allBookings === null);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
     return null; // useEffect handles the redirect
  }

  const renderBookingsContent = () => {
    if (bookingsLoading && !filteredBookings) {
      return (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      );
    }
    if (filteredBookings && filteredBookings.length === 0) {
      return (
        <div className="text-center h-24 py-10">
          No bookings found.
        </div>
      );
    }
    return (
      <>
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input 
            placeholder="Filter by name or service..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {filteredBookings?.map((booking) => (
            <Card key={booking.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.serviceType}</CardTitle>
                    <CardDescription>{format(booking.bookingDate, 'PPp')}</CardDescription>
                  </div>
                  <BookingActions booking={booking} db={db} onGenerateBill={setBookingToBill} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                 <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">{booking.name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-muted-foreground">{booking.phone}</span>
                </div>
                <div className="flex items-center">
                   <Car className="w-4 h-4 mr-2" />
                   <span className="text-muted-foreground">{booking.vehicleType}</span>
                </div>
                {typeof booking.amount !== 'undefined' && (
                  <div className="flex items-center font-medium">
                    Amount: ₹{booking.amount.toFixed(2)}
                  </div>
                )}
                <div className="flex items-center pt-2 gap-2 flex-wrap">
                  <Badge variant={getStatusVariant(booking.status)} className="flex items-center">
                    {statusIcons[booking.status]}
                    <span>{booking.status}</span>
                  </Badge>
                  {getPaymentBadge(booking.paymentStatus, booking.paymentMethod)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings?.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.name}</div>
                    <div className="text-sm text-muted-foreground">{booking.phone}</div>
                  </TableCell>
                  <TableCell>{booking.serviceType}</TableCell>
                  <TableCell>{format(booking.bookingDate, 'PPp')}</TableCell>
                  <TableCell>
                    {typeof booking.amount !== 'undefined' ? `₹${booking.amount.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                      <Badge variant={getStatusVariant(booking.status)} className="flex items-center w-fit">
                      {statusIcons[booking.status]}
                      <span>{booking.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getPaymentBadge(booking.paymentStatus, booking.paymentMethod)}
                  </TableCell>
                  <TableCell className="text-right">
                    <BookingActions booking={booking} db={db} onGenerateBill={setBookingToBill} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  };


  return (
    <div className="flex flex-col min-h-dvh">
      <SiteHeader />
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          <Card className="mb-6 bg-card/30 backdrop-blur-lg border border-border/10">
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
              <CardDescription>Top 5 most frequently booked services.</CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                 <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin" />
                 </div>
              ) : popularServices.length > 0 ? (
                <ul className="space-y-3">
                  {popularServices.map(([service, count]) => (
                    <li key={service} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{service}</span>
                      <span className="font-semibold">{count} {count === 1 ? 'booking' : 'bookings'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Not enough data to show popular services yet.</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-card/30 backdrop-blur-lg border border-border/10">
            <CardHeader>
              <CardTitle className="text-3xl font-headline">Admin Dashboard</CardTitle>
              <CardDescription>Manage all service bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderBookingsContent()}
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
      <GenerateBillDialog
        open={!!bookingToBill}
        onOpenChange={(open) => !open && setBookingToBill(null)}
        bookingId={bookingToBill?.id ?? ''}
        currentAmount={bookingToBill?.amount}
        db={db}
      />
    </div>
  );
}
