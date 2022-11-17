import { Logger,Injectable } from "@nestjs/common";
import { Author,AuthorInfo } from 'src/graphql.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserInfo, UserDocument, UserInfoSchema} from '../../models/user.model'

@Injectable()
export class AuthorService {
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>;
    private readonly logger = new Logger(AuthorService.name);
    private authors: Author[] = [
        {id: 1,firstName: "Stephen", lastName: "John",fullName:"Stephen John", email:""},
        {id: 2,firstName: "Andrew", lastName: "Jeckson",fullName:"Andrew Jeckson",email:""},
        {id: 3,firstName: "Andy", lastName: "Tom",fullName:"Andy Tom",email:""},
    ];

    queryAuthors(authorid:number): Author {
        this.logger.log(authorid)
        return this.authors.find(({id})=> id==authorid)
    }

    async createAuthor(authorInfo:AuthorInfo):Promise<Boolean>{
        var userinfo: UserInfo={
            firstName: authorInfo.firstName,
            lastName: authorInfo.lastName,
            fullName: authorInfo.fullName, 
        }

        if (this.userModel.create({name:userinfo,email:authorInfo.email}) !=null){
            return true 
        }
        return false 
    }
    
}



