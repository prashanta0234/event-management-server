import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from 'src/common/interceptor/responseInterceptor';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { QueueModule } from 'src/common/queue/queue.module';
import { GlobalExceptionFilter } from 'src/common/filter/globalException.filter';
import { CustomCacheModule } from 'src/common/custom-cache/custom-cache.module';
import { AttendeeModule } from 'src/attendee/attendee.module';
import { EventModule } from 'src/event/event.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { RegistrationModule } from 'src/registration/registration.module';
import { SchedulerModule } from 'src/common/scheduler/scheduler.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
    QueueModule,
    CustomCacheModule,
    AttendeeModule,
    EventModule,
    RegistrationModule,
    SchedulerModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
