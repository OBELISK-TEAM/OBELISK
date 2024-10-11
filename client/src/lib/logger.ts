import { ConsoleLogger, LogLevel } from "@/classes/logger/ConsoleLogger";

const logger = new ConsoleLogger({
  level: process.env.APP_ENV === "production" ? LogLevel.WARN : LogLevel.LOG,
});

export default logger;
