import type { Service, Booking } from './types';
import { add } from 'date-fns';

export const services: Service[] = [
  {
    id: 'ppf',
    title: 'PPF (Paint Protection Film)',
    description: "Protect your vehicle's paint from scratches, chips, and stains with our high-quality film.",
    icon: 'ShieldCheck',
  },
  {
    id: 'car-wash',
    title: 'Car Wash',
    description: 'A thorough exterior wash and dry, leaving your car spotless and gleaming.',
    icon: 'Car',
  },
  {
    id: 'bike-wash',
    title: 'Bike Wash',
    description: 'A special wash for your bike to make it look brand new.',
    icon: 'Bike',
  },
  {
    id: 'spare-parts',
    title: 'Spare Parts',
    description: 'We provide genuine spare parts for your vehicle.',
    icon: 'Cog',
  },
  {
    id: 'bike-maintenance',
    title: 'Bike Maintenance',
    description: 'Complete maintenance service to keep your bike running smoothly.',
    icon: 'Wrench',
  },
  {
    id: 'car-maintenance',
    title: 'Car Maintenance',
    description: 'Get your car serviced by our expert mechanics.',
    icon: 'CarFront',
  },
  {
    id: 'engine-work',
    title: 'Engine Work',
    description: 'Expert engine diagnostics and repair services.',
    icon: 'Settings',
  },
  {
    id: 'puncture-repair',
    title: 'Puncture Repair',
    description: 'Quick and reliable puncture repair to get you back on the road.',
    icon: 'Construction',
  },
  {
    id: 'wheel-alignment',
    title: 'Wheel Alignment',
    description: 'Precision wheel alignment for better handling and tire life.',
    icon: 'Disc',
  },
];

export const bookings: Booking[] = [
  {
    id: 'BK001',
    name: 'John Doe',
    phone: '123-456-7890',
    vehicleType: 'Car',
    serviceType: 'Car Maintenance',
    bookingDate: add(new Date(), { days: 2, hours: 3 }),
    status: 'Confirmed',
  },
  {
    id: 'BK002',
    name: 'Jane Smith',
    phone: '098-765-4321',
    vehicleType: 'SUV',
    serviceType: 'Wheel Alignment',
    bookingDate: add(new Date(), { days: -1, hours: 1 }),
    status: 'Completed',
  },
  {
    id: 'BK003',
    name: 'Sam Wilson',
    phone: '555-555-5555',
    vehicleType: 'Truck',
    serviceType: 'Engine Work',
    bookingDate: add(new Date(), { days: 4 }),
    status: 'Pending',
  },
  {
    id: 'BK004',
    name: 'Alice Johnson',
    phone: '111-222-3333',
    vehicleType: 'Motorcycle',
    serviceType: 'Bike Wash',
    bookingDate: add(new Date(), { days: -5 }),
    status: 'Completed',
  },
  {
    id: 'BK005',
    name: 'Bob Brown',
    phone: '444-333-2222',
    vehicleType: 'Car',
    serviceType: 'PPF (Paint Protection Film)',
    bookingDate: add(new Date(), { days: 10 }),
    status: 'Pending',
  },
    {
    id: 'BK006',
    name: 'Chris Green',
    phone: '777-888-9999',
    vehicleType: 'SUV',
    serviceType: 'Car Wash',
    bookingDate: add(new Date(), { days: -10 }),
    status: 'Cancelled',
  },
];
