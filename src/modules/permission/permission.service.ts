import { Injectable,Logger } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { Constants } from 'src/constants';
import { ErrorCode } from 'src/modules/error.code';
import { Permission, PermissionDocument, Rule } from 'src/models/permission';
import { RoleTemplate, RoleTemplateDocument } from 'src/models/role.template';
import { PermissionInput,Roles } from 'src/graphql.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Action, Subject } from 'src/graphql.schema';

@Injectable()
export class PermissionService {
    private readonly logger = new Logger(PermissionService.name);

    constructor(
        @InjectModel(Permission.name)
        private readonly permissionModel: Model<PermissionDocument>,
        @InjectModel(RoleTemplate.name)
        private readonly roleTemplateModel: Model<RoleTemplateDocument>,
    ) {}
    
    async Roleinit(){
        //create Admin Permission
        const adminPer = [
            { action: Action.VIEW, subject: Subject.MY_USER},
            { action: Action.ADD, subject: Subject.MY_USER},
            { action: Action.MODIFY, subject: Subject.MY_USER},
            { action: Action.REMOVE, subject: Subject.MY_USER},
            { action: Action.VIEW, subject: Subject.ALL_USER},
            { action: Action.ADD, subject: Subject.ALL_USER},
            { action: Action.MODIFY, subject: Subject.ALL_USER},
            { action: Action.REMOVE, subject: Subject.ALL_USER},
            { action: Action.VIEW, subject: Subject.MY_TODO},
            { action: Action.ADD, subject: Subject.MY_TODO},
            { action: Action.MODIFY, subject: Subject.MY_TODO},
            { action: Action.REMOVE, subject: Subject.MY_TODO},
            { action: Action.VIEW, subject: Subject.ALL_TODO},
            { action: Action.ADD, subject: Subject.ALL_TODO},
            { action: Action.MODIFY, subject: Subject.ALL_TODO},
            { action: Action.REMOVE, subject: Subject.ALL_TODO},
        ]
        await this.createRoleTemplate(Roles.ADMIN,adminPer);
        
        //create member Permission
        const memberPer = [
            { action: Action.VIEW, subject: Subject.MY_USER},
            { action: Action.ADD, subject: Subject.MY_USER},
            { action: Action.MODIFY, subject: Subject.MY_USER},
            { action: Action.REMOVE, subject: Subject.MY_USER},
            { action: Action.VIEW, subject: Subject.MY_TODO},
            { action: Action.ADD, subject: Subject.MY_TODO},
            { action: Action.MODIFY, subject: Subject.MY_TODO},
            { action: Action.REMOVE, subject: Subject.MY_TODO},
        ]
        await this.createRoleTemplate(Roles.MEMBER,memberPer);

        //create unknown Permission
        const unknownPer = []
        await this.createRoleTemplate(Roles.UNKNOWN,unknownPer);
    }

    async createPermission(inputs: PermissionInput[]): Promise<Permission> { //建立一個permission Document
        // create the permission on the database
        const permission = new Permission();  //從Mongoose的Schema來 (permission.ts)
        permission.rules = inputs.flatMap((input) => { //inputs=[{action,subject},{action,subject},{action,subject}....]
            const rule = new Rule(); //從Mongoose的Schema來 (permission.ts)
            rule.action = input.action;
            rule.subject = input.subject;
            return rule;
        });

        return this.permissionModel.create(permission); //建立Permission Document
    }

    async updatePermission(id: string, inputs: PermissionInput[]): Promise<Permission> { //更新permission Document
    return this.permissionModel.findByIdAndUpdate(
        id,
        {
        rules: inputs as Rule[],
        },
        {
        new: true,  //指定回傳的物件要是更新過的
        useFindAndModify: false, //因為Mongoose部分功能是使用Mongo Driver舊版的useFindAndModify Method(findByIdAndUpdate就是其中之一)，因此設成false強制讓Driver使用新版的。
        },
    );
    }

    async getPermission(id: string): Promise<Permission> {   //查詢指定的permission Document (用id)
    const permission = await this.permissionModel.findOne({
        _id: id,
    });

    return permission;
    }

