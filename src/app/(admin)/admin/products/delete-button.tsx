"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { softDeleteProduct } from "@/lib/actions/admin";

export function DeleteButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = useCallback(async () => {
    const result = await softDeleteProduct(productId);
    if (result.error) {
      alert(result.error);
      return;
    }
    setConfirming(false);
    router.refresh();
  }, [productId, router]);

  if (confirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-[11px] bg-error text-on-error font-label-sm uppercase tracking-widest"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-[11px] border border-border text-text-muted font-label-sm uppercase tracking-widest"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-2 text-text-muted hover:text-error transition-colors"
      title="Delete product"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
