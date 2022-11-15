import { Module } from '@nestjs/common';
import { CopyTodoController } from './copy-todo.controller';
import { TodoModule } from '../todo/todo.module';

@Module({
  imports:[
    TodoModule,
  ],
  controllers: [CopyTodoController]
})
export class CopyTodoModule {}
