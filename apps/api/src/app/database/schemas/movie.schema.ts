import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ autoCreate: false })
export class Movie {
    @Prop() id: number;
    @Prop() name: string;
    @Prop() director: string;
    @Prop() originalName: string;
    @Prop() yearProduced: string;
    @Prop() yearAdded: string;
}
