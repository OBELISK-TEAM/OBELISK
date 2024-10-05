import { LoggerOptions } from "@/interfaces/LoggerOptions";
import { LogLevel } from "@/enums/LogLevel";

class ConsoleLogger {
  private level: LogLevel;

  constructor(options?: LoggerOptions) {
    this.level = options?.level || LogLevel.LOG;
  }

  private shouldLog(messageLevel: LogLevel): boolean {
    const levels: LogLevel[] = [LogLevel.LOG, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(messageLevel);
    return messageLevelIndex >= currentLevelIndex;
  }

  private getPrefix(level: LogLevel): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}]-[${level.toUpperCase()}]:`;
  }

  log(...args: any[]) {
    if (this.shouldLog(LogLevel.LOG)) {
      console.log(this.getPrefix(LogLevel.LOG), ...args);
    }
  }

  warn(...args: any[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.getPrefix(LogLevel.WARN), ...args);
    }
  }

  error(...args: any[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.getPrefix(LogLevel.ERROR), ...args);
    }
  }
}

export { ConsoleLogger, LogLevel };
