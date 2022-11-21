import { Logger,Injectable,UseFilters } from "@nestjs/common";
import { Author,AuthorInfo,CreateResult,AuthorUpdate } from 'src/graphql.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserInfo, UserDocument} from 'src/models/user.model'
import { MongoExceptionFilter } from 'src/modules/mongo-exception.filter';

@Injectable()
export class AuthorService {
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>;
    private readonly logger = new Logger(AuthorService.name);

    async queryAuthors(authorid:String): Promise<Author> {
        this.logger.log(authorid)
        const Result = await this.userModel.findById(authorid)
        if (Result){
            return {
                id: Result._id,
                firstName: Result.name.firstName,
                lastName: Result.name.lastName,
                fullName: Result.name.fullName,
                email: Result.email,
            }
        }
        return null
    }

    async updateAuthor(id:String, authorUpdate:AuthorUpdate): Promise<Author>{
        this.logger.log(id,authorUpdate);
        const Result = await this.userModel.findByIdAndUpdate(id,authorUpdate,{new: true}); //回傳更新後的結果
        if (Result){
            return {
                id: Result._id,
                firstName: Result.name.firstName,
                lastName: Result.name.lastName,
                fullName: Result.name.fullName,
                email: Result.email,
            }
        }
        return null
    }

    @UseFilters(MongoExceptionFilter)  //<-----沒有用
    async createAuthor(authorInfo:AuthorInfo):Promise<CreateResult>{
        const userinfo: UserInfo={
            firstName: authorInfo.firstName,
            lastName: authorInfo.lastName,
            fullName: authorInfo.fullName, 
        }
        const getResult = await this.userModel.create({name:userinfo,email:authorInfo.email})
        if (getResult!==null) {
            const ID = getResult._id;
            this.logger.log(`A user has been created. id: ${ID}`)
            return {
                id:ID,
                status:true
            }
        }
        // throw new ApolloError(
        //     `Can not create user on MongoDB.`,
        //     ErrorCode.MONGODB_ERROR,
        //   );
        return {
            id:null,
            status:false
        }
    }
    
}



