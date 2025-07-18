import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Status])
  ],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService]
})
export class StatusModule {}
