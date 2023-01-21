import { Resolver, Query, Args ,Mutation} from "@nestjs/graphql";
import { UserService } from './user.service';
import { 
    User as ApolloUser,
    UserInfo as ApolloUserInfo, 
    BasicInfo as ApolloBasicInfo,
    Result as ApolloResult,
} from 'src/graphql.schema';
import { ApolloError } from 'apollo-server-express';
import { ErrorCode } from 'src/modules/error.code';
import { CurrentUser } from 'src/modules/auth/auth.decorator';
import { User } from 'src/models/user.model';

@Resolver('User')
export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Query('queryUser')
    async queryUser(@Args('id') authorid:String): Promise<ApolloUser> {
        const user= await this.userService.findUserById(authorid).catch(err =>{
            throw new ApolloError(
                `Can not query user on MongoDB.`,
                ErrorCode.MONGODB_ERROR,
              );
        });
        return user.toApolloUser();
    }

    @Mutation('updateUser')
    async updateUser(@Args('id') id: string ,@Args('userUpdate') userUpdate:ApolloUserInfo): Promise<ApolloUser>{
        return this.userService.updateUser(id, userUpdate);
        //return 
    }

    @Mutation('updateSelf')
    async updateSelf(@CurrentUser() user: User, @Args('userUpdate') userUpdate:ApolloUserInfo): Promise<ApolloUser>{
        return this.userService.updateUser(user.id, userUpdate);
    }

    @Mutation('createUser')
    async createUser(@Args('userInfo') basicInfo:ApolloBasicInfo):Promise<ApolloResult> {
        return this.userService.createUser(basicInfo).catch(err => {
            throw new ApolloError(
                `Can not create user on MongoDB.`+err,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }

    @Mutation('deleteUser')
    async deleteUser(@Args('userInfo') email: string):Promise<ApolloResult> {
        return this.userService.deleteUser(email).catch(err => {
            throw new ApolloError(
                `Can not create user on MongoDB.`+err,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }


}