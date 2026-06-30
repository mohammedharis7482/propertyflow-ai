import { Property } from "@/types/property";

export const featuredProperties: Property[] = [
  {
    id: "1",
    slug: "palm-view-residence",
    title: "Palm View Residence",
    location: "Palm Jumeirah, Dubai",
    price: "AED 4.8M",
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    beds: 4,
    baths: 5,
    area: "3,800 sqft",
    type: "Luxury Villa",
    featured: true,
    description:
      "A premium villa residence located in Palm Jumeirah, designed for luxury living with spacious interiors, modern architecture, high-end finishes, and strong lifestyle value.",
    amenities: [
      "Private Parking",
      "Sea View",
      "Smart Home",
      "Swimming Pool",
      "Security",
      "Gym Access",
    ],
  },
  {
    id: "2",
    slug: "marina-sky-apartment",
    title: "Marina Sky Apartment",
    location: "Dubai Marina, UAE",
    price: "AED 2.2M",
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    beds: 3,
    baths: 3,
    area: "1,950 sqft",
    type: "Apartment",
    description:
      "A refined waterfront apartment in Dubai Marina offering premium interiors, skyline views, lifestyle convenience, and excellent access to retail, dining, and leisure destinations.",
    amenities: [
      "Marina View",
      "Covered Parking",
      "Balcony",
      "Gym Access",
      "Concierge",
      "24/7 Security",
    ],
  },
  {
    id: "3",
    slug: "downtown-executive-home",
    title: "Downtown Executive Home",
    location: "Downtown Dubai, UAE",
    price: "AED 18K/mo",
    status: "For Rent",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    beds: 2,
    baths: 2,
    area: "1,420 sqft",
    type: "Premium Apartment",
    description:
      "A modern executive apartment in Downtown Dubai, ideal for professionals seeking premium comfort, city connectivity, and access to high-end lifestyle amenities.",
    amenities: [
      "City View",
      "Furnished",
      "Smart Access",
      "Parking",
      "Pool Access",
      "Near Metro",
    ],
  },
  {
    id: "4",
    slug: "dubai-hills-family-villa",
    title: "Dubai Hills Family Villa",
    location: "Dubai Hills, UAE",
    price: "AED 5.6M",
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop",
    beds: 5,
    baths: 6,
    area: "4,600 sqft",
    type: "Family Villa",
    description:
      "A spacious family villa in Dubai Hills designed for peaceful community living, with generous interiors, outdoor spaces, and strong long-term residential value.",
    amenities: [
      "Private Garden",
      "Maid Room",
      "Covered Parking",
      "Community Park",
      "Security",
      "Family Lounge",
    ],
  },
  {
    id: "5",
    slug: "business-bay-office-suite",
    title: "Business Bay Office Suite",
    location: "Business Bay, Dubai",
    price: "AED 240K/yr",
    status: "For Rent",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    beds: 0,
    baths: 2,
    area: "2,200 sqft",
    type: "Commercial Office",
    description:
      "A premium office suite in Business Bay built for modern companies, offering a professional address, flexible workspace, and strong business district connectivity.",
    amenities: [
      "Reception Area",
      "Meeting Rooms",
      "Parking",
      "High-Speed Internet",
      "Security",
      "Business District",
    ],
  },
  {
    id: "6",
    slug: "doha-west-bay-residence",
    title: "Doha West Bay Residence",
    location: "West Bay, Doha",
    price: "QAR 1.9M",
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1200&auto=format&fit=crop",
    beds: 3,
    baths: 4,
    area: "2,100 sqft",
    type: "Waterfront Apartment",
    description:
      "A premium waterfront apartment in Doha West Bay with elegant interiors, strong location value, and convenient access to business, lifestyle, and hospitality zones.",
    amenities: [
      "Waterfront View",
      "Balcony",
      "Gym Access",
      "Covered Parking",
      "Concierge",
      "Security",
    ],
  },
];

export const allProperties = featuredProperties;