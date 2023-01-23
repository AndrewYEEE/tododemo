import { Module,forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.model';
import { TodoModule } from 'src/modules/todo/todo.module'
import { PermissionModule } from 'src/modules/permission/permission.module'
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
      MongooseModule.forFeature([
        {
          name: User.name,
          schema: UserSchema,
          collection: 'users',
        },
      ]),
      forwardRef(() => TodoModule),
      PermissionModule,
      forwardRef(() => AuthModule),
    ],
    providers: [UserService, UserResolver],
    exports: [UserService],
})
export class UserModule {}
