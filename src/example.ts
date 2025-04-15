import { RsvpService } from "./RsvpService";
import { ConsoleLogger } from "./ConsoleLogger";

// Create a new RSVP service with a console logger
const logger = new ConsoleLogger();
const rsvpService = new RsvpService(logger);

// Create some example players
const players = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
];

// Add RSVPs for the players
rsvpService.addOrUpdateRsvp(players[0], "Yes");
rsvpService.addOrUpdateRsvp(players[1], "No");
rsvpService.addOrUpdateRsvp(players[2], "Maybe");

// Get and display confirmed attendees
console.log("\nConfirmed Attendees:");
const confirmedAttendees = rsvpService.getConfirmedAttendees();
confirmedAttendees.forEach((attendee) => {
  console.log(`- ${attendee.player.name}`);
});

// Get and display RSVP statistics
console.log("\nRSVP Statistics:");
const stats = rsvpService.getRsvpStats();
console.log(`Total Responses: ${stats.total}`);
console.log(`Confirmed: ${stats.confirmed}`);
console.log(`Declined: ${stats.declined}`);
console.log(`Maybe: ${stats.maybe}`);
