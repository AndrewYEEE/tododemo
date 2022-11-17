import { Logger,Injectable } from "@nestjs/common";
import { Author } from 'src/graphql.schema';


@Injectable()
export class AuthorService {
    private readonly logger = new Logger(AuthorService.name);
    private authors: Author[] = [
        {id: 1,firstName: "Stephen", lastName: "John"},
        {id: 2,firstName: "Andrew", lastName: "Jeckson"},
        {id: 3,firstName: "Andy", lastName: "Tom"},
    ];

    queryAuthors(authorid:number): Author {
        this.logger.log(authorid)
        return this.authors.find(({id})=> id==authorid)
    }

    
}



