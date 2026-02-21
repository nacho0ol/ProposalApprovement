import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module'; // <-- INI WAJIB ADA
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    HomeModule,
    InvoicesModule,
    PaymentsModule,
    ProfileModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
