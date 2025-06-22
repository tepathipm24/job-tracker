// src/applications/applications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ตรวจสอบว่าได้ import TypeOrmModule
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/application.entity'; // ตรวจสอบว่าได้ import Application entity ของคุณ

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]), // <--- บรรทัดนี้สำคัญมาก!
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService], // ApplicationsService เป็น provider ที่ต้องการ repository
  exports: [ApplicationsService], // (Optional) ถ้าโมดูลอื่นต้องการใช้ ApplicationsService
})
export class ApplicationsModule {}