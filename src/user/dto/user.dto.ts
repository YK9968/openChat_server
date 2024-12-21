import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SearchUserDto {
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty()
  @Matches(/^\d{3,10}$/, {
    message:
      'Phone must be a number between 3 and 10 digits (e.g., 0681111111)',
  })
  phone: string;
}
