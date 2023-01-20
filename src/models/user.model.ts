import { Prop, Schema, SchemaFactory,raw } from '@nestjs/mongoose';
import { Document,Types } from 'mongoose';
import { Constants, Role  } from 'src/constants';
import {
  User as ApolloUser,
  Roles as ApolloRoles,
} from 'src/graphql.schema';


@Schema({ timestamps: true })
export class UserInfo {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  Age: number;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo)


@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  id: string;

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

  toApolloUser: () => ApolloUser;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toApolloUser = function (this: User): ApolloUser {  //依據呼叫者物件本身(this)來建立GraphQL User物件
  const apolloUser = new ApolloUser();  //GraphQL的物件
  apolloUser.id = this._id.toString();
  apolloUser.email = this.email;
  apolloUser.username = this.username;
  apolloUser.firstname = this.detail.firstName;
  apolloUser.lastname = this.detail.lastName;
  switch (this.role) {
    case Role.ADMIN:
      apolloUser.role=ApolloRoles.ADMIN;
    case Role.MEMBER:
      apolloUser.role=ApolloRoles.NMEMBER;
  }
  apolloUser.age=this.detail.Age;
  return apolloUser;
};
