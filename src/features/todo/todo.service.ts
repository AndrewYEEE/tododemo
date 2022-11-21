import { Injectable,Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo,TodoDocument } from 'src/models/todo.model';
import { Model } from 'mongoose';
import { PostInfo,CreatePostResult, MyPost } from 'src/graphql.schema';
import { User, UserDocument } from 'src/models/user.model';
import { ApolloError } from "apollo-server-express";
import { ErrorCode } from 'src/modules/error.code';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis'; 
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TodoService {
    private pubSub: RedisPubSub;
    private readonly logger = new Logger(TodoService.name);
    constructor(      //用來讓Nest可以實例化的Model、Service寫在這，單純的物件寫在外面
      private readonly configService: ConfigService,
      @InjectModel(Todo.name)
      private readonly todoModel: Model<TodoDocument>,
      @InjectModel(User.name)
      private readonly userModel: Model<UserDocument>,
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

    private todos: { id: number, title: string, description: string }[] = [
        {
          id: 1,
          title: 'Title 1',
          description: ''
        }
    ];
    
    getTodos(): { id: number, title: string, description: string }[] {
        return this.todos;
    }

    createTodo(item: { id: number, title: string, description: string }) {
        this.todos.push(item);
    }

    async queryPosts(id:String): Promise<MyPost[]| null>{
      var ObjectId = require('mongoose').Types.ObjectId; 
      const result = await this.todoModel.find({owner:new ObjectId(id)}).populate("owner").exec();
      const animals = [];

      if (result){
        result.flatMap((element) => {
          // this.logger.log(`${element}`);
          animals.push(element);
        })
      }
      
      return animals //直接這樣就可以回傳，也太神奇
    }

    async createPost(id:String, postinfo:PostInfo) : Promise<CreatePostResult| null>{
      const userQuery = await this.userModel.findById(id);
      if (userQuery===null){
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
        this.pubSub.publish(id.toString(), { 
          postBeenCreated: {
            id: result._id,
            title: result.title,
            description: result.description,
            completed: result.completed,
            owner: {
              name: {
                firstName: result.owner.name.firstName,
                lastName: result.owner.name.lastName,
                fullName: result.owner.name.fullName,
              },
              email: result.owner.email,
            }
          }});
        return {
          postid: result._id,
          status: true,
        }
      }

      /*
        {
          completed: true,
          _id: new ObjectId("637b8217a90f1d5fd4034f3e"),
          title: 'hihi',
          description: 'hwllo world',
          owner: {
            _id: new ObjectId("6376340a1e88e9f829ba825d"),
            name: {
              firstName: 'Andrew',
              lastName: 'YEE',
              fullName: 'Andrew YEE',
              _id: new ObjectId("6376340a1e88e9f829ba825e"),
              createdAt: 2022-11-17T13:15:54.710Z,
              updatedAt: 2022-11-17T13:15:54.710Z
            },
            email: 'test@test.com',
            createdAt: 2022-11-17T13:15:54.712Z,
            updatedAt: 2022-11-17T13:15:54.712Z,
            __v: 0
          },
          createdAt: 2022-11-21T13:50:15.316Z,
          updatedAt: 2022-11-21T13:50:15.316Z,
          __v: 0
        }
       */
      return {
        postid: null,
        status: false, 
      }
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