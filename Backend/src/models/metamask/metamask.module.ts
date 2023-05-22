import { Module } from '@nestjs/common';
import { MetamaskService } from './metamask.service';
import { MetamaskController } from './metamask.controller';

@Module({
  controllers: [MetamaskController],
  providers: [MetamaskService]
})
export class MetamaskModule {}
