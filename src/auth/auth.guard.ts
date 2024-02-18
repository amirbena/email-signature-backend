import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AUTHORIZATION, DEFAULT_SECRET, USER_TOKEN_PAYLOAD, UnauthorizedExceptionText } from 'src/constants/constants';
import { TokenDto } from 'src/users/dto/request/TokenDto';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(UnauthorizedExceptionText);
    }
    try {
      const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret
        }
      ) as TokenDto;
      request.body[USER_TOKEN_PAYLOAD] = payload;
    } catch (error) {
      throw new UnauthorizedException(UnauthorizedExceptionText);
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : request.cookies[AUTHORIZATION];
  }
}
