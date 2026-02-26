# **App Name**: Shraddha Traders

## Core Features:

- Public Service Browsing: Users can view available services and general information about Shraddha Traders.
- Service Booking Form: Users can submit booking requests by providing vehicle type, service type, preferred date/time, and contact details with client-side validation.
- Booking Confirmation & Feedback: Provide instant visual feedback and success animations to users upon successful booking submission.
- User Booking History: Users can view a list of their past and upcoming bookings, including status and details.
- Admin Secure Login: Administrators can log in using email and password via Firebase Authentication to access management tools.
- Admin Bookings Dashboard: Display all submitted service bookings in a table, allowing filtering by service type, date, and current status.
- Admin Booking Management: Administrators can update booking statuses (e.g., Pending, Confirmed, Completed) and delete individual bookings from the system.
- Fully Responsive Interface: The application's UI adapts seamlessly across various devices and screen sizes, including mobile, tablet, and desktop.

## Style Guidelines:

- A modern, sleek dark theme built around three core colors: a deep, warm charcoal background (#1F1A15) for a sophisticated base, a vibrant orange (#FF8000) for primary interactive elements, and a bright, clear yellow (#FFDA26) as an accent for subtle highlights, all contributing to an energetic automotive feel.
- Headline and Body font: 'Inter', a clean, modern sans-serif typeface, providing excellent readability across all screen sizes and maintaining a neutral yet professional appearance for both informative text and user input.
- Utilize modern, clean line icons from free libraries like FontAwesome CDN to represent services, navigation items, and actions. Ensure icons complement the dark theme.
- Employ a mobile-first responsive design using Flexbox and Grid. Key elements like service cards and booking forms will use a Glassmorphism style, featuring frosted backgrounds, soft borders, and subtle internal shadows for depth, enhancing the modern feel without obscuring content.
- Implement smooth, subtle animations including CSS keyframes for fade-in/slide transitions, IntersectionObserver for scroll-reveal effects on content sections, card lift and hover effects, button ripple effects, and loading spinners during data operations. Ensure modal pop-ups open and close with fluid transitions and confirmation messages have engaging animations.