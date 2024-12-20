import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Auth } from 'src/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('/register')
  async registerUser(@Body() dto: RegisterUserDto) {
    const data = await this.authService.registerUserServices(dto);

    return {
      status: 201,
      message: 'Successfully create user',
      data,
    };
  }
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('/login')
  async loginUser(@Body() dto: LoginUserDto) {
    const data = await this.authService.loginUserServices(dto);

    return {
      status: 200,
      message: 'Successfully login user',
      data,
    };
  }

  @HttpCode(200)
  @Auth()
  @UsePipes(new ValidationPipe())
  @Post('/refreshToken')
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    const data = await this.authService.getNewTokens(dto.refreshToken);

    return {
      status: 200,
      message: 'Successfully update tokens',
      data,
    };
  }
}
