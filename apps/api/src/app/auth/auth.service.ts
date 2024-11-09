import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { IMovie, IUserMovieList } from '@movie-picker/api-interfaces';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(login: string, hash: string): Promise<User> {
    const user = await this.usersService.findOne(login);
    const { userHash } = await this.usersService.generateUserHash({
      login,
      hash,
      salt: user.salt,
    });

    if (user && user.hash === userHash) {
      return user;
    }

    return null;
  }
}
