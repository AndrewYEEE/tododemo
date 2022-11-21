import { Resolver, Query, Args ,Mutation} from "@nestjs/graphql";
import { AuthorService } from './author.service';
import { Author,AuthorInfo,CreateResult,AuthorUpdate } from 'src/graphql.schema';
import { ApolloError } from 'apollo-server-express';
import { ErrorCode } from 'src/modules/error.code';

@Resolver('Author')
export class AuthorResolver {
    constructor(
        private readonly authorService: AuthorService
    ) {}

    @Query('queryAuthor')
    async queryAuthor(@Args('id') authorid:String): Promise<Author> {
        return this.authorService.queryAuthors(authorid).catch(err =>{
            throw new ApolloError(
                `Can not query user on MongoDB.`,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }

    @Mutation('updateAuthor')
    async updateAuthor(
        @Args('id') id:String,
        @Args('authorUpdate') authorUpdate:AuthorUpdate): Promise<Author>{
        return this.authorService.updateAuthor(id, authorUpdate);
    }

    @Mutation('createAuthor')
    async createAuthor(@Args('authorInfo') authorInfo:AuthorInfo):Promise<CreateResult> {
        return this.authorService.createAuthor(authorInfo).catch(err => {
            throw new ApolloError(
                `Can not create user on MongoDB.`,
                ErrorCode.MONGODB_ERROR,
              );
        });
    }
}