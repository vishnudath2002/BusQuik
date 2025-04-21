import path from "path";
import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({ filename: path.join(__dirname, '..', 'logs', 'logs.log') }), // Log to file
        new transports.Console() // Log to console
    ]
});


export default logger;