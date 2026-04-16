import { Campaign, Creator, Submission, UserStats } from "@/types";

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    brandName: "Nike",
    brandImage: "https://logo.clearbit.com/nike.com",
    payoutPerVideo: 500,
    deadline: "2026-05-20",
    maxVideos: 3,
    brief:
      "Create an energetic video showcasing Nike Air Max shoes in your daily workout routine. Highlight comfort, style, and performance.",
    exampleVideos: [
      "https://example.com/nike-demo-1",
      "https://example.com/nike-demo-2",
    ],
    requirements: [
      "Minimum 30 seconds",
      "Show product clearly",
      "Use hashtag #NikeAirMax",
    ],
  },
  {
    id: "2",
    brandName: "Sephora",
    brandImage: "https://logo.clearbit.com/sephora.com",
    payoutPerVideo: 350,
    deadline: "2026-04-25",
    maxVideos: 2,
    brief:
      'Showcase your favorite Sephora beauty products in a "Get Ready With Me" style video. Focus on natural, everyday looks.',
    exampleVideos: ["https://example.com/sephora-demo-1"],
    requirements: [
      "Show before/after",
      "Mention product names",
      "Tag @Sephora",
    ],
  },
  {
    id: "3",
    brandName: "Gymshark",
    brandImage: "https://logo.clearbit.com/gymshark.com",
    payoutPerVideo: 400,
    deadline: "2026-05-10",
    maxVideos: 4,
    brief:
      "Create a fitness motivation video wearing Gymshark apparel. Show your workout routine and inspire others.",
    exampleVideos: [
      "https://example.com/gymshark-demo-1",
      "https://example.com/gymshark-demo-2",
    ],
    requirements: [
      "Wear Gymshark clothing",
      "High energy",
      "Include workout tips",
    ],
  },
  {
    id: "4",
    brandName: "Starbucks",
    brandImage: "https://logo.clearbit.com/starbucks.com",
    payoutPerVideo: 200,
    deadline: "2026-04-20",
    maxVideos: 2,
    brief:
      "Share your Starbucks moment - morning coffee routine, study session, or catch-up with friends. Keep it authentic and relatable.",
    exampleVideos: ["https://example.com/starbucks-demo-1"],
    requirements: [
      "Show Starbucks cup/logo",
      "Authentic moments",
      "Positive vibes",
    ],
  },
  {
    id: "5",
    brandName: "Apple",
    brandImage: "https://logo.clearbit.com/apple.com",
    payoutPerVideo: 800,
    deadline: "2026-06-01",
    maxVideos: 2,
    brief:
      "Create a creative video showcasing iPhone 16 camera capabilities. Focus on photography, videography, or creative editing features.",
    exampleVideos: [
      "https://example.com/apple-demo-1",
      "https://example.com/apple-demo-2",
    ],
    requirements: [
      "Shot on iPhone 16",
      "Show camera features",
      "High quality content",
    ],
  },
  {
    id: "6",
    brandName: "Adidas",
    brandImage: "https://logo.clearbit.com/adidas.com",
    payoutPerVideo: 450,
    deadline: "2026-05-05",
    maxVideos: 3,
    brief:
      "Showcase Adidas Originals in your street style look. Urban, trendy, and authentic to your personal style.",
    exampleVideos: ["https://example.com/adidas-demo-1"],
    requirements: [
      "Street style focus",
      "Urban setting",
      "Use #AdidasOriginals",
    ],
  },
  {
    id: "7",
    brandName: "L'Oreal",
    brandImage: "https://logo.clearbit.com/loreal.com",
    payoutPerVideo: 300,
    deadline: "2026-04-30",
    maxVideos: 2,
    brief:
      "Create a hair care routine video featuring L'Oreal products. Show transformation and healthy hair results.",
    exampleVideos: ["https://example.com/loreal-demo-1"],
    requirements: [
      "Show product usage",
      "Before/after shots",
      "Genuine review",
    ],
  },
  {
    id: "8",
    brandName: "Coca-Cola",
    brandImage: "https://logo.clearbit.com/coca-cola.com",
    payoutPerVideo: 250,
    deadline: "2026-04-18",
    maxVideos: 5,
    brief:
      "Capture refreshing moments with Coca-Cola. Summer vibes, friends gathering, or enjoying a cold drink.",
    exampleVideos: [
      "https://example.com/coke-demo-1",
      "https://example.com/coke-demo-2",
    ],
    requirements: [
      "Show Coca-Cola product",
      "Fun atmosphere",
      "Shareable moments",
    ],
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: "s1",
    campaignId: "2",
    videoUrl: "https://instagram.com/p/sephora-demo",
    status: "approved",
    submittedAt: "2026-04-10T10:30:00Z",
    platform: "instagram",
  },
  {
    id: "s2",
    campaignId: "4",
    videoUrl: "https://tiktok.com/@user/starbucks-video",
    status: "pending",
    submittedAt: "2026-04-12T14:20:00Z",
    platform: "tiktok",
  },
  {
    id: "s3",
    campaignId: "6",
    videoUrl: "https://instagram.com/p/adidas-street",
    status: "rejected",
    submittedAt: "2026-04-08T09:15:00Z",
    platform: "instagram",
  },
  {
    id: "s4",
    campaignId: "2",
    videoUrl: "https://tiktok.com/@user/sephora-grwm",
    status: "pending",
    submittedAt: "2026-04-14T16:45:00Z",
    platform: "tiktok",
  },
];

export const mockCreator: Creator = {
  id: "c1",
  name: "Theo Bui",
  email: "theo@8x.social",
  phone: "+1 4155550100",
  avatar: require("@/assets/images/theo-bui.webp"),
  instagramConnected: true,
  tiktokConnected: false,
  bankDetails: {
    accountNumber: "****4567",
    routingNumber: "****8901",
    accountName: "Theo Bui",
  },
};

export const mockUserStats: UserStats = {
  totalSubmissions: 4,
  totalCampaigns: 3,
  approvedSubmissions: 1,
  pendingSubmissions: 2,
  rejectedSubmissions: 1,
  totalEarnings: 350,
};
