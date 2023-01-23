import { Resolver, Query, Args ,Mutation} from "@nestjs/graphql";
import { UserService } from './user.service';
import { 
    User as ApolloUser,
    UserInfo as ApolloUserInfo, 
    BasicInfo as ApolloBasicInfo,
    Result as ApolloResult,
    Action,
    Subject,
} from 'src/graphql.schema';
import { ApolloError } from 'apollo-server-express';
import { ErrorCode } from 'src/modules/error.code';
import { CurrentUser } from 'src/modules/auth/auth.decorator';
import { User } from 'src/models/user.model';
import { UseGuards } from '@nestjs/common';
import { PermissionGuard } from 'src/modules/permission/permission.guard';
import { CheckPermissions } from 'src/modules/permission/permission.handler';
import { AppAbility } from 'src/modules/permission/ability.factory';

@Resolver('User')
export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) {}

    @UseGuards(PermissionGuard)
    @CheckPermissions((ability: AppAbility) =>
        ability.can(Action.VIEW, Subject.ALL_USER) ||
        ability.can(Action.VIEW, Subject.MY_USER),
    )
    @Query('queryUser')
    async queryUser(@Args('id') authorid:String): Promise<ApolloUser> {
        const user= await this.userService.findUserById(authorid).catch(err =>{
            throw new ApolloError(
                `Can not query user on MongoDB.`,
                ErrorCode.MONGODB_ERROR,
            );
        });
        if (!user){
            throw new ApolloError(
                `user not found.`,
                ErrorCode.USER_NOT_FOUND,
            );
        }
        return user.toApolloUser();
    }

    @UseGuards(PermissionGuard)
    @CheckPermissions((ability: AppAbility) =>
        ability.can(Action.MODIFY, Subject.ALL_USER),
    )
    @Mutation('updateUser')
    async updateUser(@Args('id') id: string ,@Args('userUpdate') userUpdate:ApolloUserInfo): Promise<ApolloUser>{
        return this.userService.updateUser(id, userUpdate);
        //return 
    }

    @UseGuards(PermissionGuard)
    @CheckPermissions((ability: AppAbility) =>
        ability.can(Action.MODIFY, Subject.MY_USER),
    )
    @Mutation('updateSelf')
    async updateSelf(@CurrentUser() user: User, @Args('userUpdate') userUpdate:ApolloUserInfo): Promise<ApolloUser>{
        return this.userService.updateUser(user.id, userUpdate);
    }

    @UseGuards(PermissionGuard)
    @CheckPermissions((ability: AppAbility) =>
        ability.can(Action.ADD, Subject.ALL_USER),
    )
    @Mutation('createUser')
    async createUser(@Args('userInfo') basicInfo:ApolloBasicInfo):Promise<ApolloResult> {
        return this.userService.createUser(basicInfo).catch(err => {
            throw new ApolloError(
                `Can not create user on MongoDB.`+err,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }

    @UseGuards(PermissionGuard)
    @CheckPermissions((ability: AppAbility) =>
        ability.can(Action.REMOVE, Subject.ALL_USER),
    )
    @Mutation('deleteUser')
    async deleteUser(@Args('email') email: string):Promise<ApolloResult> {
        return this.userService.deleteUser(email).catch(err => {
            throw new ApolloError(
                `Can not delete user on MongoDB.`+err,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }


}