# Gametime Hero RSVP Manager

A simple and efficient RSVP management system for team events.

## Features

- Add or update player RSVPs
- Get list of confirmed attendees
- Track RSVP statistics (total, confirmed, declined, maybe)
- Simple logging system
- TypeScript support
- Unit tests

## Installation

```bash
npm install
```

## Usage

```typescript
import { RsvpService } from "./src/RsvpService";
import { ConsoleLogger } from "./src/ConsoleLogger";

// Create a new RSVP service with a console logger
const logger = new ConsoleLogger();
const rsvpService = new RsvpService(logger);

// Add or update a player's RSVP
const player = { id: "1", name: "John Doe" };
rsvpService.addOrUpdateRsvp(player, "Yes");

// Get confirmed attendees
const confirmedAttendees = rsvpService.getConfirmedAttendees();

// Get RSVP statistics
const stats = rsvpService.getRsvpStats();
```

## Development

### Building the Project

```bash
npm run build
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Project Structure

- `src/types.ts` - Core types and interfaces
- `src/RsvpService.ts` - Main RSVP service implementation
- `src/ConsoleLogger.ts` - Simple console logger implementation
- `src/RsvpService.test.ts` - Unit tests

## License

MIT
