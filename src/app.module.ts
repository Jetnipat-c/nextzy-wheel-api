import { Module } from '@nestjs/common';

import { InfrastructureModule } from '@infrastructure/infrastructure.module';

import { AppController } from './app.controller';

@Module({
  imports: [InfrastructureModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
