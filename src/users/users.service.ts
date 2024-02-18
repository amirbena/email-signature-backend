import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRegisterDto } from 'src/users/dto/request/UserRegister.dto';
import { User, UserDocument } from 'src/users/users.schema';
import { Utils } from 'src/utils/Utils';
import * as bcrypt from 'bcrypt';
import { BCRYPT_ROUNDS, DEFAULT_SECRET, SUCCESS_REGISTER_RESPONSE, TIME } from 'src/constants/constants';
import { TokenDto } from 'src/users/dto/request/TokenDto';
import { AuthenticatedUser } from 'src/users/dto/reponse/AuthenticatedUser.dto';
import { UserLoginDto } from 'src/users/dto/request/UserLogin.dto';
import { SUCCESS_LOGIN_RESPONSE, EMAIL_NOT_FOUND, PASSWORDS_NOT_MATCH } from 'src/users/userConstants';

@Injectable()
export class UsersService {
    private secret;
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {
        this.secret = process.env.JWT_SECRET || DEFAULT_SECRET;
    }

    async createUser(userdto: UserRegisterDto): Promise<AuthenticatedUser> {
        Logger.log(`UsersService->createUser() entered with: ${Utils.toString(userdto)}`);
        const sameEmail = await this.userModel.find({ email: userdto.email });
        if (sameEmail.length) {
            Logger.warn(`UsersService->createUser() duplicate email in DB`);
            throw new ConflictException("Same Email of register users");
        }
        try {
            const password = await bcrypt.hash(userdto.password, BCRYPT_ROUNDS);
            const user: User = {
                ...userdto,
                password,
            }
            const userItem = new this.userModel(user);
            const savedItem = await userItem.save();
            Logger.log(`UsersService->createUser() user registered successfully`);
            const { email, name }: TokenDto = savedItem;
            const token = await this.jwtService.signAsync({ email, name }, { secret: this.secret, expiresIn: 1 * TIME.DAY });
            Logger.log(`UsersService->createUser() got token: ${token}`);
            return {
                accessToken: token,
                responseMessage: SUCCESS_REGISTER_RESPONSE
            };
        } catch (error) {
            if (error.status) throw error;
            Logger.error(`UsersService->createUser() has error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException("Something got wrong- can't continue");
        }
    }

    async userLogin(loginDto: UserLoginDto): Promise<AuthenticatedUser> {
        Logger.log(`UsersService->userLogin() entered with: ${Utils.toString(loginDto)}`);
        const { email, password } = loginDto;
        const userWithEmail = await this.userModel.findOne({ email });
        if (!userWithEmail) {
            Logger.warn(`UsersService->userLogin() email not found in DB`);
            throw new NotFoundException(EMAIL_NOT_FOUND);
        }
        const samePassword = await bcrypt.compare(password, userWithEmail.password);
        if (!samePassword) {
            Logger.warn(`UsersService->userLogin() passwords not match`);
            throw new ConflictException(PASSWORDS_NOT_MATCH);
        }
        try {
            Logger.log(`UsersService->userLogin() login successfully`);
            const { email } = userWithEmail;
            const token = await this.jwtService.signAsync({ email, }, { secret: this.secret, expiresIn: 1 * TIME.DAY });
            Logger.log(`UsersService->userLogin() got token: ${token}`);
            return {
                accessToken: token,
                responseMessage: SUCCESS_LOGIN_RESPONSE
            };
        } catch (error) {
            if (error.status) throw error;
            Logger.error(`UsersService->userLogin() has error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException("Something got wrong- can't continue");
        }
    }

    async getUserById(userId: Types.ObjectId): Promise<UserDocument> {
        Logger.log(`UsersService->getUserById() entered with: ${Utils.toString(userId)}`);
        try {
            return await this.userModel.findById(userId);
        } catch (error) {
            Logger.error(`UsersService->getUserById() has error occured: ${Utils.toString(error)}`);
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<UserDocument> {
        Logger.log(`UsersService->getUserByEmail() entered with: ${email}`);
        try {
            const user: UserDocument = await this.userModel.findOne({ email });
            Logger.log(`UsersService->getUserByEmail() got: ${Utils.toString(user)}`);
            return user;
        } catch (error) {
            Logger.error(`UsersService->getUserByEmail() has error occured: ${Utils.toString(error)}`);
            throw error;
        }
    }
}
