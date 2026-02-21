import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
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

  async getInfo(id: string){
    const user = await this.userRepository.findOne({where: { id } })
    
    if (!user){
      throw new NotFoundException('Usuário não encontrado.')
    }

    return user
  }

  async updateInfo(updateUserDto: UpdateUserDto, id: string) {
    const user = await this.getInfo(id)

    if(updateUserDto.email && updateUserDto.email !== user.email){
      const emailExists = await this.userRepository.findOne({where: {email: updateUserDto.email}})
      
      if(emailExists){
        throw new ConflictException('Este email está em uso.')
      }
      
      Object.assign(user, updateUserDto)

      return this.userRepository.save(user)
    }
    
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto, id: string) {
    const user = await this.findById(id)

    if(!user){
      throw new NotFoundException('Usuário não encontrado.')
    }
    const newHashedPassword = await bcrypt.hash(updatePasswordDto.password!, saltRounds)
    
    user.password = newHashedPassword
    await this.userRepository.save(user)

    return {message: 'Senha atualizada com sucesso.'}
  }

  async deleteAccount(id: string) {
    const user = await this.getInfo(id)

    if(!user){
      throw new NotFoundException('Usuário não encontrado.')
    }
    await this.userRepository.delete(id)

    return {message: 'Usuário deletado com sucesso.'}
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.id = :id', {id: +id})
    .getOne()
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
