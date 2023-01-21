
import { Resolver, Query, Args ,Mutation, Subscription} from "@nestjs/graphql";
import { TodoService  } from "./todo.service";
import {
  PostInfo,
  PostResult,
  TodoPost, 
  User as ApolloUser} from "src/graphql.schema";
import { User } from "src/models/user.model";
import {ApolloError,ForbiddenError} from "apollo-server-express";
import { ErrorCode } from 'src/modules/error.code';
import { UserService } from 'src/modules/user/user.service';
import { CurrentUser } from "../auth/auth.decorator";

@Resolver('Todo')
export class TodoResolver {
    constructor(
        private readonly todoService: TodoService,
        private readonly userService:UserService
    ) {}

    @Query('queryMyPosts')
    async queryMyPosts(@CurrentUser() user:User):Promise<TodoPost[]>{
        return this.todoService.queryMyPosts(user).catch(err => {
            throw new ApolloError(
                `Can not query post on MongoDB. `+err,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }

    @Query('queryMyPostTotal')
    async queryMyPostTotal(@CurrentUser() user:User):Promise<number>{
      return this.todoService.queryMyPostTotal(user);
    }

    @Query('queryPostByUserID')
    async queryPostByUserID(@Args('userid') userid: string,@Args('skip') skip: number,@Args('index') index: number):Promise<TodoPost[]>{
      return
    }

    @Query('queryPostTotal')
    async queryPostTotal():Promise<number>{
      return
    }
    
    @Mutation('createMyPost')
    async createMyPost(
        @CurrentUser() user:User,
        @Args('postinfo') postinfo: PostInfo):Promise<PostResult> {
        return this.todoService.createMyPost(user,postinfo).catch(err => {
            throw new ApolloError(
                `Can not create post on MongoDB. `+err,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }

    @Mutation('editMyPost')
    async editMyPost(@CurrentUser() user:User, @Args('postid') postid: string,@Args('postinfo') postinfo: PostInfo):Promise<PostResult>{
      return 
    }

    @Mutation('editPostByUserID')
    async editPostByUserID(@Args('userid') userid: string, @Args('postid') postid: string,@Args('postinfo') postinfo: PostInfo):Promise<PostResult>{
      return 
    }

    @Mutation('deleteMyPost')
    async deleteMyPost(@CurrentUser() user:User, @Args('postid') postid: string):Promise<PostResult>{
      return 
    }

    @Mutation('deletePostByID')
    async deletePostByID(@Args('userid') userid: string, @Args('postid') postid: string):Promise<PostResult>{
      return 
    }

    @Subscription(() => TodoPost)
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
