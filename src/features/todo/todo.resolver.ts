
import { Resolver, Query, Args ,Mutation} from "@nestjs/graphql";
import { TodoService  } from "./todo.service";
import {PostInfo,CreatePostResult,MyPost} from "src/graphql.schema";
import {ApolloError} from "apollo-server-express";
import { ErrorCode } from 'src/modules/error.code';

@Resolver('Todo')
export class TodoResolver {
    constructor(
        private readonly todoService: TodoService
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
}