"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteRsvp } from "./actions";
import { useRouter } from "next/navigation";

export function DeleteButton({
  inviteId,
  label,
}: {
  inviteId: string;
  label: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!confirming) {
    return (
      <Button
        variant="outline"
        className="w-full text-destructive hover:text-destructive"
        onClick={() => setConfirming(true)}
      >
        Delete RSVP
      </Button>
    );
  }

  return (
    <div className="space-y-2 border border-destructive/30 rounded-sm p-4">
      <p className="text-sm">
        Are you sure you want to delete{" "}
        <span className="font-medium">{label}</span>? This will hide
        the RSVP from the admin table. It can be recovered from the database.
      </p>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          disabled={deleting}
          onClick={async () => {
            setDeleting(true);
            await deleteRsvp(inviteId);
            router.push("/admin");
          }}
        >
          {deleting ? "Deleting..." : "Yes, delete"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
