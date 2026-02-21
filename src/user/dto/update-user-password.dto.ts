import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdatePasswordDto extends PartialType(
    PickType(CreateUserDto, ['password'] as const)
) {}