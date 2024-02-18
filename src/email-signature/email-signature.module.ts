import { Module } from '@nestjs/common';
import { EmailSignatureService } from './email-signature.service';
import { EmailSignatureController } from './email-signature.controller';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSignature, EmailSignatureSchema } from 'src/email-signature/email-signature.schema';
import { UsersModule } from 'src/users/users.module';
import { TemplateModule } from 'src/template/template.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: EmailSignature.name, schema: EmailSignatureSchema }]), UsersModule, TemplateModule],
  providers: [JwtService, EmailSignatureService],
  controllers: [EmailSignatureController]
})
export class EmailSignatureModule { }
