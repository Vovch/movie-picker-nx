import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-local';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from './auth.service';
import {User} from '../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({usernameField: 'login', passwordField: 'hash'});
    }

    async validate(login: string, hash: string): Promise<User> {
        const user = await this.authService.validateUser(login, hash);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}