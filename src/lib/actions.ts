'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  vehicleType: z.enum(['Car', 'SUV', 'Truck', 'Motorcycle']),
  serviceType: z.string().min(1, 'Please select a service.'),
  bookingDate: z.string().min(1, 'Please select a date.'),
});

export type FormState = {
  message: string;
  success: boolean;
};

export async function submitBooking(prevState: FormState, formData: FormData): Promise<FormState> {
  
  const validatedFields = bookingSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    vehicleType: formData.get('vehicleType'),
    serviceType: formData.get('serviceType'),
    bookingDate: formData.get('bookingDate'),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(' ');
    return {
      message: `Validation failed: ${errorMessages}`,
      success: false,
    };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, you would save this to a database.
  console.log('New Booking Submitted:', validatedFields.data);

  revalidatePath('/');

  return {
    message: 'Booking submitted successfully! We will contact you shortly to confirm.',
    success: true,
  };
}

export async function updateBookingStatus(bookingId: string, status: string) {
    // Simulate DB update
    console.log(`Updating booking ${bookingId} to status ${status}`);
    await new Promise(res => setTimeout(res, 500));
    revalidatePath('/admin/dashboard');
    return { success: true, message: `Booking ${bookingId} updated.` };
}

export async function deleteBooking(bookingId: string) {
    // Simulate DB deletion
    console.log(`Deleting booking ${bookingId}`);
    await new Promise(res => setTimeout(res, 500));
    revalidatePath('/admin/dashboard');
    return { success: true, message: `Booking ${bookingId} deleted.` };
}
