import { useCallback, useEffect, useState } from "react";
import {
  referralService,
  buildInviteSignupLink,
  type Referral,
  type ReferralStats,
  type PendingReferralRewards,
  type ShareMessageOutput,
} from "@/services/referralService/referralService";
import { showNotification } from "@/components";

export function useReferral(userId: number | null) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [shareMessage, setShareMessage] = useState<ShareMessageOutput | null>(null);
  const [pendingRewards, setPendingRewards] = useState<PendingReferralRewards | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [statsData, listData, shareData, rewardsData] = await Promise.all([
        referralService.getStats(userId),
        referralService.getReferrals(userId, { limit: 50 }),
        referralService.getShareMessage(userId).catch(() => null),
        referralService.getPendingRewards(userId).catch(() => null),
      ]);
      setStats(statsData);
      setReferrals(listData.referrals);
      setShareMessage(shareData);
      setPendingRewards(rewardsData);
    } catch {
      showNotification("Could not load invite data. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const ensureCode = useCallback(async () => {
    if (!userId) return null;
    if (stats?.referralCode) return stats.referralCode;
    setGenerating(true);
    try {
      const result = await referralService.generateCode(userId);
      await load();
      showNotification("Your invite code is ready!", "success");
      return result.referralCode;
    } catch {
      showNotification("Failed to generate invite code", "error");
      return null;
    } finally {
      setGenerating(false);
    }
  }, [userId, stats?.referralCode, load]);

  const inviteLink = stats?.referralCode
    ? buildInviteSignupLink(stats.referralCode)
    : null;

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification(`${label} copied!`, "success");
    } catch {
      showNotification("Could not copy — please copy manually", "warn");
    }
  }, []);

  const shareWhatsApp = useCallback(() => {
    if (!shareMessage?.message) return;
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage.message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [shareMessage]);

  const claimAllRewards = useCallback(async () => {
    if (!userId || !pendingRewards?.rewards.length) return;
    setClaiming(true);
    try {
      for (const reward of pendingRewards.rewards) {
        await referralService.claimReward(reward.referralId, userId, reward.rewardType);
      }
      showNotification("Premium days added to your account!", "success");
      await load();
    } catch {
      showNotification("Could not claim reward. Try again.", "error");
    } finally {
      setClaiming(false);
    }
  }, [userId, pendingRewards, load]);

  return {
    stats,
    referrals,
    shareMessage,
    pendingRewards,
    inviteLink,
    loading,
    generating,
    claiming,
    load,
    ensureCode,
    copyToClipboard,
    shareWhatsApp,
    claimAllRewards,
  };
}
