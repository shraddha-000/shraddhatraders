'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Booking } from '@/lib/types';
import { format, getHours, parseISO } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface AnalyticsDashboardProps {
  bookings: Booking[] | null;
}

export function AnalyticsDashboard({ bookings }: AnalyticsDashboardProps) {
  const bookingsByDay = React.useMemo(() => {
    if (!bookings) return [];
    const counts = bookings.reduce((acc, booking) => {
      const day = format(new Date(booking.bookingDate), 'yyyy-MM-dd');
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(counts).map(([date, count]) => ({
      date,
      count
    })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7); // Last 7 days
  }, [bookings]);

  const servicesCount = React.useMemo(() => {
    if (!bookings) return [];
    const counts = bookings.reduce((acc, booking) => {
      acc[booking.serviceType] = (acc[booking.serviceType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    })).sort((a,b) => b.value - a.value);
  }, [bookings]);
  
  const bookingsByHour = React.useMemo(() => {
     if (!bookings) return [];
     const counts = bookings.reduce((acc, booking) => {
        const hour = getHours(new Date(booking.bookingDate));
        const hourLabel = `${hour}:00`;
        acc[hourLabel] = (acc[hourLabel] || 0) + 1;
        return acc;
     }, {} as { [key: string]: number });
     
     return Object.entries(counts).map(([hour, count]) => ({
        hour,
        count
     })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  }, [bookings]);


  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Not enough data to display analytics.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Popular Services</CardTitle>
          <CardDescription>The most frequently booked services.</CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer config={{}} className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={servicesCount} layout="vertical" margin={{ left: 20, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                    <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="value" position="right" offset={8} className="fill-foreground" fontSize={12} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Daily Bookings</CardTitle>
          <CardDescription>Number of bookings over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByDay}>
                    <CartesianGrid vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(parseISO(value), 'MMM d')}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis />
                    <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                         <LabelList dataKey="count" position="top" offset={4} className="fill-foreground" fontSize={12} />
                    </Bar>
                </BarChart>
             </ResponsiveContainer>
           </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Peak Booking Hours</CardTitle>
          <CardDescription>The busiest hours of the day for bookings.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByHour}>
                    <CartesianGrid vertical={false} />
                    <XAxis 
                        dataKey="hour"
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis />
                    <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                       <LabelList dataKey="count" position="top" offset={4} className="fill-foreground" fontSize={12} />
                    </Bar>
                </BarChart>
             </ResponsiveContainer>
           </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
