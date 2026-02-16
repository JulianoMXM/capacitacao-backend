import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  name: string;

  @IsEmail({}, { message: 'Email inválido.' })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Senha deve conter no mínimo 8 caracteres.' })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  password: string;
}
