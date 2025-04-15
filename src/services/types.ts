export type RsvpStatus = "Yes" | "No" | "Maybe";

export interface Player {
  id: string;
  name: string;
}

export interface RsvpEntry {
  player: Player;
  status: RsvpStatus;
  updatedAt: Date;
}

export interface RsvpStats {
  total: number;
  confirmed: number;
  declined: number;
  maybe: number;
}

export interface Logger {
  info(message: string): void;
  error(message: string): void;
}
