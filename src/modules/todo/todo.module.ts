import { Module,forwardRef } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { UserModule } from 'src/modules/user/user.module'
import { MongooseModule } from '@nestjs/mongoose';
import { Todo,TodoSchema } from 'src/models/todo.model';
import { PermissionModule } from 'src/modules/permission/permission.module'

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Todo.name,
        schema: TodoSchema,
        collection: 'todos',
      },
    ]),
    forwardRef(() => UserModule),
    PermissionModule,
  ],
  controllers: [TodoController],
  providers: [TodoService,TodoResolver],
  exports: [TodoService]
})
export class TodoModule {}
