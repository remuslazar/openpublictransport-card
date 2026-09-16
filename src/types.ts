export interface Departure {
  line: string;
  destination: string;
  departure_time: string;
  planned_time: string;
  delay: number;
  platform: string;
  transportation_type: string;
  is_realtime: boolean;
  minutes_until_departure: number;
  description?: string;
  notices?: string[];
  planned_platform?: string;
  platform_changed?: boolean;
  line_color?: string;
  line_text_color?: string;
}

export interface TripLeg {
  origin: string;
  destination: string;
  line: string;
  product: string;
  // Unified type ("bus", "subway", "walk", …), added by integration 2026.9.1.
  // Older versions only send `product`, the provider's own name.
  transport_type?: string;
  departure_planned: string;
  departure_estimated: string;
  arrival_planned: string;
  arrival_estimated: string;
  delay: number;
  duration_minutes: number;
  platform: string;
  transfer?: boolean;
}

export interface TripData {
  departure: string;
  arrival: string;
  // ISO timestamp of the journey start — the walk to the stop, when there is
  // one. Absent on integrations older than 2026.8.2.
  departure_timestamp?: string | null;
  // Minutes until that start, as the sensor last computed it.
  in_minutes?: number | null;
  // Where the trip ends, e.g. "Reinoldikirche, Dortmund".
  destination?: string;
  duration_minutes: number;
  transfers: number;
  connection_feasible: boolean;
  transfer_risk: string;
  min_transfer_time: number;
  legs: TripLeg[];
  next_journeys?: TripData[];
}

export interface CardConfig {
  entity: string;
  layout: "table" | "compact" | "trip" | "next";
  max_departures: number;
  show_header: boolean;
  show_platform: boolean;
  show_delay: boolean;
  show_realtime_indicator: boolean;
  theme: "dark" | "light" | "auto" | "ha";
  line_filter?: string;
  destination_filter?: string;
}

// Home Assistant types (minimal declarations for type safety)
export interface EntityRegistryDisplayEntry {
  entity_id: string;
  platform?: string;
  translation_key?: string;
  name?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  // Entity registry (optional: absent on older HA versions).
  entities?: Record<string, EntityRegistryDisplayEntry>;
  themes: {
    darkMode: boolean;
  };
  localize: (key: string) => string;
  language: string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}
