import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [],
  providers: [UploadsService],
  controllers: [UploadsController],
})
export class UploadsModule {}
