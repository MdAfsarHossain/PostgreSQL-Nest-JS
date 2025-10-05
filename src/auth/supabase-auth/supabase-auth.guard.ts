/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No Token Provided!');
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = this.configService.get<string>('SUPABASE_JWT_SECRET');
    if (!jwtSecret) {
      throw new UnauthorizedException('JWT Secret not provided');
    }

    try {
      const decode = jwt.verify(token, jwtSecret);
      request['user'] = decode;
      return true;
    } catch (error: any) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
