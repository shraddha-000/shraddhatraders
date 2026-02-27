'use client';

import { addDoc, collection, doc, updateDoc, deleteDoc, serverTimestamp, type Firestore } from "firebase/firestore";
import type { Booking, BookingStatus, PaymentMethod, PaymentStatus } from "./types";

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
      return { success: true, message: `Booking status updated to ${status}.` };
    } catch (error) {
      console.error("Error updating booking status: ", error);
      return { success: false, message: 'Failed to update booking status.' };
    }
}

export async function deleteBooking(db: Firestore, bookingId: string) {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      return { success: true, message: `Booking has been deleted.` };
    } catch (error) {
      console.error("Error deleting booking: ", error);
      return { success: false, message: 'Failed to delete booking.' };
    }
}

export async function updateBookingPayment(db: Firestore, bookingId: string, paymentStatus: PaymentStatus, paymentMethod: PaymentMethod) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { paymentStatus, paymentMethod });
      return { success: true, message: `Payment details have been updated.` };
    } catch (error) {
      console.error("Error updating booking payment: ", error);
      return { success: false, message: 'Failed to update payment details.' };
    }
}

export async function setBookingAmount(db: Firestore, bookingId: string, amount: number) {
    try {
        const bookingRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingRef, { amount });
        return { success: true, message: `Bill amount set to ₹${amount}.` };
    } catch (error) {
        console.error("Error setting booking amount: ", error);
        return { success: false, message: 'Failed to set bill amount.' };
    }
}
