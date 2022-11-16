import { Resolver, Query, Args,ID } from "@nestjs/graphql";
import { AuthorService } from './author.service';
import { Author } from 'src/graphql.schema';

@Resolver('Author')
export class AuthorResolver {
    constructor(
        private readonly authorService: AuthorService
    ) {}

    @Query('author')
    author(@Args('id') authorid:number): Author {
        return this.authorService.queryAuthors(authorid);
    }
}