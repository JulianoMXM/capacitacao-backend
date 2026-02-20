import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const passwordValidation = await this.userService.comparePassword(
      password,
      user.password,
    );

    if (!passwordValidation) {
      throw new UnauthorizedException('Senha inválida.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user;
    return userData;
  }

  login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return {
      acess_token: this.jwtService.sign(payload),
    };
  }
}
