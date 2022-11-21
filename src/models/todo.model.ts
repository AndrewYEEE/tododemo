import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {

  @Prop({ required: true, maxlength: 100 })
  title: string;

  @Prop({ maxlength: 500 })
  description: string;

  @Prop({ default:false })
  completed: boolean;

  @Prop({ type: Types.ObjectId, ref: User.name, autopopulate: true })
  owner: User;

}

export const TodoSchema = SchemaFactory.createForClass(Todo);