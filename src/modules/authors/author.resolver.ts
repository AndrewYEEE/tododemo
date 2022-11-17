import { Resolver, Query, Args ,Mutation} from "@nestjs/graphql";
import { AuthorService } from './author.service';
import { Author,AuthorInfo } from 'src/graphql.schema';

@Resolver('Author')
export class AuthorResolver {
    constructor(
        private readonly authorService: AuthorService
    ) {}

    @Query('author')
    author(@Args('id') authorid:number): Author {
        return this.authorService.queryAuthors(authorid);
    }

    @Mutation('createAuthor')
    async createAuthor(@Args('authorInfo') authorInfo:AuthorInfo):Promise<Boolean> {
        return this.authorService.createAuthor(authorInfo);
    }
}