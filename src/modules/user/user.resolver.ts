import { Resolver, Query, Args ,Mutation} from "@nestjs/graphql";
import { UserService } from './user.service';
import { 
    User as ApolloUser,
    UserInfo as ApolloUserInfo, 
    Result as ApolloResult,
} from 'src/graphql.schema';
import { ApolloError } from 'apollo-server-express';
import { ErrorCode } from 'src/modules/error.code';
import { User } from './user.decorator';

@Resolver('User')
export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Query('queryUser')
    async queryUser(@User() user: any,@Args('id') authorid:String): Promise<ApolloUser> {
        return this.userService.findUserById(authorid).catch(err =>{
            throw new ApolloError(
                `Can not query user on MongoDB.`,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }

    @Mutation('updateUser')
    async updateUser(
        @Args('id') id:String,
        @Args('userUpdate') userUpdate:ApolloUserInfo): Promise<ApolloUser>{
        return this.userService.updateUser(id, userUpdate);
    }

    @Mutation('createUser')
    async createUser(@Args('userInfo') userInfo:ApolloUserInfo):Promise<ApolloResult> {
        return this.userService.createUser(userInfo).catch(err => {
            throw new ApolloError(
                `Can not create user on MongoDB.`+err,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }
}