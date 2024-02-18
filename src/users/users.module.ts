import { Module } from '@nestjs/common';
import { MongooseModule, } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/users.schema';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UsersController],
    providers:[JwtService, UsersService],
    exports: [UsersService]
})
export class UsersModule { }
