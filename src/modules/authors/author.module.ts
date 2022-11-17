import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorResolver } from './author.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {User, UserSchema} from '../../models/user.model';


@Module({
    imports: [
        MongooseModule.forFeature([
            {
              name: User.name,
              schema: UserSchema,
              collection: 'users',
            },
         ]),
    ],
    providers: [AuthorService, AuthorResolver],
})
export class AuthorModule {}
