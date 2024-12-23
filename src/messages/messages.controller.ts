import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Auth } from 'src/decorators/auth.decorator';
import { CreateMessageDto } from './dto/message.dto';
import { AppErrors } from 'src/errors';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // @Post()
  // @Auth()
  // @UsePipes(new ValidationPipe())
  // async createMessage(@Body() dto: CreateMessageDto) {
  //   const data = await this.messagesService.createMessages(dto);
  //   return {
  //     status: 201,
  //     message: 'Successfully create message',
  //     data,
  //   };
  // }
  @Patch('/:id')
  @Auth()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async updateMessage(@Body() dto: CreateMessageDto, @Param('id') id: string) {
    const message = await this.messagesService.findMessagesById(id);
    if (!message) {
      throw new NotFoundException(AppErrors.MESSAGE_NOT_FOUND);
    }

    const data = await this.messagesService.updateMessages(dto, id);
    return {
      status: 200,
      message: 'Successfully update message',
      data,
    };
  }

  @Delete('/:id')
  @HttpCode(204)
  @Auth()
  async deleteMessage(@Body() dto: CreateMessageDto, @Param('id') id: string) {
    await this.messagesService.deleteMessage(dto, id);
    return {
      status: 204,
      message: 'Successfully delete message',
    };
  }
}
