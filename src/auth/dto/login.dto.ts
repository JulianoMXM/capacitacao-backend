import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail({}, {message: 'Email Inválido.'})
    email: string;

    @IsString({message: 'Senha inválida'})
    @IsNotEmpty({message: 'A senha não pode ser vazia.'})
    password: string;
}