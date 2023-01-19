import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';
import { Constants } from 'src/constants';
import { Context } from '@nestjs/graphql';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {

  @Prop({ 
    required: true, 
    maxlength: Constants.TODO_TITLE_MAX_LEN,
    minlength: Constants.TODO_TITLE_MIN_LEN,
   })
  title: string;

  @Prop({ 
    maxlength: Constants.TODO_DESCRIPTION_MAX_LEN,
   })
  description: string;

  @Prop({ 
    required: true,
    default: false,
   })
  completed: boolean;

  @Prop({ 
    type: Types.ObjectId, 
    ref: User.name, 
    autopopulate: true,
   })
  owner: User;

}

export const TodoSchema = SchemaFactory.createForClass(Todo);