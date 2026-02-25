import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Conteúdo é obrigatório.' })
  @MinLength(50, { message: 'Conteúdo deve conter no mínimo 50 caracteres.' })
  content: string;
}
