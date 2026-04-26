// ────────────────────────────────────────────────────────────
//  Rentify — Indian Localized Mock Data
//  All amounts in INR (₹), locations across Indian cities
// ────────────────────────────────────────────────────────────

/** Format a number in Indian style: 1,50,000 */
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/** Format date in Indian style: DD/MM/YYYY */
export const formatIndianDate = (dateStr) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const mockOwnerData = {
  analytics: {
    totalRevenue: 4250000,       // ₹42,50,000
    occupancyRate: 92,
    activeProperties: 12,
    pendingMaintenance: 3,
  },
  properties: [
    {
      id: 'p1',
      title: 'Oberoi Splendour, Andheri East',
      address: 'Jogeshwari-Vikhroli Link Rd, Andheri East, Mumbai - 400069',
      rent: 55000,               // ₹55,000/month
      status: 'occupied',
      tenant: 'Priya Sharma',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
      type: '3BHK',
    },
    {
      id: 'p2',
      title: 'Prestige Lake Ridge, Whitefield',
      address: 'EPIP Zone, Whitefield, Bengaluru - 560066',
      rent: 38000,               // ₹38,000/month
      status: 'vacant',
      tenant: null,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
      type: '2BHK',
    },
    {
      id: 'p3',
      title: 'DLF Capital Greens, Shivaji Marg',
      address: 'Shivaji Marg, Moti Nagar, New Delhi - 110015',
      rent: 42000,               // ₹42,000/month
      status: 'maintenance',
      tenant: 'Rahul Verma',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1e54823861?w=800&auto=format&fit=crop&q=60',
      type: '3BHK',
    },
  ],
  maintenanceRequests: [
    {
      id: 'm1',
      propertyId: 'p3',
      propertyTitle: 'DLF Capital Greens, Shivaji Marg',
      issue: 'Leaking pipeline in kitchen',
      status: 'pending',
      date: '20/04/2026',
      assignedStaff: { name: 'Ravi Kumar (Plumber)', rating: 4.8, phone: '+91 98765 43210' },
    },
    {
      id: 'm2',
      propertyId: 'p1',
      propertyTitle: 'Oberoi Splendour, Andheri East',
      issue: 'AC servicing & filter replacement',
      status: 'in-progress',
      date: '21/04/2026',
      assignedStaff: { name: 'Suresh Electricals', rating: 4.9, phone: '+91 91234 56789' },
    },
  ],
};

export const mockListings = [
  {
    id: 'l1',
    title: 'Luxury 3BHK Sea-Facing Flat',
    address: 'Marine Drive, Churchgate, Mumbai - 400020',
    rent: 95000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    type: '3BHK Flat',
    verified: true,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
    city: 'Mumbai',
  },
  {
    id: 'l2',
    title: 'Affordable 1BHK near Metro',
    address: 'Sector 18, Noida, Uttar Pradesh - 201301',
    rent: 14000,
    beds: 1,
    baths: 1,
    sqft: 620,
    type: '1BHK Flat',
    verified: true,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1e54823861?w=800&auto=format&fit=crop&q=60',
    city: 'Noida',
  },
  {
    id: 'l3',
    title: 'Spacious 2BHK in Koramangala',
    address: '5th Block, Koramangala, Bengaluru - 560095',
    rent: 32000,
    beds: 2,
    baths: 2,
    sqft: 1100,
    type: '2BHK Flat',
    verified: false,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
    city: 'Bengaluru',
  },
  {
    id: 'l4',
    title: 'Premium 2BHK with Gym & Pool',
    address: 'Banjara Hills, Road No. 12, Hyderabad - 500034',
    rent: 28000,
    beds: 2,
    baths: 2,
    sqft: 1250,
    type: '2BHK Flat',
    verified: true,
    image: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=800&auto=format&fit=crop&q=60',
    city: 'Hyderabad',
  },
  {
    id: 'l5',
    title: 'Independent Villa with Garden',
    address: 'Vasant Vihar, South Delhi, New Delhi - 110057',
    rent: 1,
    beds: 5,
    baths: 4,
    sqft: 4200,
    type: 'Villa',
    verified: true,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60',
    city: 'New Delhi',
  },
  {
    id: 'l6',
    title: 'Studio Flat near SG Highway',
    address: 'Bodakdev, SG Road, Ahmedabad - 380054',
    rent: 12000,
    beds: 1,
    baths: 1,
    sqft: 450,
    type: 'Studio',
    verified: true,
    image: 'https://images.unsplash.com/photo-1536376074432-bf12177d4f4f?w=800&auto=format&fit=crop&q=60',
    city: 'Ahmedabad',
  },
];

// Fix villa rent (missed assignment above)
mockListings[4].rent = 1,
mockListings[4].rent = 150000; // ₹1,50,000/month

// Simulated API calls
export const fetchOwnerDashboardData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOwnerData);
    }, 800);
  });
};

export const fetchListings = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockListings);
    }, 1000);
  });
};
