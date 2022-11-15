import { Controller,Post,Body } from '@nestjs/common';
import { TodoService } from '../todo/todo.service';

@Controller('copy-todo')
export class CopyTodoController {
    constructor(
        private readonly todoService: TodoService
    ) {
        //do something.....
    }
    
    @Post()
    create(@Body() body: { id: number, title: string, description: string }) {
        this.todoService.createTodo(body);
        return body;
    }
}
