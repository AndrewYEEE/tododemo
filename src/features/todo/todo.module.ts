import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { AuthorModule } from 'src/modules/authors/author.module'
import { AuthorService } from 'src/modules/authors/author.service'
import { MongooseModule } from '@nestjs/mongoose';
import { Todo,TodoSchema } from 'src/models/todo.model';
import { User,UserSchema } from 'src/models/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule,
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
   AuthorModule,
  ],
  controllers: [TodoController],
  providers: [TodoService,TodoResolver],
  exports: [TodoService]
})
export class TodoModule {}
