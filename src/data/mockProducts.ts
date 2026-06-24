export interface Product {
  id: string;
  title: string;
  description: string;
  category: 'Electronics' | 'Sports' | 'Event' | 'Home' | 'Educational' | 'Travel';
  brand: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  rentPerDay: number;
  securityDeposit: number;
  address: string;
  city: string;
  rating: number;
  reviewsCount: number;
  availability: 'Available' | 'Pending' | 'Rented';
  trustScore: number; // 0 - 100
  scamRisk: 'Low' | 'Medium' | 'High';
  scamReasons: string[];
  owner: {
    name: string;
    contact: string;
    rating: number;
    verified: boolean;
  };
  serialNumber: string;
  invoiceVerified: boolean;
  rentHistory: { year: number; price: number }[]; // Rent per day history over years
  gradientTheme: string;
  specifications: { label: string; value: string }[];
  conditionReport: string[];
  image: string; // Dynamic product image URL
}

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Sony Alpha 7 IV Mirrorless Camera',
    description: 'Ultra-high resolution professional mirrorless camera. Includes 28-70mm lens, 2x batteries, and high-speed SD card. Perfect for event photography or videography projects.',
    category: 'Electronics',
    brand: 'Sony',
    condition: 'Like New',
    rentPerDay: 300,
    securityDeposit: 6000,
    address: 'Andheri West, Link Road',
    city: 'Mumbai',
    rating: 4.9,
    reviewsCount: 38,
    availability: 'Available',
    trustScore: 98,
    scamRisk: 'Low',
    scamReasons: [
      'Seller bank account and Aadhaar verified.',
      'Serial number matches manufacturer database.',
      'Original purchase invoice verified.'
    ],
    owner: {
      name: 'Rohan Sharma',
      contact: '+91 98765 43210',
      rating: 4.8,
      verified: true
    },
    serialNumber: 'S-7402941-B',
    invoiceVerified: true,
    rentHistory: [
      { year: 2024, price: 250 },
      { year: 2025, price: 280 },
      { year: 2026, price: 300 }
    ],
    gradientTheme: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    specifications: [
      { label: 'Sensor Type', value: '33MP Full-Frame Exmor R CMOS' },
      { label: 'Video Resolution', value: '4K 60p 10-bit' },
      { label: 'Autofocus', value: 'Real-time Eye AF for Humans/Animals' }
    ],
    conditionReport: [
      'Lens element free of scratches and mold.',
      'All dials and toggle buttons operate smoothly.',
      'LCD screen has minor protective film wear.'
    ],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-2',
    title: 'DJI Mavic 3 Pro Drone Kit',
    description: 'Tri-camera flagship drone featuring Hasselblad main lens. Comes with RC controller, 3x batteries (Fly More Combo), and hard shell safety transit case.',
    category: 'Electronics',
    brand: 'DJI',
    condition: 'New',
    rentPerDay: 500,
    securityDeposit: 10000,
    address: 'HSR Layout, 17th Cross',
    city: 'Bangalore',
    rating: 4.8,
    reviewsCount: 15,
    availability: 'Available',
    trustScore: 95,
    scamRisk: 'Low',
    scamReasons: [
      'Listed by verified professional studio group.',
      'Drone registration details validated via DGCA portal.'
    ],
    owner: {
      name: 'Karan Mehra',
      contact: '+91 91234 56789',
      rating: 4.9,
      verified: true
    },
    serialNumber: 'DJI-MV3P-9921',
    invoiceVerified: true,
    rentHistory: [
      { year: 2024, price: 400 },
      { year: 2025, price: 450 },
      { year: 2026, price: 500 }
    ],
    gradientTheme: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
    specifications: [
      { label: 'Camera Quality', value: '4/3 CMOS Hasselblad + Dual Tele Cameras' },
      { label: 'Max Flight Time', value: '43 Minutes' },
      { label: 'Transmission Range', value: '15 km (O3+)' }
    ],
    conditionReport: [
      'Propellers checked and free of micro-cracks.',
      'Gimbal motor operates smoothly without noise.',
      'Batteries show less than 20 charging cycles.'
    ],
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-3',
    title: 'Decathlon Rockrider ST100 Cycle',
    description: 'Lightweight aluminum frame mountain cycle equipped with 21 gears, suspension forks, and custom wide grip offroad tires. Ideal for weekend trekking excursions.',
    category: 'Sports',
    brand: 'Decathlon',
    condition: 'Good',
    rentPerDay: 150,
    securityDeposit: 1500,
    address: 'Saket District Centre',
    city: 'Delhi',
    rating: 4.6,
    reviewsCount: 22,
    availability: 'Available',
    trustScore: 92,
    scamRisk: 'Low',
    scamReasons: [
      'Original purchase details verified from Decathlon profile.',
      'Lender matches local identity files.'
    ],
    owner: {
      name: 'Priya Verma',
      contact: '+91 88776 65544',
      rating: 4.5,
      verified: true
    },
    serialNumber: 'DEC-RR-02941',
    invoiceVerified: true,
    rentHistory: [
      { year: 2024, price: 120 },
      { year: 2025, price: 135 },
      { year: 2026, price: 150 }
    ],
    gradientTheme: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    specifications: [
      { label: 'Frame Size', value: 'Medium (Aluminum)' },
      { label: 'Gearbox', value: 'Shimano Tourney 21-Speed' },
      { label: 'Suspension', value: '80mm Front Suspension Fork' }
    ],
    conditionReport: [
      'Brake pads have 80% life remaining.',
      'Tire tread is optimal, chain lubricated.',
      'Minor cosmetic scratches on frame decals.'
    ],
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-4',
    title: 'Quechua Arpenaz 3-Person Tent',
    description: 'Easy-to-pitch camping tent with waterproof design and wind protection. Includes matching carry bag, ground sheets, and securing spikes.',
    category: 'Travel',
    brand: 'Quechua',
    condition: 'Good',
    rentPerDay: 90,
    securityDeposit: 900,
    address: 'Gachibowli, IT Corridor',
    city: 'Hyderabad',
    rating: 4.7,
    reviewsCount: 11,
    availability: 'Available',
    trustScore: 90,
    scamRisk: 'Low',
    scamReasons: [
      'Invoice verified.',
      'Lender verified with 4 successfully completed rentals.'
    ],
    owner: {
      name: 'Anish Reddy',
      contact: '+91 99887 76655',
      rating: 4.7,
      verified: true
    },
    serialNumber: 'QUE-TEN-7740',
    invoiceVerified: true,
    rentHistory: [
      { year: 2024, price: 70 },
      { year: 2025, price: 80 },
      { year: 2026, price: 90 }
    ],
    gradientTheme: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
    specifications: [
      { label: 'Capacity', value: '3 Persons' },
      { label: 'Waterproofing', value: '2000mm rating (Rainproof)' },
      { label: 'Pitch Type', value: 'Traditional pole setup' }
    ],
    conditionReport: [
      'Fabric clean, zipper sliders run smooth.',
      'No tears, punctures, or seam leaks detected.',
      'All 8 peg pegs and 2 poles accounted for.'
    ],
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-5',
    title: 'Pioneer DJ XZ Professional Mixer',
    description: 'All-in-one professional DJ system for events. Supports USB play, Link Export, and controller configuration for rekordbox. Stunning visual styling and output.',
    category: 'Event',
    brand: 'Pioneer',
    condition: 'Like New',
    rentPerDay: 750,
    securityDeposit: 15000,
    address: 'Bandra Reclamation',
    city: 'Mumbai',
    rating: 4.9,
    reviewsCount: 29,
    availability: 'Available',
    trustScore: 97,
    scamRisk: 'Low',
    scamReasons: [
      'Verified corporate event agency listing.',
      'Physical inspection completed by RentWise specialist.'
    ],
    owner: {
      name: 'Rohan Sharma',
      contact: '+91 98765 43210',
      rating: 4.8,
      verified: true
    },
    serialNumber: 'PIO-DJXZ-08312',
    invoiceVerified: true,
    rentHistory: [
      { year: 2024, price: 600 },
      { year: 2025, price: 680 },
      { year: 2026, price: 750 }
    ],
    gradientTheme: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
    specifications: [
      { label: 'Channels', value: '4-Channel Professional Layout' },
      { label: 'Screens', value: '7-inch LCD Touchscreen' },
      { label: 'Effects', value: '14 Beat FX & 6 Sound Color FX' }
    ],
    conditionReport: [
      'Faders, knobs, and pads tested and calibrated.',
      'Screen is crystal clear without dead pixels.',
      'Outputs (XLR and RCA) functional without hum.'
    ],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-6',
    title: 'Suspiciously Cheap DSLR Camera Scam',
    description: 'Sony DSLR camera available immediately. Rent price is extremely cheap due to urgent cash requirements. Renter must pay security deposit in cash or digital coupon before meeting.',
    category: 'Electronics',
    brand: 'Sony',
    condition: 'Fair',
    rentPerDay: 200,
    securityDeposit: 2000,
    address: 'Dharavi Slum Road',
    city: 'Mumbai',
    rating: 2.1,
    reviewsCount: 2,
    availability: 'Available',
    trustScore: 28,
    scamRisk: 'High',
    scamReasons: [
      'Daily rental cost (₹49) was 85% below average category rate (₹550).',
      'Seller demands upfront digital cash deposit before delivery or physical meet.',
      'Listing has no proof of ownership invoice uploaded.',
      'Seller profile flagged by 3 different renters for advance fee fraud.'
    ],
    owner: {
      name: 'Amit "No-Verify" Kumar',
      contact: '+91 99999 88888',
      rating: 1.5,
      verified: false
    },
    serialNumber: 'MOCK-SCAM-992',
    invoiceVerified: false,
    rentHistory: [
      { year: 2026, price: 200 }
    ],
    gradientTheme: 'linear-gradient(135deg, #111827 0%, #030712 100%)',
    specifications: [
      { label: 'Details', value: 'Mock Scam Listing' }
    ],
    conditionReport: [
      'Warning: Suspected fake listing.'
    ],
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-7',
    title: 'Dyson V12 Slim Vacuum Cleaner',
    description: 'Laser detects invisible dust. Powerful, lightweight cordless vacuum cleaner. Includes direct-drive cleaner head, laser slim fluffy head, and crevice accessories.',
    category: 'Home',
    brand: 'Dyson',
    condition: 'Like New',
    rentPerDay: 250,
    securityDeposit: 2500,
    address: 'Indiranagar, Double Road',
    city: 'Bangalore',
    rating: 4.8,
    reviewsCount: 14,
    availability: 'Available',
    trustScore: 94,
    scamRisk: 'Low',
    scamReasons: [
      'Seller profile validated.',
      'Serial numbers match official Dyson warranty database.'
    ],
    owner: {
      name: 'Karan Mehra',
      contact: '+91 91234 56789',
      rating: 4.9,
      verified: true
    },
    serialNumber: 'DYS-V12S-8821',
    invoiceVerified: true,
    rentHistory: [
      { year: 2024, price: 200 },
      { year: 2025, price: 220 },
      { year: 2026, price: 250 }
    ],
    gradientTheme: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
    specifications: [
      { label: 'Suction Power', value: '150 Air Watts' },
      { label: 'Runtime', value: 'Up to 60 Minutes' },
      { label: 'Weight', value: '2.2 kg Superlight' }
    ],
    conditionReport: [
      'Filter washed and completely clean.',
      'Suction motor operates at 100% capacity.',
      'All 4 attachment heads clean and operational.'
    ],
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-8',
    title: 'Creality Ender 3 V2 3D Printer',
    description: 'High-precision DIY 3D printer with silent motherboard, glass print platform, and easy-feed rotary knob. Includes 500g PLA filament spool.',
    category: 'Educational',
    brand: 'Creality',
    condition: 'Good',
    rentPerDay: 200,
    securityDeposit: 2000,
    address: 'Kalyani Nagar, East Ave',
    city: 'Pune',
    rating: 4.7,
    reviewsCount: 9,
    availability: 'Available',
    trustScore: 91,
    scamRisk: 'Low',
    scamReasons: [
      'Registered university maker-club account.',
      'Invoice verified by admin check.'
    ],
    owner: {
      name: 'Siddharth Joshi',
      contact: '+91 97766 55443',
      rating: 4.6,
      verified: true
    },
    serialNumber: 'CRE-3DV2-984',
    invoiceVerified: true,
    rentHistory: [
      { year: 2024, price: 160 },
      { year: 2025, price: 180 },
      { year: 2026, price: 200 }
    ],
    gradientTheme: 'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
    specifications: [
      { label: 'Print Size', value: '220 x 220 x 250 mm' },
      { label: 'Filament Type', value: '1.75mm PLA, TPU, PETG' },
      { label: 'Nozzle Temperature', value: 'Up to 250°C' }
    ],
    conditionReport: [
      'Print bed leveled and completely flat.',
      'Hotend nozzle clean and free of blockage.',
      'XYZ axes belts tightened and calibrated.'
    ],
    image: 'https://images.unsplash.com/photo-1615840287214-7fe58a8f3685?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-9',
    title: 'Yonex Astrox 99 Pro Badminton Racket',
    description: 'Professional head-heavy badminton racket optimized for aggressive smashing. strung with BG65 Titanium string at 26 lbs tension. Includes protective carrying case.',
    category: 'Sports',
    brand: 'Yonex',
    condition: 'Like New',
    rentPerDay: 50,
    securityDeposit: 500,
    address: 'Indiranagar, Double Road',
    city: 'Bangalore',
    rating: 4.8,
    reviewsCount: 16,
    availability: 'Available',
    trustScore: 96,
    scamRisk: 'Low',
    scamReasons: [
      'Lender matches Yonex club player registry.',
      'Invoice validation matches purchase date.'
    ],
    owner: {
      name: 'Karan Mehra',
      contact: '+91 91234 56789',
      rating: 4.9,
      verified: true
    },
    serialNumber: 'YNX-AX99P-803',
    invoiceVerified: true,
    rentHistory: [
      { year: 2025, price: 45 },
      { year: 2026, price: 50 }
    ],
    gradientTheme: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
    specifications: [
      { label: 'Weight/Grip Size', value: '4U (Avg. 83g) G5' },
      { label: 'Flex', value: 'Stiff' },
      { label: 'Frame Material', value: 'HM Graphite + Namd' }
    ],
    conditionReport: [
      'Frame checked, zero micro-fractures present.',
      'Grommets are clean, string tension is checked.',
      'Original grip replaced with fresh Yonex overgrip.'
    ],
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-10',
    title: 'Quechua Hiking Backpack 70L',
    description: 'Heavy duty, ergonomically adjustable trekking backpack. Features multiple compartments, rainproof cover, and side water-bottle pockets. Perfect for long Himalayan treks.',
    category: 'Sports',
    brand: 'Quechua',
    condition: 'Good',
    rentPerDay: 40,
    securityDeposit: 400,
    address: 'Saket District Centre',
    city: 'Delhi',
    rating: 4.7,
    reviewsCount: 14,
    availability: 'Available',
    trustScore: 92,
    scamRisk: 'Low',
    scamReasons: [
      'Lender identity and address checked.',
      'Successfully completed 8 previous rental cycles.'
    ],
    owner: {
      name: 'Priya Verma',
      contact: '+91 88776 65544',
      rating: 4.5,
      verified: true
    },
    serialNumber: 'QUE-BP-70L-921',
    invoiceVerified: true,
    rentHistory: [
      { year: 2025, price: 35 },
      { year: 2026, price: 40 }
    ],
    gradientTheme: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
    specifications: [
      { label: 'Capacity', value: '70 Litres' },
      { label: 'Weight', value: '1.9 kg' },
      { label: 'Back Adjustment', value: 'Easy-Fit Technology' }
    ],
    conditionReport: [
      'Zippers verified, all slide smoothly.',
      'No punctures or fraying on the harness straps.',
      'Integrated rain cover present in the bottom pocket.'
    ],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-11',
    title: 'Cosco Full Cricket Kit Bag Set',
    description: 'Complete premium leather ball cricket kit. Includes Kashmir Willow bat, leg guards, batting gloves, helmet, thigh guards, and a spacious kit bag with wheels.',
    category: 'Sports',
    brand: 'Cosco',
    condition: 'Good',
    rentPerDay: 120,
    securityDeposit: 1200,
    address: 'Andheri West, Link Road',
    city: 'Mumbai',
    rating: 4.7,
    reviewsCount: 20,
    availability: 'Available',
    trustScore: 94,
    scamRisk: 'Low',
    scamReasons: [
      'Lender bank and UPI verified.',
      'Matches Cosco brand code database.'
    ],
    owner: {
      name: 'Rohan Sharma',
      contact: '+91 98765 43210',
      rating: 4.8,
      verified: true
    },
    serialNumber: 'CSC-CKT-8821',
    invoiceVerified: true,
    rentHistory: [
      { year: 2025, price: 100 },
      { year: 2026, price: 120 }
    ],
    gradientTheme: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
    specifications: [
      { label: 'Willow Type', value: 'Grade-A Kashmir Willow' },
      { label: 'Size', value: 'Full Size (Men\'s)' },
      { label: 'Bag Type', value: 'Wheeled Duffle Bag' }
    ],
    conditionReport: [
      'Bat is pre-knocked and ready for leather ball play.',
      'Pads and helmet show light scuffs but offer solid protection.',
      'All buckles, straps, and zippers are intact.'
    ],
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-12',
    title: 'Decathlon Dumbbells Set (20kg)',
    description: 'Adjustable cast iron dumbbells kit (2x 10kg). Includes 4x 2.5kg plates, 4x 1.25kg plates, 2x threaded bars, and 4x spinlock collars. Stored in a compact travel case.',
    category: 'Sports',
    brand: 'Decathlon',
    condition: 'New',
    rentPerDay: 80,
    securityDeposit: 800,
    address: 'Kalyani Nagar, East Ave',
    city: 'Pune',
    rating: 4.9,
    reviewsCount: 11,
    availability: 'Available',
    trustScore: 95,
    scamRisk: 'Low',
    scamReasons: [
      'Lender has 100% positive return ratings.',
      'Dumbbell weights match calibration scales.'
    ],
    owner: {
      name: 'Siddharth Joshi',
      contact: '+91 97766 55443',
      rating: 4.6,
      verified: true
    },
    serialNumber: 'DEC-DB-20K-102',
    invoiceVerified: true,
    rentHistory: [
      { year: 2025, price: 70 },
      { year: 2026, price: 80 }
    ],
    gradientTheme: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    specifications: [
      { label: 'Total Weight', value: '20 kg (Pair)' },
      { label: 'Material', value: 'Chrome plated Steel & Cast Iron' },
      { label: 'Case Dimensions', value: '45 x 28 x 12 cm' }
    ],
    conditionReport: [
      'Cast iron plates are clean, zero rust.',
      'Threading on bars is flawless, spinlocks secure weights perfectly.',
      'Heavy-duty plastic carrying case is intact.'
    ],
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-13',
    title: 'Lifelong Foldable Motorized Treadmill',
    description: 'Compact motorized home treadmill with LCD display, 12 preset workout programs, and heart rate sensor. Ideal for home cardio sessions.',
    category: 'Sports',
    brand: 'Lifelong',
    condition: 'Like New',
    rentPerDay: 750,
    securityDeposit: 15000,
    address: 'Gachibowli, IT Corridor',
    city: 'Hyderabad',
    rating: 4.8,
    reviewsCount: 19,
    availability: 'Available',
    trustScore: 96,
    scamRisk: 'Low',
    scamReasons: [
      'Lender profile validated.',
      'Original purchase invoice verified by admin checks.'
    ],
    owner: {
      name: 'Anish Reddy',
      contact: '+91 99887 76655',
      rating: 4.7,
      verified: true
    },
    serialNumber: 'LL-TM-9821',
    invoiceVerified: true,
    rentHistory: [
      { year: 2024, price: 650 },
      { year: 2025, price: 700 },
      { year: 2026, price: 750 }
    ],
    gradientTheme: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    specifications: [
      { label: 'Motor Power', value: '2.5 HP Peak' },
      { label: 'Max Weight', value: '100 kg' },
      { label: 'Speed Range', value: '1-12 km/h' }
    ],
    conditionReport: [
      'Running belt centered and lubricated.',
      'Console controls and heart rate sensor fully functional.'
    ],
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-14',
    title: 'Spalding NBA Highlight Basketball',
    description: 'High-durability outdoor rubber basketball with deep channels for optimal grip. Perfect for streetball or court training.',
    category: 'Sports',
    brand: 'Spalding',
    condition: 'New',
    rentPerDay: 100,
    securityDeposit: 1000,
    address: 'Indiranagar, Double Road',
    city: 'Bangalore',
    rating: 4.9,
    reviewsCount: 31,
    availability: 'Available',
    trustScore: 97,
    scamRisk: 'Low',
    scamReasons: [
      'Matches Spalding store registry.',
      'Seller verified with 15 completed transactions.'
    ],
    owner: {
      name: 'Karan Mehra',
      contact: '+91 91234 56789',
      rating: 4.9,
      verified: true
    },
    serialNumber: 'SPD-BB-8891',
    invoiceVerified: true,
    rentHistory: [
      { year: 2025, price: 90 },
      { year: 2026, price: 100 }
    ],
    gradientTheme: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    specifications: [
      { label: 'Ball Size', value: 'Official Size 7' },
      { label: 'Material', value: 'Composite Rubber' }
    ],
    conditionReport: [
      'Air pressure is optimal.',
      'Outer grip is pristine and unworn.'
    ],
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-15',
    title: 'Nivia Pro Carbon Table Tennis Set',
    description: 'Pair of professional carbon fiber table tennis paddles with 3 premium 3-star balls and a portable storage case. High speed and spin performance.',
    category: 'Sports',
    brand: 'Nivia',
    condition: 'New',
    rentPerDay: 120,
    securityDeposit: 1200,
    address: 'Saket District Centre',
    city: 'Delhi',
    rating: 4.7,
    reviewsCount: 8,
    availability: 'Available',
    trustScore: 93,
    scamRisk: 'Low',
    scamReasons: [
      'Invoice details verified by administrator.',
      'Seller has positive feedback.'
    ],
    owner: {
      name: 'Priya Verma',
      contact: '+91 88776 65544',
      rating: 4.5,
      verified: true
    },
    serialNumber: 'NIV-TT-0821',
    invoiceVerified: true,
    rentHistory: [
      { year: 2025, price: 110 },
      { year: 2026, price: 120 }
    ],
    gradientTheme: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
    specifications: [
      { label: 'Blade Material', value: '5-ply wood + 2-ply carbon' },
      { label: 'Rubber Type', value: 'Nivia SpinMax rubber' }
    ],
    conditionReport: [
      'Rubber surfaces are sticky and clean.',
      'Carry case zipper is fully functional.'
    ],
    image: 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?auto=format&fit=crop&w=800&q=80'
  }
];
