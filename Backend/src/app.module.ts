import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10), 
      username: process.env.DB_USER,
      password: process.env.DB_PASS, 
      database: process.env.DB_NAME,
      entities: [],
      synchronize: false, 
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}