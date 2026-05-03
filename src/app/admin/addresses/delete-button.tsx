"use client";

import { useState, useTransition } from "react";
import { Trash2, Check, X } from "lucide-react";
import { deleteAddressSubmission } from "./actions";

export function DeleteSubmissionButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          title={`Delete ${name}`}
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await deleteAddressSubmission(id);
            })
          }
          className="rounded p-1 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="Cancel"
          disabled={isPending}
          onClick={() => setConfirming(false)}
          className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      title={`Delete ${name}`}
      onClick={() => setConfirming(true)}
      className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
