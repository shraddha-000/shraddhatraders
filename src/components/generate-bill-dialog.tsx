'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React from 'react';
import { Loader2 } from 'lucide-react';
import type { Firestore } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { setBookingAmount } from '@/lib/actions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const billFormSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number.' }),
});

type BillFormValues = z.infer<typeof billFormSchema>;

interface GenerateBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  currentAmount?: number;
  db: Firestore;
}

export function GenerateBillDialog({ open, onOpenChange, bookingId, currentAmount, db }: GenerateBillDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      amount: currentAmount || undefined,
    },
  });
  
  React.useEffect(() => {
    if(open) {
      form.reset({ amount: currentAmount || undefined });
    }
  }, [open, currentAmount, form]);


  async function onSubmit(data: BillFormValues) {
    setIsSubmitting(true);
    const result = await setBookingAmount(db, bookingId, data.amount);
    
    toast({
      title: result.success ? 'Success!' : 'Oops!',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });

    if (result.success) {
      onOpenChange(false);
    }
    setIsSubmitting(false);
  }
  
  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) return;
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentAmount ? 'Edit Bill Amount' : 'Generate Bill'}</DialogTitle>
          <DialogDescription>
            Enter the total amount for this service booking.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount (INR)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500" {...field} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentAmount ? 'Update Amount' : 'Save Amount'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
