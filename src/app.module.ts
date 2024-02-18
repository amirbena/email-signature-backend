import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DEVELOPMENT, PRODUCTION, TIME } from './constants/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TemplateModule } from './template/template.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailSignatureModule } from './email-signature/email-signature.module';


@Module({
  imports: [ConfigModule.forRoot({ envFilePath: `src/config/.${process.env.NODE_ENV === PRODUCTION ? PRODUCTION : DEVELOPMENT}.env`, isGlobal: true }), JwtModule.register({ signOptions: { expiresIn: TIME.DAY } }), MongooseModule.forRoot(`${process.env.MONGO_URL}`), UsersModule, TemplateModule, EmailSignatureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
