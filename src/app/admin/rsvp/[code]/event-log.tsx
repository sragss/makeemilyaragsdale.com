"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("./event-map"), { ssr: false });

interface EventData {
  id: string;
  type: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface IpLocation {
  lat: number;
  lon: number;
  city: string;
  region: string;
  country: string;
}

function getEventLabel(type: string) {
  switch (type) {
    case "view":
      return "Opened RSVP";
    case "belmond_click":
      return "Clicked Belmond link";
    case "address_view":
      return "Opened address page";
    case "address_submit":
      return "Submitted address";
    default:
      return type;
  }
}

export function EventLog({ events }: { events: EventData[] }) {
  const [locations, setLocations] = useState<Record<string, IpLocation>>({});

  useEffect(() => {
    const uniqueIps = [
      ...new Set(events.map((e) => e.ip).filter(Boolean)),
    ] as string[];

    const publicIps = uniqueIps.filter(
      (ip) =>
        !ip.startsWith("192.168.") &&
        !ip.startsWith("10.") &&
        !ip.startsWith("127.") &&
        ip !== "::1"
    );

    if (publicIps.length === 0) return;

    Promise.allSettled(
      publicIps.map(async (ip) => {
        const res = await fetch(
          `https://ip-api.com/json/${ip}?fields=lat,lon,city,regionName,country`,
          { signal: AbortSignal.timeout(5000) }
        );
        const data = await res.json();
        if (data.lat && data.lon) {
          return {
            ip,
            lat: data.lat as number,
            lon: data.lon as number,
            city: data.city as string,
            region: data.regionName as string,
            country: data.country as string,
          };
        }
        return null;
      })
    ).then((results) => {
      const resolved: Record<string, IpLocation> = {};
      for (const r of results) {
        if (r.status === "fulfilled" && r.value) {
          resolved[r.value.ip] = r.value;
        }
      }
      if (Object.keys(resolved).length > 0) {
        setLocations(resolved);
      }
    });
  }, [events]);

  const mapLocations = Object.entries(locations).map(([ip, loc]) => ({
    ip,
    ...loc,
  }));

  if (events.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Activity
        </h2>
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
        Activity ({events.length} events)
      </h2>

      {mapLocations.length > 0 && (
        <div className="h-48 rounded-sm overflow-hidden border border-border">
          <EventMap locations={mapLocations} />
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {events.map((event) => {
          const loc = event.ip ? locations[event.ip] : null;
          const time = new Date(event.createdAt);
          return (
            <div
              key={event.id}
              className="flex items-start justify-between text-xs gap-4"
            >
              <div className="space-y-0.5">
                <span className="font-medium">
                  {getEventLabel(event.type)}
                </span>
                {loc && (
                  <span className="text-muted-foreground block">
                    {loc.city}, {loc.region}, {loc.country}
                  </span>
                )}
                {event.ip && !loc && (
                  <span className="text-muted-foreground block font-mono">
                    {event.ip}
                  </span>
                )}
              </div>
              <span className="text-muted-foreground whitespace-nowrap">
                {time.toLocaleDateString()} {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
