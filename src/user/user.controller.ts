import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/decorators/auth.decorator';
import { SearchUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @UsePipes(new ValidationPipe())
  @Get('/search-users')
  async getUsersByPhone(@Query() dto: SearchUserDto) {
    const users = await this.userService.findUsersByPhoneNumber(dto.phone);

    if (users.length === 0) {
      return {
        status: 200,
        message:
          'Sorry, but no users could be found with this phone number. Please check the entered information and try again',
      };
    }
    return {
      status: 200,
      message: 'Successfully find users',
      users,
    };
  }
}
