import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {

  @Prop({ required: true, maxlength: 20 })
  title: string;

  @Prop({ maxlength: 200 })
  description: string;

  @Prop({ required: true })
  completed: boolean;

}