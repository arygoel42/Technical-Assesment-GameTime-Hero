import { ConsoleLogger } from "./ConsoleLogger";
import { RsvpService } from "./RsvpService";
import { Player, RsvpStatus } from "./types";

describe("RsvpService", () => {
  let service: RsvpService;
  let logger: ConsoleLogger;
  const mockPlayer: Player = { id: "1", name: "John Doe" };

  beforeEach(() => {
    logger = new ConsoleLogger();
    service = new RsvpService(logger);
  });

  describe("addOrUpdateRsvp", () => {
    it("should add a new RSVP entry", () => {
      const entry = service.addOrUpdateRsvp(mockPlayer, "Yes");

      expect(entry.player).toEqual(mockPlayer);
      expect(entry.status).toBe("Yes");
      expect(entry.updatedAt).toBeInstanceOf(Date);
    });

    it("should update an existing RSVP entry", () => {
      service.addOrUpdateRsvp(mockPlayer, "Yes");
      const updatedEntry = service.addOrUpdateRsvp(mockPlayer, "No");

      expect(updatedEntry.status).toBe("No");
    });
  });

  describe("getConfirmedAttendees", () => {
    it("should return only confirmed attendees", () => {
      const player2: Player = { id: "2", name: "Jane Doe" };

      service.addOrUpdateRsvp(mockPlayer, "Yes");
      service.addOrUpdateRsvp(player2, "No");

      const confirmed = service.getConfirmedAttendees();

      expect(confirmed.length).toBe(1);
      expect(confirmed[0].player).toEqual(mockPlayer);
    });
  });

  describe("getRsvpStats", () => {
    it("should return correct statistics", () => {
      const player2: Player = { id: "2", name: "Jane Doe" };
      const player3: Player = { id: "3", name: "Bob Smith" };

      service.addOrUpdateRsvp(mockPlayer, "Yes");
      service.addOrUpdateRsvp(player2, "No");
      service.addOrUpdateRsvp(player3, "Maybe");

      const stats = service.getRsvpStats();

      expect(stats.total).toBe(3);
      expect(stats.confirmed).toBe(1);
      expect(stats.declined).toBe(1);
      expect(stats.maybe).toBe(1);
    });
  });
});
