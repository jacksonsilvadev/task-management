import { format, transports } from 'winston';
import { WinstonModule } from 'nest-winston';

const formatWinston = format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    const data =
      typeof metadata.context === 'object' ? metadata.context : metadata;

    return JSON.stringify({
      timestamp,
      level,
      message,
      data,
    });
  },
);

export const winstonLogger = WinstonModule.createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.json(),
    format.timestamp(),
    formatWinston,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
  ],
});
