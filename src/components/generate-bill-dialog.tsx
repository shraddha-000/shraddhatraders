'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addBillToBooking } from '@/lib/actions';
import type { Firestore } from 'firebase/firestore';

interface GenerateBillDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  bookingId: string;
  db: Firestore;
  onSuccess: () => void;
}

export function GenerateBillDialog({ isOpen, onOpenChange, bookingId, db, onSuccess }: GenerateBillDialogProps) {
  const [amount, setAmount] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number for the amount.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const result = await addBillToBooking(db, bookingId, numericAmount);
    if (result.success) {
      onSuccess();
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };
  
  React.useEffect(() => {
    if(!isOpen) {
        setAmount('');
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Bill</DialogTitle>
          <DialogDescription>
            Enter the total amount for this service. This cannot be changed later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (INR)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 500.00"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save and Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
