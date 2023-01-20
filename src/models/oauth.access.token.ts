import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';

@Schema({ timestamps: true })
export class OAuthAccessToken {   //比照oauth2-server官方建議設計 https://oauth2-server.readthedocs.io/en/latest/model/spec.html#model-savetoken
  _id: Types.ObjectId;

  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  user: User;

  @Prop()
  accessToken: string;

  @Prop()
  accessTokenExpiresAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type OAuthAccessTokenDocument = OAuthAccessToken & Document;
export const OAuthAccessTokenSchema =
  SchemaFactory.createForClass(OAuthAccessToken);
