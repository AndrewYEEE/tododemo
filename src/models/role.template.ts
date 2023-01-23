import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoleTemplate as ApolloRoleTemplate,Roles } from 'src/graphql.schema';
import { Permission } from './permission';

@Schema()
export class RoleTemplate {  //定義角色Schema 
    _id: Types.ObjectId;

    id: string;

    @Prop()
    name: Roles;

    @Prop({ type: Types.ObjectId, ref: Permission.name, autopopulate: true })
    permission: Permission;    //每種角色綁定一種全限規範模板

    toApolloRoleTemplate: () => ApolloRoleTemplate;  //自訂函式將Mongoose Document轉成GraphQL Schema物件
}

export type RoleTemplateDocument = RoleTemplate & Document;  //匯出角色Schema Document
export const RoleTemplateSchema = SchemaFactory.createForClass(RoleTemplate); //匯出角色Schema

RoleTemplateSchema.methods.toApolloRoleTemplate = function ( //將一個RoleTemplate轉成GraphQL物件
  this: RoleTemplate,
): ApolloRoleTemplate {
  const apolloRoleTemplate = new ApolloRoleTemplate();
  apolloRoleTemplate.id = this._id.toHexString();
  switch (this.name) { //enum
    case Roles.ADMIN:
        apolloRoleTemplate.name = "ADMIN";
        break;
    case Roles.MEMBER:
        apolloRoleTemplate.name = "MEMBER";
        break;
    default:
        apolloRoleTemplate.name = "UNKNOWN";
        break;
  }
  apolloRoleTemplate.permission = this.permission;
  return apolloRoleTemplate;
};
