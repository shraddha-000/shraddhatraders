'use client';

import { addDoc, collection, doc, updateDoc, deleteDoc, serverTimestamp, type Firestore } from "firebase/firestore";
import type { Booking, BookingStatus, PaymentMethod, PaymentStatus } from "./types";

// Note: These are no longer server actions. They are client-side functions
// that need a Firestore instance.

type BookingInput = Omit<Booking, 'id' | 'status' | 'createdAt' | 'paymentStatus' | 'paymentMethod' | 'amount'>;

export async function createBooking(db: Firestore, booking: BookingInput) {
  try {
    const newBooking = {
      ...booking,
      status: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod: 'N/A',
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'bookings'), newBooking);
    return { success: true, message: 'Booking submitted successfully! We will contact you shortly to confirm.' };
  } catch (error) {
    console.error("Error creating booking: ", error);
    return { success: false, message: 'Failed to submit booking. Please try again.' };
  }
}

export async function updateBookingStatus(db: Firestore, bookingId: string, status: BookingStatus) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status });
      return { success: true, message: `Booking ${bookingId} updated.` };
    } catch (error) {
      console.error("Error updating booking status: ", error);
      return { success: false, message: 'Failed to update booking status.' };
    }
}

export async function deleteBooking(db: Firestore, bookingId: string) {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      return { success: true, message: `Booking ${bookingId} deleted.` };
    } catch (error) {
      console.error("Error deleting booking: ", error);
      return { success: false, message: 'Failed to delete booking.' };
    }
}

export async function updateBookingPayment(db: Firestore, bookingId: string, paymentStatus: PaymentStatus, paymentMethod: PaymentMethod) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { paymentStatus, paymentMethod });
      return { success: true, message: `Payment for booking ${bookingId} updated.` };
    } catch (error) {
      console.error("Error updating booking payment: ", error);
      return { success: false, message: 'Failed to update payment details.' };
    }
}

export async function setBookingAmount(db: Firestore, bookingId: string, amount: number) {
    if (isNaN(amount) || amount <= 0) {
        return { success: false, message: 'Please enter a valid amount.' };
    }
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { amount: Number(amount) });
      return { success: true, message: `Bill for booking ${bookingId} updated.` };
    } catch (error) {
      console.error("Error updating booking amount: ", error);
      return { success: false, message: 'Failed to update bill.' };
    }
}
