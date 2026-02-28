'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase'; // import firebase hooks
import { collection, query, orderBy, getDocs, Timestamp, Firestore } from 'firebase/firestore'; // import firestore functions
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Booking, BookingStatus, PaymentMethod, PaymentStatus } from '@/lib/types';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, CheckCircle, Clock, XCircle, Wrench, Loader2, User, Phone, Car, DollarSign, CreditCard, Receipt, Book, FileText, RefreshCw } from 'lucide-react';
import { deleteBooking, updateBookingStatus, updateBookingPayment, addBillToBooking } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { GenerateBillDialog } from '@/components/generate-bill-dialog';
import Link from 'next/link';


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


function BookingActions({ booking, db, onGenerateBill, onActionSuccess }: { booking: Booking; db: Firestore; onGenerateBill: (booking: Booking) => void; onActionSuccess: () => void; }) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = React.useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteBooking(db, booking.id);
    toast({ title: result.success ? 'Success' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive' });
    if(result.success) onActionSuccess();
    setIsDeleting(false);
  };
  
  const handleStatusUpdate = async (status: BookingStatus) => {
    setIsUpdating(true);
    const result = await updateBookingStatus(db, booking.id, status);
    toast({ title: result.success ? 'Success' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive' });
    if(result.success) onActionSuccess();
    setIsUpdating(false);
  }

  const handlePaymentUpdate = async (paymentStatus: PaymentStatus, paymentMethod: PaymentMethod) => {
    setIsUpdatingPayment(true);
    const result = await updateBookingPayment(db, booking.id, paymentStatus, paymentMethod);
    toast({ title: result.success ? 'Success' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive' });
    if(result.success) onActionSuccess();
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
          {booking.amount ? (
            <DropdownMenuItem asChild>
                <Link href={`/receipt?id=${booking.id}`} target="_blank"><FileText className="mr-2 h-4 w-4" /> View Receipt</Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onGenerateBill(booking)} disabled={isActionRunning}>
                <Receipt className="mr-2 h-4 w-4" /> Generate Bill
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
  const { toast } = useToast();

  const [allBookings, setAllBookings] = React.useState<Booking[] | null>(null);
  const [bookingsLoading, setBookingsLoading] = React.useState(true);
  
  const [filteredBookings, setFilteredBookings] = React.useState<Booking[] | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchFilter, setSearchFilter] = React.useState<string>('');
  const [isBillDialogOpen, setIsBillDialogOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);


  const fetchBookings = React.useCallback(async () => {
    if (!db) return;
    setBookingsLoading(true);
    try {
      const bookingsQuery = query(collection(db, 'bookings'), orderBy('bookingDate', 'desc'));
      const querySnapshot = await getDocs(bookingsQuery);
      const bookingsData: Booking[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const bookingDate = data.bookingDate instanceof Timestamp ? data.bookingDate.toDate() : new Date(data.bookingDate);
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : undefined);

        bookingsData.push({
          id: doc.id,
          ...data,
          bookingDate,
          createdAt,
        } as Booking);
      });
      setAllBookings(bookingsData);
    } catch (error) {
        console.error("Error fetching bookings: ", error);
        toast({
            title: 'Error',
            description: 'Could not fetch bookings. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setBookingsLoading(false);
    }
  }, [db, toast]);

  React.useEffect(() => {
    if(db) {
        fetchBookings();
    }
  }, [db, fetchBookings]);


  const handleActionSuccess = () => {
    fetchBookings();
  };

  const handleGenerateBill = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBillDialogOpen(true);
  };

  const handleBillSuccess = () => {
    toast({ title: 'Success', description: 'Bill has been generated.' });
    setIsBillDialogOpen(false);
    setSelectedBooking(null);
    fetchBookings();
  };

  const stats = React.useMemo(() => {
    if (!allBookings) return { totalRevenue: 0, totalBookings: 0 };
    const totalRevenue = allBookings
      .filter(b => b.status === 'Completed' && b.paymentStatus === 'Paid' && b.amount)
      .reduce((acc, b) => acc + (b.amount || 0), 0);
    
    return {
      totalRevenue,
      totalBookings: allBookings.length,
    };
  }, [allBookings]);

  React.useEffect(() => {
    if (!userLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, userLoading, router]);

  React.useEffect(() => {
    if (!allBookings) {
      setFilteredBookings(null);
      return;
    };
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
          <Button variant="outline" onClick={fetchBookings} disabled={bookingsLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${bookingsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
                  <BookingActions booking={booking} db={db} onGenerateBill={handleGenerateBill} onActionSuccess={handleActionSuccess} />
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
                 {booking.amount && (
                    <div className="flex items-center text-primary font-semibold">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(booking.amount)}</span>
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
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
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
                  <TableCell>
                    {booking.amount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(booking.amount) : '-'}
                  </TableCell>
                  <TableCell>{format(booking.bookingDate, 'PPp')}</TableCell>
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
                    <BookingActions booking={booking} db={db} onGenerateBill={handleGenerateBill} onActionSuccess={handleActionSuccess} />
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
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {bookingsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                      <>
                        <div className="text-2xl font-bold">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(stats.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">From completed and paid bookings</p>
                      </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {bookingsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                        <div className="text-2xl font-bold">{stats.totalBookings}</div>
                    )}
                </CardContent>
            </Card>
          </div>
          
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
       {selectedBooking && db && (
        <GenerateBillDialog
          isOpen={isBillDialogOpen}
          onOpenChange={setIsBillDialogOpen}
          bookingId={selectedBooking.id}
          db={db}
          onSuccess={handleBillSuccess}
        />
      )}
    </div>
  );
}
