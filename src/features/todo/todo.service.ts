import { Injectable,Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo,TodoDocument } from 'src/models/todo.model';
import { Model } from 'mongoose';
import { PostInfo,CreatePostResult, MyPost } from 'src/graphql.schema';
import { User, UserDocument } from 'src/models/user.model';
import { ApolloError } from "apollo-server-express";
import { ErrorCode } from 'src/modules/error.code';

@Injectable()
export class TodoService {
    @InjectModel(Todo.name)
    private readonly todoModel: Model<TodoDocument>;
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>;
    private readonly logger = new Logger(TodoService.name);

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
      if (result){
        result.flatMap(async (element) => {
          this.logger.log(`${element}`);
        })
      }
      
      return
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
      postcreate.owner = userQuery;
      const result = await postcreate.save()
      if (result){
        this.logger.log(result._id)
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