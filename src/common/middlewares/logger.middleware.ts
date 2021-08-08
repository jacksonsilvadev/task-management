import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
  };

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const start = process.hrtime();

    response.on('finish', () => {
      const { statusCode, req } = response;
      const { user } = req;
      const userId = user ? user.id : null;
      const delay = this.getDurationInMilliseconds(start);

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - [Agent]: ${userAgent} [IP]: ${ip} [time]: ${delay.toLocaleString()} ms`,
        { userId },
      );
    });

    next();
  }
}
