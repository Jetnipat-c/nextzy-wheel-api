import { Module } from '@nestjs/common';

import { InfrastructureModule } from '@infrastructure/infrastructure.module';

import { SpinModule } from '@presentation/spin/spin.module';
import { PlayerModule } from '@presentation/player/player.module';

import { AppController } from './app.controller';

@Module({
  imports: [InfrastructureModule, PlayerModule, SpinModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
