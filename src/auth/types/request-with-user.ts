import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

export interface LoginRequest extends Request {
  user: User;
}
