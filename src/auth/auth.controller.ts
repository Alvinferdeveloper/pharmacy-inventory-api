import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';
import { RolesGuard } from './guards/roles.guard';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const { access_token } = await this.authService.login(user);
    res.cookie('jwt', access_token, { httpOnly: true, sameSite: 'lax', path: '/' });
    return { message: 'Login successful' };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('jwt');
    return { message: 'Logout successful' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleName.ADMINISTRATOR)
  getProfile(@Req() req) {
    return req.user;
  }
}