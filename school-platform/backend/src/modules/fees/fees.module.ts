import { Module } from '@nestjs/common';
import { FeesController, FeesWebhookController } from './fees.controller';
import { FeesService } from './fees.service';

@Module({ controllers: [FeesController, FeesWebhookController], providers: [FeesService], exports: [FeesService] })
export class FeesModule {}