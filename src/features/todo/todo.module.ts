import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo,TodoSchema } from 'src/models/todo.model';
import { User,UserSchema } from 'src/models/user.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Todo.name,
        schema: TodoSchema,
        collection: 'todos',
      },
      {
        name: User.name,
        schema: UserSchema,
        collection: 'users',
      },
   ]),
  ],
  controllers: [TodoController],
  providers: [TodoService,TodoResolver],
  exports: [TodoService]
})
export class TodoModule {}
