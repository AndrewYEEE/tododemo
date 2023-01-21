import { Injectable,Logger,forwardRef,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo,TodoDocument } from 'src/models/todo.model';
import { Model } from 'mongoose';
import { PostInfo,PostResult, TodoPost } from 'src/graphql.schema';
import { User, UserDocument } from 'src/models/user.model';
import { ApolloError } from "apollo-server-express";
import { ErrorCode } from 'src/modules/error.code';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis'; 
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class TodoService {
    private pubSub: RedisPubSub;
    private readonly logger = new Logger(TodoService.name);
    constructor(      //用來讓Nest可以實例化的Model、Service寫在這，單純的物件寫在外面
      private readonly configService: ConfigService,
      @Inject(forwardRef(() => UserService))
      private readonly userService: UserService,
      @InjectModel(Todo.name)
      private readonly todoModel: Model<TodoDocument>,
    ){
      const dateReviver = (_: any, value: string) => {
        const isISO8601Z =
          /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
        if (typeof value === 'string' && isISO8601Z.test(value)) {
          const tempDateNumber = Date.parse(value);
          if (!Number.isNaN(tempDateNumber)) {
            return new Date(tempDateNumber);
          }
        }
        return value;
      };
  
      const options = {
        retryStrategy: (times: number) => {
          // reconnect after
          return Math.min(times * 50, 2000);
        },
      };
  
      this.pubSub = new RedisPubSub({
        publisher: new Redis(
          this.configService.get<string>('REDIS_URI'),
          options,
        ),
        subscriber: new Redis(
          this.configService.get<string>('REDIS_URI'),
          options,
        ),
        reviver: dateReviver,
      });
    }

    async queryMyPosts(user: User): Promise<TodoPost[]| null>{
      var ObjectId = require('mongoose').Types.ObjectId; 
      const result = await this.todoModel.find({owner:new ObjectId(user._id)}).populate("owner").exec();
      const todos = [];

      if (result){
        result.flatMap((element) => {
          // this.logger.log(`${element}`);
          todos.push(element);
        })
      }
      
      return todos //直接這樣就可以回傳，也太神奇
    }

    async queryMyPostTotal(user: User): Promise<number>{
      const check = await this.userService.findUserById(user.id);
      if(!check){
        throw new ApolloError(
          `User id not found on MongoDB.`,
          ErrorCode.AUTH_USER_NOT_FOUND,
        );
      }

      const total = await this.todoModel.count(
        { owner: user._id }
      )
      if(!total){
        throw new ApolloError(
          `Todo Query failed on MongoDB.`,
          ErrorCode.TODO_QUERY_FAILED,
        );
      }
      
      return total;

    }

    async createMyPost(user: User, postinfo:PostInfo) : Promise<PostResult| null>{
      this.logger.log(user.email);
      this.logger.log(user.id);
      this.logger.log(user._id);

      const userQuery = await this.userService.findUserById(user.id);
      if (!userQuery){
        throw new ApolloError(
          `User id not found on MongoDB.`,
          ErrorCode.AUTH_USER_NOT_FOUND,
        );
      }

      const postcreate = new this.todoModel()
      postcreate.title = postinfo.title;
      postcreate.description = postinfo.description;
      postcreate.completed = postinfo.completed;
      postcreate.owner = userQuery;
      const result = await postcreate.save()
      if (result){
        //this.logger.log(`${result}`)
        //send to redis
        this.pubSub.publish(userQuery._id.toString(), { 
          postBeenCreated: {
            id: result._id,
            title: result.title,
            description: result.description,
            completed: result.completed,
          }});
        return {
          postid: result._id,
          status: true,
        }
      }

    
      return {
        postid: null,
        status: false, 
      }
    }

    async deletePosts(user:User): Promise<Boolean>{
      const { deletedCount } = await this.todoModel.deleteMany(
        {
          owner: user
        }
      )
      if (!deletedCount){
        return false
      }
      return true 
    }

    async postBeenCreated(userid:string): Promise<AsyncIterator<unknown>> {
      return this.pubSub.asyncIterator(userid);
    }

}

/*
參考:
const group = await this.groupService.getGroup(inviteUserInput.groupId);
    if (group === null) {
      throw new ApolloError(
        `Cannot find group ${inviteUserInput.groupId} in the database.`,
        ErrorCode.GROUP_NOT_FOUND,
      );
    }

    let user = await this.findUser(inviteUserInput.email);
    const permissions = inviteUserInput.permissions || [];
    if (user === null) {
      // the completely new user
      // create the permission
      const permission = await this.permissionService.create(permissions);

      // create user
      user = new User();
      user.email = inviteUserInput.email;
      user.status = UserStatus.WAITING;

      const groupInfo = new GroupInfo();
      groupInfo.inUse = true;
      groupInfo.group = group;
      groupInfo.permission = permission;

      user.groups.push(groupInfo);
      user = await this.userModel.create(user);

*/