import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    this.logger.error(
      `HTTP Status: ${status} - Error Message: ${JSON.stringify(errorResponse)}`,
    );

    if (exception instanceof Error) {
      this.logger.error(exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      message: errorResponse,
      path: request.url,
    });
  }
}
