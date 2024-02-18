import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { Routes, UsersRoutes } from 'src/constants/routes.constants';
import { UserRegisterDto } from 'src/users/dto/request/UserRegister.dto';
import { Response } from 'express';
import { AUTHORIZATION, TIME } from 'src/constants/constants';
import { AuthenticatedUser } from 'src/users/dto/reponse/AuthenticatedUser.dto';
import { UserLoginDto } from 'src/users/dto/request/UserLogin.dto';

@Controller(Routes.Users)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async register(@Body() userRegister: UserRegisterDto, @Res({ passthrough: true }) response: Response): Promise<AuthenticatedUser> {
        const result: AuthenticatedUser = await this.usersService.createUser(userRegister);
        const { responseMessage, accessToken } = result;
        const date = new Date();
        date.setHours(date.getHours() + 2);
        response.cookie(AUTHORIZATION, accessToken, { expires: date });
        response.header(AUTHORIZATION,accessToken);
        return result;
    }

    @Post(UsersRoutes.LOGIN)
    @UsePipes(ValidationPipe)
    async login(@Body() userLogin: UserLoginDto, @Res({ passthrough: true }) response: Response): Promise<AuthenticatedUser> {
        const result: AuthenticatedUser = await this.usersService.userLogin(userLogin);
        const { responseMessage, accessToken } = result;
        const date = new Date();
        date.setHours(date.getHours() + 2);
        response.cookie(AUTHORIZATION, accessToken,{ expires: date });
        response.header(AUTHORIZATION,accessToken);
        return result;
    }

}
