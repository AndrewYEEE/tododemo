import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from 'src/models/permission';
import { RoleTemplate, RoleTemplateSchema } from 'src/models/role.template';
import { AbilityFactory } from './ability.factory';

@Module({
  imports: [
    MongooseModule.forFeature([   //導入Mongoose Module
      {
        name: Permission.name,     //Schema Class名稱
        schema: PermissionSchema,  //Schema 物件
        collection: 'permissions', //對應的collection資料表
      },
      {
        name: RoleTemplate.name,      //Schema Class名稱
        schema: RoleTemplateSchema,   //Schema 物件
        collection: 'role_templates', //對應的collection資料表
      },
    ]),
  ],
  providers: [AbilityFactory, PermissionResolver, PermissionService], //AbilityFactory是為了依user建立ability權限物件用
  exports: [AbilityFactory, PermissionService],
})
export class PermissionModule {}
