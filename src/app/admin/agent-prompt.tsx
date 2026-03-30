"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const AGENT_PROMPT = `You have access to the MakeEmilyARagsdale.com wedding admin API.

Base URL: https://makeemilyaragsdale.com/api/admin
Auth: Bearer emily-ragsdale (pass as Authorization header)
OpenAPI spec: https://makeemilyaragsdale.com/api/admin/openapi.json

This API manages wedding invites for Emily Devery & Sam Ragsdale's wedding (Feb 27, 2027, San Miguel de Allende, Mexico).

READING:
  GET /api/admin?action=list          — all invites with guests & hotel status
  GET /api/admin?action=get&code=XXX  — single invite with activity events
  GET /api/admin?action=stats         — aggregate counts (attending, pending, etc.)

WRITING (POST /api/admin with JSON body):
  {"action":"create", "guestNames":["Name1","Name2"], "hotelEligible":false, "address":"...", "notes":"..."}
  {"action":"update_invite", "code":"EBR-XXX", "hotelEligible":true, "address":"..."}
  {"action":"update_guest", "code":"EBR-XXX", "guestName":"Name", "attending":true, "email":"...", "phone":"..."}
  {"action":"update_hotel", "code":"EBR-XXX", "willBook":true, "bookingComplete":true, "bookingValue":"4500.00"}
  {"action":"delete", "code":"EBR-XXX", "confirm":true}

SAFETY:
- Delete requires "confirm":true — it soft-deletes only (recoverable)
- Hotel updates only work on hotel-eligible invites
- Guest lookup: use "code"+"guestName" (case-insensitive) or "guestId"
- Codes are auto-generated (EBR-XXXXX format). Never create custom codes.
- All codes are uppercase. API normalizes automatically.
- "attending" accepts true, false, or null (pending)`;

export function AgentPrompt() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative border border-border rounded-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs text-muted-foreground">
          Agent prompt — copy and give to any AI assistant
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(AGENT_PROMPT);
            setCopied(true);
            toast("Agent prompt copied");
            setTimeout(() => setCopied(false), 1500);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <pre className="px-3 py-2 text-[11px] leading-relaxed text-muted-foreground font-mono overflow-x-auto scrollbar-none max-h-32 overflow-y-auto scrollbar-none">
        {AGENT_PROMPT}
      </pre>
    </div>
  );
}
