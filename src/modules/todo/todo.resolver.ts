
import { Resolver, Query, Args ,Mutation, Subscription} from "@nestjs/graphql";
import { TodoService  } from "./todo.service";
import {PostInfo,CreatePostResult,MyPost} from "src/graphql.schema";
import {ApolloError,ForbiddenError} from "apollo-server-express";
import { ErrorCode } from 'src/modules/error.code';
import { UserService } from 'src/modules/user/user.service';

@Resolver('Todo')
export class TodoResolver {
    constructor(
        private readonly todoService: TodoService,
        private readonly userService:UserService
    ) {}

    @Query('queryPosts')
    async queryPosts(@Args('id') id:String):Promise<MyPost[]>{
        return this.todoService.queryPosts(id).catch(err => {
            throw new ApolloError(
                `Can not query post on MongoDB. `+err,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }
    
    @Mutation('createPost')
    async createPost(
        @Args('id') id:String,
        @Args('postinfo') postinfo: PostInfo):Promise<CreatePostResult> {
        return this.todoService.createPost(id,postinfo).catch(err => {
            throw new ApolloError(
                `Can not create post on MongoDB. `+err,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }

    @Subscription(() => MyPost)
    async postBeenCreated(          //注意Subscription不特別寫return參數型別
      @Args('userid') userid:String,
    ) { 
      const userCheck = await this.userService.findUserById(userid);
      if (userCheck===null){
        throw new ForbiddenError(
            `You have no permission to get user for ${userid} or user not exist.`,
        );
      }
      return this.todoService.postBeenCreated(userid.toString());
    }
}