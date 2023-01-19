import { Logger,Injectable,UseFilters,OnModuleInit  } from "@nestjs/common";
import { 
    User as ApolloUser,
    UserInfo as ApolloUserInfo, 
    Result as ApolloResult,
} from 'src/graphql.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserInfo, UserDocument} from 'src/models/user.model';
import { Role } from "src/constants";
import { CommonUtility } from "src/modules/utils/common.utility";
import { MongoExceptionFilter } from 'src/modules/mongo-exception.filter';

@Injectable()
export class UserService implements OnModuleInit{
    constructor(
        private readonly configService: ConfigService,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ){}

    private readonly logger = new Logger(UserService.name);

    async onModuleInit() {
        const root = await this.initialize();
        this.logger.log(`The root user would be ${root.email}`);
    }

    async initialize(): Promise<User>{
        // create the root user
        const rootUser = await this.findUser(
            this.configService.get<string>('ROOT_USER_EMAIL'),
        ); //檢查資料庫有無rootUser
    
        if (rootUser) {  //如果已經有RootUser物件
            return rootUser;
        } else { //如果沒有則建立新的
            const user = new User();  //建立User物件
            user.username = this.configService.get<string>('ROOT_USER_NAME');
            user.role = Role.ADMIN;
            user.email = this.configService.get<string>('ROOT_USER_EMAIL');
            user.password = CommonUtility.encryptBySalt(this.configService.get<string>('ROOT_USER_PASSWORD'))
            this.logger.log(
                `There is no user in the System, and create it automatically: ${JSON.stringify(
                user,
            )}`,
            );
            return this.userModel.create(user); //建立user
        }
    }

    async findUser(email: string): Promise<User | null> { //利用email取得user物件
        const user = await this.userModel.findOne({
          //這裡的await是因為findOne(Mongoose專用)回傳的是Promise，強制等到回傳後再繼續
          email,
        });
        return user;
      }

    async findUserById(authorid:String): Promise<ApolloUser> {
        this.logger.log(authorid)
        const Result = await this.userModel.findById(authorid)
        // if (Result){
        //     return {
        //         id: Result._id,
        //         firstName: Result.name.firstName,
        //         lastName: Result.name.lastName,
        //         fullName: Result.name.fullName,
        //         email: Result.email,
        //     }
        // }
        return null
    }

    async updateUser(id:String, userUpdate:ApolloUserInfo): Promise<ApolloUser>{
        this.logger.log(id,userUpdate);
        const Result = await this.userModel.findByIdAndUpdate(id,userUpdate,{new: true}); //回傳更新後的結果
        // if (Result){
        //     return {
        //         id: Result._id,
        //         firstName: Result.name.firstName,
        //         lastName: Result.name.lastName,
        //         fullName: Result.name.fullName,
        //         email: Result.email,
        //     }
        // }
        return null
    }

    async createUser(userInfo:ApolloUserInfo):Promise<ApolloResult>{
        // const userinfo: UserInfo={
        //     firstName: authorInfo.firstName,
        //     lastName: authorInfo.lastName,
        //     fullName: authorInfo.fullName, 
        // }
        // const getResult = await this.userModel.create({name:userinfo,email:authorInfo.email})
        // if (getResult!==null) {
        //     const ID = getResult._id;
        //     this.logger.log(`A user has been created. id: ${ID}`)
        //     return {
        //         id:ID,
        //         status:true
        //     }
        // }
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



