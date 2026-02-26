import type { Service, Booking } from './types';
import { add } from 'date-fns';

export const services: Service[] = [
  {
    id: 'car-wash',
    title: 'Premium Car Wash',
    description: 'A thorough exterior wash and dry, leaving your car spotless and gleaming.',
    imageId: 'car-wash',
  },
  {
    id: 'detailing',
    title: 'Interior Detailing',
    description: 'Deep cleaning of the interior, including vacuuming, upholstery cleaning, and dashboard polishing.',
    imageId: 'detailing',
  },
  {
    id: 'ceramic-coating',
    title: 'Ceramic Coating',
    description: 'Application of a long-lasting ceramic coat for ultimate paint protection and a mirror-like shine.',
    imageId: 'ceramic-coating',
  },
  {
    id: 'paint-protection',
    title: 'Paint Protection Film',
    description: "Protect your vehicle's paint from scratches, chips, and stains with our high-quality film.",
    imageId: 'paint-protection',
  },
];

export const bookings: Booking[] = [
  {
    id: 'BK001',
    name: 'John Doe',
    phone: '123-456-7890',
    vehicleType: 'Car',
    serviceType: 'Ceramic Coating',
    bookingDate: add(new Date(), { days: 2, hours: 3 }),
    status: 'Confirmed',
  },
  {
    id: 'BK002',
    name: 'Jane Smith',
    phone: '098-765-4321',
    vehicleType: 'SUV',
    serviceType: 'Premium Car Wash',
    bookingDate: add(new Date(), { days: -1, hours: 1 }),
    status: 'Completed',
  },
  {
    id: 'BK003',
    name: 'Sam Wilson',
    phone: '555-555-5555',
    vehicleType: 'Truck',
    serviceType: 'Interior Detailing',
    bookingDate: add(new Date(), { days: 4 }),
    status: 'Pending',
  },
  {
    id: 'BK004',
    name: 'Alice Johnson',
    phone: '111-222-3333',
    vehicleType: 'Motorcycle',
    serviceType: 'Premium Car Wash',
    bookingDate: add(new Date(), { days: -5 }),
    status: 'Completed',
  },
  {
    id: 'BK005',
    name: 'Bob Brown',
    phone: '444-333-2222',
    vehicleType: 'Car',
    serviceType: 'Paint Protection Film',
    bookingDate: add(new Date(), { days: 10 }),
    status: 'Pending',
  },
    {
    id: 'BK006',
    name: 'Chris Green',
    phone: '777-888-9999',
    vehicleType: 'SUV',
    serviceType: 'Ceramic Coating',
    bookingDate: add(new Date(), { days: -10 }),
    status: 'Cancelled',
  },
];
