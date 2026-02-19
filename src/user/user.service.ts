import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const exists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (exists) {
      throw new ConflictException('Este email já existe.');
    }
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.userRepository.save(newUser);

      return plainToInstance(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro interno ao processar solicitação.',
      );
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
