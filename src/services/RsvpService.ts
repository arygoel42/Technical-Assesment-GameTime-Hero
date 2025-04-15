import { Logger, Player, RsvpEntry, RsvpStats, RsvpStatus } from "./types";

export class RsvpService {
  private rsvpEntries: Map<string, RsvpEntry>;

  constructor(private readonly logger: Logger) {
    this.rsvpEntries = new Map();
  }

  public addOrUpdateRsvp(player: Player, status: RsvpStatus): RsvpEntry {
    const entry: RsvpEntry = {
      player,
      status,
      updatedAt: new Date(),
    };

    this.rsvpEntries.set(player.id, entry);
    this.logger.info(`Updated RSVP for player ${player.name} to ${status}`);

    return entry;
  }

  public getConfirmedAttendees(): RsvpEntry[] {
    return Array.from(this.rsvpEntries.values())
      .filter((entry) => entry.status === "Yes")
      .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
  }

  public getRsvpStats(): RsvpStats {
    const entries = Array.from(this.rsvpEntries.values());

    return {
      total: entries.length,
      confirmed: entries.filter((e) => e.status === "Yes").length,
      declined: entries.filter((e) => e.status === "No").length,
      maybe: entries.filter((e) => e.status === "Maybe").length,
    };
  }

  public getRsvpForPlayer(playerId: string): RsvpEntry | undefined {
    return this.rsvpEntries.get(playerId);
  }

  public getAllRsvps(): RsvpEntry[] {
    return Array.from(this.rsvpEntries.values()).sort(
      (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime()
    );
  }
}
