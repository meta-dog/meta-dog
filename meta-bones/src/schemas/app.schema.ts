import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Advocate } from './advocate.schema';

export type AppDocument = App & Document;

@Schema()
export class App {
  @Prop({ required: true, unique: true })
  app_id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Advocate' }],
  })
  advocates: Advocate[];
}

export const AppSchema = SchemaFactory.createForClass(App);
