import { NestFactory } from '@nestjs/core';
import { fixture } from '@app/core/fixture';
import { Partner2Module } from './partner-2.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(Partner2Module);

  const events = [
    {
      id: '5b79831a-a9d3-4538-8fb5-569494bd17a5',
      name: 'Event 003 - Partner 2',
      description: 'Event 003 Description - Partner 2',
      price: 400,
      date: '2024-10-10T10:00:00',
    },
    {
      id: '8beff8fd-39e4-49ea-ae5e-a0ec9af888c5',
      name: 'Event 004 - Partner 2',
      description: 'Event 003 Description - Partner 2',
      price: 500,
      date: '2024-10-10T12:00:00',
    },
  ];

  await fixture(app, events, 10);

  console.log('Partner1 - data created');
  await app.close();
}
bootstrap();
