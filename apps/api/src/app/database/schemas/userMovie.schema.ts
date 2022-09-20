import {Prop, Schema} from '@nestjs/mongoose';

@Schema({ autoCreate: false})
export class UserMovie {
    @Prop() listId: string;
    @Prop() movieId: number;
    @Prop() status: string;
}