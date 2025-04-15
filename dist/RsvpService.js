"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsvpService = void 0;
class RsvpService {
    constructor(logger) {
        this.logger = logger;
        this.rsvpEntries = new Map();
    }
    addOrUpdateRsvp(player, status) {
        const entry = {
            player,
            status,
            updatedAt: new Date(),
        };
        this.rsvpEntries.set(player.id, entry);
        this.logger.info(`Updated RSVP for player ${player.name} to ${status}`);
        return entry;
    }
    getConfirmedAttendees() {
        return Array.from(this.rsvpEntries.values())
            .filter((entry) => entry.status === "Yes")
            .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
    }
    getRsvpStats() {
        const entries = Array.from(this.rsvpEntries.values());
        return {
            total: entries.length,
            confirmed: entries.filter((e) => e.status === "Yes").length,
            declined: entries.filter((e) => e.status === "No").length,
            maybe: entries.filter((e) => e.status === "Maybe").length,
        };
    }
    getRsvpForPlayer(playerId) {
        return this.rsvpEntries.get(playerId);
    }
    getAllRsvps() {
        return Array.from(this.rsvpEntries.values()).sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
    }
}
exports.RsvpService = RsvpService;
