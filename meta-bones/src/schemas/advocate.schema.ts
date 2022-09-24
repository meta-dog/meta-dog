import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { App } from './app.schema';

export type AdvocateDocument = Advocate & Document;

@Schema()
export class Advocate {
  @Prop({ required: true, unique: true })
  advocate_id: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'App' }],
  })
  apps: App[];
}

export const AdvocateSchema = SchemaFactory.createForClass(Advocate);
