import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@app/core/prisma/prisma.module';
import { AuthModule } from '@app/core/auth/auth.module';
import { EventsModule } from './events/events.module';
import { SpotsModule } from './spots/spots.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.partner-1', isGlobal: true }),
    PrismaModule,
    AuthModule,
    EventsModule,
    SpotsModule,
  ],
})
export class Partner1Module {}
