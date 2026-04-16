export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Campaign {
  id: string;
  brandName: string;
  brandImage: string;
  payoutPerVideo: number;
  deadline: string;
  maxVideos: number;
  brief: string;
  exampleVideos: string[];
  requirements: string[];
}

export interface Submission {
  id: string;
  campaignId: string;
  videoUrl: string;
  status: SubmissionStatus;
  submittedAt: string;
  platform: "instagram" | "tiktok";
}

export interface Creator {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  instagramConnected: boolean;
  tiktokConnected: boolean;
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    accountName: string;
  };
}

export interface UserStats {
  totalSubmissions: number;
  totalCampaigns: number;
  approvedSubmissions: number;
  pendingSubmissions: number;
  rejectedSubmissions: number;
  totalEarnings: number;
}

export type SortBy = "deadline" | "payout";
export type SortOrder = "asc" | "desc";

export interface FilterState {
  sortBy: SortBy;
  order: SortOrder;
}
