import {
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserData,
  UserDataDocument,
} from '../database/schemas/userData.schema';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserData.name)
    private userDataModel: Model<UserDataDocument>,
  ) {}

  async create({ login, hash }: CreateUserDto) {
    const isUserExist = Boolean(
      await this.userDataModel.countDocuments({ login }),
    );

    if (isUserExist) {
      console.log('Attempted to create existing user', login);
      throw new UnprocessableEntityException(
        `User with login ${login} already exists.`,
      );
    }

    const { userHash, userSalt } = await this.generateUserHash({
      login,
      hash,
    });

    const userData = new this.userDataModel({
      login,
      hash: userHash,
      salt: userSalt,
      userMovies: [],
    });

    return userData.save();
  }

  async findOne(login: string): Promise<User> {
    const userData: User = await this.userDataModel
      .findOne(
        { login },
        {
          userMovies: {
            listId: 1,
            movieId: 1,
            status: 1,
          },
          login: 1,
          hash: 1,
          salt: 1,
        },
      )
      .exec();

    if (!userData) {
      console.trace();
      console.log(login);
      throw new Error('unable to authorize');
    }

    return userData;
  }

  async changeMovieStatus({ status, login, movieId, listId }: UpdateUserDto) {
    if (!status) {
      await this.userDataModel.updateOne(
        { login },
        {
          $pull: {
            userMovies: {
              movieId,
              listId,
            },
          },
        },
      );
    } else {
      const updated = await this.userDataModel.updateOne(
        {
          login,
          'userMovies.movieId': movieId,
          'userMovies.listId': listId,
        },
        {
          $set: { 'userMovies.$.status': status },
        },
      );

      if (!updated.matchedCount) {
        await this.userDataModel.updateOne(
          { login },
          {
            $addToSet: {
              userMovies: {
                movieId,
                listId,
                status,
              },
            },
          },
        );
      }
    }
  }

  async generateUserHash({
    login,
    hash,
    salt = randomBytes(16).toString('hex'),
  }) {
    const userHash = await promisify(scrypt)(login + hash, salt, 64).then(
      (key: Buffer) => key.toString('hex'),
    );

    return { userSalt: salt, userHash };
  }
}
