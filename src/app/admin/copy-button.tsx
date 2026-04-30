"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CopyButton({
  url,
  label = "Link",
}: {
  url: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast(`${label} copied`, { description: url });
        setTimeout(() => setCopied(false), 1500);
      }}
      title={`Copy ${label.toLowerCase()}`}
      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
