import { useState, useCallback } from "react";
import {
  feedService,
  type FeedItem,
  type FeedQuery,
} from "@/services/feedService/feedService";
import { showNotification } from "@/components";

export function useLocalFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadByPincode = useCallback(async (pincode: string, query?: FeedQuery) => {
    if (!query?.silent) setLoading(true);
    try {
      const data = await feedService.getLocalFeed(pincode, query);
      setItems(data.items);
      setTotal(data.total);
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load local feed";
      showNotification(message, "error");
    } finally {
      if (!query?.silent) setLoading(false);
    }
  }, []);

  return {
    items,
    total,
    loading,
    loadByPincode,
  };
}
