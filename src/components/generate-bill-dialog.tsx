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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { PaymentStatus, PaymentMethod } from '@/lib/types';

interface GenerateBillDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  bookingId: string;
  db: Firestore;
  onSuccess: () => void;
}

export function GenerateBillDialog({ isOpen, onOpenChange, bookingId, db, onSuccess }: GenerateBillDialogProps) {
  const [amount, setAmount] = React.useState('');
  const [paymentOption, setPaymentOption] = React.useState('Pay Later'); // Values: 'Cash', 'Online', 'Pay Later'
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

    let paymentStatus: PaymentStatus = 'Pending';
    let paymentMethod: PaymentMethod = 'N/A';

    if (paymentOption === 'Cash') {
        paymentStatus = 'Paid';
        paymentMethod = 'Cash';
    } else if (paymentOption === 'Online') {
        paymentStatus = 'Paid';
        paymentMethod = 'Online';
    }
    
    const result = await addBillToBooking(db, bookingId, numericAmount, paymentStatus, paymentMethod);

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
        setPaymentOption('Pay Later');
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Bill</DialogTitle>
          <DialogDescription>
            Enter the total amount and payment details for this service.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Payment</Label>
            <RadioGroup
              value={paymentOption}
              onValueChange={setPaymentOption}
              className="col-span-3 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Cash" id="cash" />
                <Label htmlFor="cash" className="font-normal">Paid (Cash)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Online" id="online" />
                <Label htmlFor="online" className="font-normal">Paid (Online)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Pay Later" id="later" />
                <Label htmlFor="later" className="font-normal">Pay Later</Label>
              </div>
            </RadioGroup>
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
