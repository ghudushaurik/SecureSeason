import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Session() session: Record<string, any>) {
    return this.authService.login(body);
  }

  @Post('test')
  async test(@Request() req) {
    console.log('route');
    return this.authService.validateUser('string3', 'string');
  }

  @Post('logout')
  logout() {
    return;
  }

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Put('password')
  changePassword() {
    return;
  }

  @Put('edit')
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