    async deletePermission(permissionIds: string[]): Promise<Permission[]> { //從permissionModel中刪除多個permission Document //??? 不知道為何要用List[]
    return Promise.all(
        permissionIds.map(async (it) => {
        return this.permissionModel.findByIdAndDelete(it); //刪除permission
        }),
    );
    }

    
    async createRoleTemplate(rolename: Roles, inputs: PermissionInput[]): Promise<RoleTemplate> { //建立RoleTemplate (先建立Permission Document物件再建立RoleTemplate)
        // max length for name is 200
        if (!this.isValidRoleTemplateName(rolename)) {  //檢查使用者是否輸入非法字串
          throw new ApolloError(
            'Please check the length of your inputs.',
            ErrorCode.INPUT_PARAMETERS_INVALID,
          );
        }
    
        // check the duplicated name
        const role = await this.roleTemplateModel.findOne({ name: rolename }); //檢查是否已經存在此Role
        if (role !== null) {
            this.logger.log(`There is a role template '${rolename}' in the DB, please create the new one.`)
            //   throw new ApolloError(
            //     `There is a role template '${name}' in the DB, please create the new one.`,
            //     ErrorCode.ROLE_TEMPLATE_DUPLICATED,
            //   );
            return null;
        }else{
            const permission = await this.createPermission(inputs); //建立Permission Document物件
            const roleTemplate = new RoleTemplate(); //建立RoleTemplate
            roleTemplate.name = rolename;
            roleTemplate.permission = permission;
        
            return await this.roleTemplateModel.create(roleTemplate); //建立RoleTemplate
        }
    }

    async queryRoleTemplate(rolename: string):Promise<RoleTemplate>{
        // check the duplicated name
        const role = await this.roleTemplateModel.findOne({ name: rolename }); //檢查是否已經存在此Role
        if (!role) {
            this.logger.log(`There is a role template '${rolename}' in the DB`)
            return null;
        }else{
            return role;
        }
    }

    async deleteRoleTemplate(templateId: string): Promise<boolean> {  //刪除RoleTemplate (先刪除RoleTemplate物件再刪除Permission Document)
        const role = await this.roleTemplateModel.findByIdAndDelete(templateId); //刪除，Mongoose會回傳被刪除的物件原貌
        return !!(await this.deletePermission([role.permission._id.toHexString()])); //依據原貌中紀錄的permission id刪除permission //??? 不知道為何要用List送
    }

    async editRoleTemplate(  //修改RoleTemplate
    templateId: string,
    name?: Roles, //修改Role Name用
    permissionInputs?: PermissionInput[], //修改Permission用
    ): Promise<RoleTemplate> {
        const role = await this.roleTemplateModel.findById(templateId); //檢查Role物件是否存在
        if (!role) {
            throw new ApolloError(
            `Cannot find the role template for '${templateId}' in the DB.`,
            ErrorCode.ROLE_TEMPLATE_NOT_FOUND,
            );
        }

        if (name !== undefined) {
            // max length for name is 200
            if (!this.isValidRoleTemplateName(name)) { //檢查使用者是否輸入非法字串
            throw new ApolloError(
                'Please check the length of your inputs.',
                ErrorCode.INPUT_PARAMETERS_INVALID,
            );
            }

            // check the duplicated name
            const duplicatedRole = await this.roleTemplateModel.findOne({  
            name,
            _id: {
                $ne: new Types.ObjectId(templateId),
            },
            }); //確認是否有相同name但不同id的Role已經存在
            if (duplicatedRole) {
            throw new ApolloError(
                `There is a role template '${name}' in the DB, please assign a new name.`,
                ErrorCode.ROLE_TEMPLATE_DUPLICATED,
            );
            }
            role.name = name; //不存在則代表目前id指向的是唯一的name，將傳進來的name複寫
        }

        if (permissionInputs !== undefined) {
            const permissionId = role.permission._id.toHexString();  //從RoleTemplate中撈出配對的Permission ID
            await this.updatePermission(permissionId, permissionInputs); //更新配對的permission
        }

        return this.roleTemplateModel
            .findByIdAndUpdate(templateId, role, {
            useFindAndModify: false, //因為Mongoose部分功能是使用Mongo Driver舊版的useFindAndModify Method(findByIdAndUpdate就是其中之一)，因此設成false強制讓Driver使用新版的。
            new: true,
            })
            .populate({ path: 'permission' }); //更新Role並用populate連動permission物件
    }

    private isValidRoleTemplateName(name?: string): boolean {  //檢查name (實質上只有檢查長度)
    if (name !== undefined) {
        if (name === null || name.length > 200) {
        return false;
        }
    }

    return true;
    }

}
