import {
    mockCampaigns,
    mockCreator,
    mockSubmissions,
    mockUserStats,
} from "@/constants/Data";
import {
    Campaign,
    Creator,
    FilterState,
    Submission,
    UserStats
} from "@/types";
import { create } from "zustand";

interface CreatorStore {
  // Data
  campaigns: Campaign[];
  submissions: Submission[];
  user: Creator;
  stats: UserStats;
  filters: FilterState;

  // Getters
  getFilteredCampaigns: () => Campaign[];
  getCampaignById: (id: string) => Campaign | undefined;
  getSubmissionsForCampaign: (campaignId: string) => Submission[];
  getSubmissionById: (id: string) => Submission | undefined;
  getCampaignsWithSubmissions: () => {
    campaign: Campaign;
    submissionCount: number;
  }[];
  getSortedSubmissions: () => Submission[];

  // Actions
  setFilters: (filters: Partial<FilterState>) => void;
  submitVideo: (
    campaignId: string,
    videoUrl: string,
    platform: "instagram" | "tiktok",
  ) => void;
  editSubmission: (submissionId: string, videoUrl: string) => void;
  updateUser: (userData: Partial<Creator>) => void;
  connectInstagram: () => void;
  connectTikTok: () => void;
  updateBankDetails: (bankDetails: Creator["bankDetails"]) => void;
  logout: () => void;
}

export const useCreatorStore = create<CreatorStore>((set, get) => ({
  // Initial data
  campaigns: mockCampaigns,
  submissions: mockSubmissions,
  user: mockCreator,
  stats: mockUserStats,
  filters: {
    sortBy: "deadline",
    order: "asc",
  },

  // Getters
  getFilteredCampaigns: () => {
    const { campaigns, filters } = get();
    const sorted = [...campaigns];

    sorted.sort((a, b) => {
      if (filters.sortBy === "deadline") {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return filters.order === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return filters.order === "asc"
          ? a.payoutPerVideo - b.payoutPerVideo
          : b.payoutPerVideo - a.payoutPerVideo;
      }
    });

    return sorted;
  },

  getCampaignById: (id: string) => {
    return get().campaigns.find((c) => c.id === id);
  },

  getSubmissionsForCampaign: (campaignId: string) => {
    return get().submissions.filter((s) => s.campaignId === campaignId);
  },

  getSubmissionById: (id: string) => {
    return get().submissions.find((s) => s.id === id);
  },

  getCampaignsWithSubmissions: () => {
    const { campaigns, submissions } = get();
    const campaignIds = [...new Set(submissions.map((s) => s.campaignId))];

    return campaignIds.map((id) => {
      const campaign = campaigns.find((c) => c.id === id)!;
      const submissionCount = submissions.filter(
        (s) => s.campaignId === id,
      ).length;
      return { campaign, submissionCount };
    });
  },

  getSortedSubmissions: () => {
    const { submissions } = get();
    return [...submissions].sort((a, b) => {
      return (
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    });
  },

  // Actions
  setFilters: (filters: Partial<FilterState>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  submitVideo: (
    campaignId: string,
    videoUrl: string,
    platform: "instagram" | "tiktok",
  ) => {
    const newSubmission: Submission = {
      id: `s${Date.now()}`,
      campaignId,
      videoUrl,
      status: "pending",
      submittedAt: new Date().toISOString(),
      platform,
    };

    set((state) => {
      const newSubmissions = [...state.submissions, newSubmission];
      const newStats = {
        ...state.stats,
        totalSubmissions: newSubmissions.length,
        pendingSubmissions: newSubmissions.filter((s) => s.status === "pending")
          .length,
      };

      // Update total campaigns if this is a new campaign
      const uniqueCampaigns = new Set(newSubmissions.map((s) => s.campaignId));
      newStats.totalCampaigns = uniqueCampaigns.size;

      return {
        submissions: newSubmissions,
        stats: newStats,
      };
    });
  },

  editSubmission: (submissionId: string, videoUrl: string) => {
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === submissionId ? { ...s, videoUrl, status: "pending" } : s,
      ),
    }));
  },

  updateUser: (userData: Partial<Creator>) => {
    set((state) => ({
      user: { ...state.user, ...userData },
    }));
  },

  connectInstagram: () => {
    set((state) => ({
      user: { ...state.user, instagramConnected: true },
    }));
  },

  connectTikTok: () => {
    set((state) => ({
      user: { ...state.user, tiktokConnected: true },
    }));
  },

  updateBankDetails: (bankDetails: Creator["bankDetails"]) => {
    set((state) => ({
      user: { ...state.user, bankDetails },
    }));
  },

  logout: () => {
    set({
      submissions: [],
      user: {
        ...mockCreator,
        instagramConnected: false,
        tiktokConnected: false,
      },
      stats: {
        totalSubmissions: 0,
        totalCampaigns: 0,
        approvedSubmissions: 0,
        pendingSubmissions: 0,
        rejectedSubmissions: 0,
        totalEarnings: 0,
      },
    });
  },
}));
