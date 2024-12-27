import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      ok: false,
      statusCode: status,
      errorDetails: {
        error:
          exception instanceof HttpException
            ? exception.getResponse()['message'] || exception.message
            : 'Internal server error',
        errorName: exception.name || 'Error',
      },
    };

    response.status(status).json(errorResponse);
  }
}
