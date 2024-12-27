import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from 'src/common/filter/globalException.filter';
import { ResponseInterceptor } from 'src/common/interceptor/responseInterceptor';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,{
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    }, {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },],
})
export class AppModule {}
