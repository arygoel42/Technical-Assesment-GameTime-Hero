import { Logger } from "./types";

export class ConsoleLogger implements Logger {
  public info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  public error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}
