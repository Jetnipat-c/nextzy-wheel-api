import { Module } from '@nestjs/common';

import { InfrastructureModule } from '@infrastructure/infrastructure.module';

import { PlayerModule } from '@presentation/player/player.module';

import { AppController } from './app.controller';

@Module({
  imports: [InfrastructureModule, PlayerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
