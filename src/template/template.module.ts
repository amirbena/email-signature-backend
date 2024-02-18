import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from 'src/template/template.schema';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }]), UsersModule],
  providers: [JwtService, TemplateService],
  controllers: [TemplateController],
  exports: [TemplateService]
})
export class TemplateModule { }
