import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EventsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
