export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type VehicleType = 'Car' | 'SUV' | 'Truck' | 'Motorcycle';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export type Booking = {
  id: string;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  serviceType: string;
  bookingDate: Date;
  status: BookingStatus;
};
