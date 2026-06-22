"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderTracking } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function TrackingForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      const result = await updateOrderTracking(orderId, {
        courier,
        tracking_number: trackingNumber,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.refresh();
      setLoading(false);
    },
    [orderId, courier, trackingNumber, router],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="border border-destructive bg-error-container px-3 py-2 font-body-md text-body-md text-on-error-container">
          {error}
        </div>
      )}
      <div>
        <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-1">
          Courier
        </label>
        <select
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
          required
          className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-2 font-body-md text-body-md text-primary outline-none focus:border-accent-gold transition-colors"
        >
          <option value="">Select courier</option>
          <option value="JNE">JNE</option>
          <option value="J&T">J&T</option>
          <option value="SiCepat">SiCepat</option>
          <option value="GoSend">GoSend</option>
          <option value="GrabExpress">GrabExpress</option>
          <option value="DHL">DHL</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-1">
          Tracking Number
        </label>
        <input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          required
          className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-2 font-body-md text-body-md text-primary outline-none focus:border-accent-gold transition-colors"
        />
      </div>
      <Button type="submit" variant="default" size="sm" disabled={loading}>
        {loading ? "Updating..." : "Mark as Shipped"}
      </Button>
    </form>
  );
}
