import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Auth } from 'src/decorators/auth.decorator';
import { CreateChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Auth()
  @UsePipes(new ValidationPipe())
  @Post()
  async createChat(@Body() dto: CreateChatDto) {
    const { user1, user2 } = dto;
    const chat = await this.chatService.createChat(user1, user2);

    return {
      status: 201,
      message: 'Successfully',
      chat,
    };
  }

  @Auth()
  @Get('/user-chats')
  async getUserChats(@Query('id') id: string) {
    const chats = await this.chatService.findUserChats(id);
    return {
      status: 200,
      message: 'Successfully find user chats',
      chats,
    };
  }
}
