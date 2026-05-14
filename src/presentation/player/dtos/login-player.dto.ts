import { IsString, IsNotEmpty } from 'class-validator';

export class LoginPlayerDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
