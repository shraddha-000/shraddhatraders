export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type VehicleType = 'Car' | 'SUV' | 'Truck' | 'Motorcycle';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending';
export type PaymentMethod = 'Cash' | 'Online' | 'N/A';

export type Booking = {
  id: string;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  serviceType: string;
  bookingDate: Date;
  status: BookingStatus;
  createdAt?: Date;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
};
