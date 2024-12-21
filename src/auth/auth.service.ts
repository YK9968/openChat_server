import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { AppErrors } from 'src/errors';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUserServices(dto: RegisterUserDto) {
    const isExists = await this.userService.findUser(dto.email);
    if (isExists) throw new BadRequestException(AppErrors.USER_EXISTS);

    const data = await this.userService.createUser(dto);
    const user = { email: data.email, name: data.name };
    const tokens = await this.issueTokens(data.email, data.id);

    return { user, tokens };
  }

  async loginUserServices(dto: LoginUserDto) {
    const user = await this.userService.findUser(dto.email);
    if (!user) throw new BadRequestException(AppErrors.INVALID_DATA);

    const validatePwd = await bcrypt.compare(dto.password, user.password);
    if (!validatePwd) throw new BadRequestException(AppErrors.INVALID_DATA);

    const tokens = await this.issueTokens(user.email, user.id);

    return tokens;
  }

  private async issueTokens(email: string, id: string) {
    const data = { email, id };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async getNewTokens(refreshToken: string) {
    try {
      const result = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.userService.findUser(result.email);
      const tokens = await this.issueTokens(user.email, user.id);
      return tokens;
    } catch {
      throw new UnauthorizedException(AppErrors.UNAUTHORIZE);
    }
  }
}