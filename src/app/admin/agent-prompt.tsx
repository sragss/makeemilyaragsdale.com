"use client";

import { useState } from "react";
import { Copy, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="border border-border rounded-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </motion.div>
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            Agent Prompt — paste into your agent and it can administrate
          </span>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(AGENT_PROMPT);
            setCopied(true);
            toast("Agent prompt copied");
            setTimeout(() => setCopied(false), 1500);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <pre className="px-3 pb-3 pt-1 text-[11px] leading-relaxed text-muted-foreground font-mono overflow-x-auto scrollbar-none border-t border-border">
              {AGENT_PROMPT}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
