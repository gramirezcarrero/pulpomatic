import * as httpContext from "express-http-context";
import * as winston from "winston";
const isLocal = process.env.NODE_ENV === "lo";
import * as packageJson from "../../package.json";

export class Logger {
  static createLogger(filename: string): winston.Logger {
    const logger = winston.createLogger({
      level: isLocal ? "debug" : "info",
      format: winston.format.combine(
        winston.format.errors({ stack: isLocal }),
        Logger.addContext()
      ),
      handleExceptions: false,
      defaultMeta: {
        version: packageJson.version,
        fileName: filename,
      },
    });
    if (process.env.NODE_ENV === "lo") {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.colorize({ all: true })
          ),
        })
      );
    } else {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
          silent: process.env.NODE_ENV === "test",
        })
      );
    }
    return logger;
  }

  private static addContext(): winston.Logform.Format {
    return winston.format((info) => {
      if (httpContext) {
        info["x-correlation-id"] = httpContext.get("x-correlation-id");
      }
      return info;
    })();
  }
}
