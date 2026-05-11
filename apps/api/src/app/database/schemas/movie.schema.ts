import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ autoCreate: false })
export class Movie {
    @Prop() id: number;
    @Prop() name: string;
    @Prop() director: string;
    @Prop() originalName: string;
    @Prop() yearProduced: string;
    @Prop() yearAdded: string;
    @Prop() durationMinutes: number | null;
    @Prop({ type: MongooseSchema.Types.Mixed })
    watchUrl: string | string[] | null;
}
