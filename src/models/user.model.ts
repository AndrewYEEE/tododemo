import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserInfo {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  fullName: string;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo)



@Schema({ timestamps: true })
export class User {

  @Prop({type : UserInfoSchema})
  name: UserInfo;
  
  @Prop({ index: true, unique: true ,required: true })
  email: string;

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User)