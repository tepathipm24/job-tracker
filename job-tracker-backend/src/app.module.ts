import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Application } from './applications/entities/application.entity'; // จะสร้างในขั้นตอนต่อไป
import { Status } from './status/entities/status.entity'; // จะสร้างในขั้นตอนต่อไป
import { ApplicationsModule } from './applications/applications.module';
import { StatusModule } from './status/status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ทำให้ ConfigModule ใช้งานได้ทั่วทั้งแอปพลิเคชัน
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      schema: process.env.DATABASE_SCHEMA,
      entities: [Application, Status], // เพิ่ม Entities ที่คุณสร้าง
      synchronize: true, // ควรเป็น `false` ใน Production, ใช้ `true` สำหรับ Development เพื่อ Sync Schema อัตโนมัติ
    }),
    ApplicationsModule,
    StatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
