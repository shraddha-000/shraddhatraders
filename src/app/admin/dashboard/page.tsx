'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { bookings as allBookings } from '@/lib/data';
import type { Booking, BookingStatus } from '@/lib/types';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, CheckCircle, Clock, XCircle, Wrench, Loader2 } from 'lucide-react';
import { deleteBooking, updateBookingStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const getStatusVariant = (status: BookingStatus) => {
  switch (status) {
    case 'Completed': return 'secondary';
    case 'Confirmed': return 'default';
    case 'Pending': return 'outline';
    case 'Cancelled': return 'destructive';
    default: return 'outline';
  }
};

const statusIcons = {
  Pending: <Clock className="mr-2 h-4 w-4" />,
  Confirmed: <CheckCircle className="mr-2 h-4 w-4 text-green-400" />,
  Completed: <Wrench className="mr-2 h-4 w-4 text-blue-400" />,
  Cancelled: <XCircle className="mr-2 h-4 w-4 text-red-400" />,
};

function BookingActions({ booking }: { booking: Booking }) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteBooking(booking.id);
    toast({ title: result.success ? 'Success' : 'Error', description: result.message });
    setIsDeleting(false);
  };
  
  const handleStatusUpdate = async (status: BookingStatus) => {
    setIsUpdating(true);
    const result = await updateBookingStatus(booking.id, status);
    toast({ title: result.success ? 'Success' : 'Error', description: result.message });
    setIsUpdating(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting || isUpdating}>
          <span className="sr-only">Open menu</span>
          {isDeleting || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleStatusUpdate('Confirmed')}>Mark as Confirmed</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusUpdate('Completed')}>Mark as Completed</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusUpdate('Cancelled')}>Mark as Cancelled</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-600" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AdminDashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = React.useState<Booking[]>(allBookings);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchFilter, setSearchFilter] = React.useState<string>('');

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    let filtered = allBookings;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    if (searchFilter) {
      filtered = filtered.filter(b => b.name.toLowerCase().includes(searchFilter.toLowerCase()));
    }
    setBookings(filtered);
  }, [statusFilter, searchFilter]);

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <Card className="bg-card/30 backdrop-blur-lg border border-border/10">
            <CardHeader>
              <CardTitle className="text-3xl font-headline">Admin Dashboard</CardTitle>
              <CardDescription>Manage all service bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input 
                  placeholder="Filter by name..."
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

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="font-medium">{booking.name}</div>
                          <div className="text-sm text-muted-foreground">{booking.phone}</div>
                        </TableCell>
                        <TableCell>{booking.serviceType}</TableCell>
                        <TableCell>{format(booking.bookingDate, 'PPp')}</TableCell>
                        <TableCell>
                           <Badge variant={getStatusVariant(booking.status)} className="flex items-center w-fit">
                            {statusIcons[booking.status]}
                            <span>{booking.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <BookingActions booking={booking} />
                        </TableCell>
                      </TableRow>
                    ))}
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
