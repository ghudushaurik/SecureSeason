import { Body, Controller, Get, Post, Put, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return;
  }

  @Post('/logout')
  logout() {
    return;
  }

  @Post('/register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Put('/password')
  changePassword() {
    return;
  }

  @Put('/edit')
  editUser() {
    return;
  }

  @Get()
  profile(@Session() session: Record<string, any>) {
    console.log(session);
    console.log(new Date());
    console.log(session);
    console.log(new Date());
  }
}
