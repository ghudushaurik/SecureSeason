import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
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
  register() {
    return;
  }

  @Put('/password')
  changePassword() {
    return;
  }

  @Put('/edit')
  editUser() {
    return;
  }
}
