import { Prop, Schema, SchemaFactory,raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Constants, Role  } from 'src/constants';

@Schema({ timestamps: true })
export class UserInfo {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  Age: Number;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo)


@Schema({ timestamps: true })
export class User {
  @Prop({ 
    required : true,
    minlength : Constants.USER_USERNAME_MIN_LEN,
    maxlength : Constants.USER_USERNAME_MAX_LEN,
  })
  username: string;

  @Prop({
    required: true,
    type: raw({
      hash: String,
      salt: String,
    }),
  })
  password: { hash: string; salt: string };

  @Prop({ 
    type : UserInfoSchema
  })
  detail: UserInfo;
  
  @Prop({ 
    index: true, 
    unique: true ,
    required: true,
  })
  email: string;  //等同於Account

  @Prop({
    required: true,
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User)