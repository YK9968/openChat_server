import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  user1: string;

  @IsString()
  @IsNotEmpty()
  user2: string;
}
