import { Logger,Injectable,forwardRef,OnModuleInit,Inject} from "@nestjs/common";
import { 
    User as ApolloUser,
    UserInfo as ApolloUserInfo, 
    BasicInfo as ApolloBasicInfo,
    Result as ApolloResult,
    Roles,
} from 'src/graphql.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ApolloError } from 'apollo-server-express';
import { ErrorCode } from 'src/modules/error.code';
import { User, UserInfo, UserDocument} from 'src/models/user.model';
import { CommonUtility } from "src/modules/utils/common.utility";
import { MongoExceptionFilter } from 'src/modules/mongo-exception.filter';
import { TodoService } from "../todo/todo.service";
import { PermissionService } from "../permission/permission.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserService implements OnModuleInit{
    constructor(
        private readonly configService: ConfigService,
        private readonly permissionService:PermissionService,
        @Inject(forwardRef(()=>AuthService))
        private readonly authService:AuthService,
        @Inject(forwardRef(() => TodoService))
        private readonly todoService:TodoService,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ){}

    private readonly logger = new Logger(UserService.name);

    async onModuleInit() {
        const root = await this.initialize();
        this.logger.log(`The root user would be ${root.email}`);
    }

    async initialize(): Promise<User>{
        // init permission role
        await this.permissionService.Roleinit(); //等待初始化

        // create the root user
        const rootUser = await this.findUser(
            this.configService.get<string>('ROOT_USER_EMAIL'),
        ); //檢查資料庫有無rootUser
    
        if (rootUser) {  //如果已經有RootUser物件
            return rootUser;
        } else { //如果沒有則建立新的
            //查詢Role
            const role = await this.permissionService.queryRoleTemplate(Roles.ADMIN);
            if(!role){
                throw new ApolloError(
                    `There is a role template '${Roles.ADMIN}' not in the DB`,
                    ErrorCode.ROLE_TEMPLATE_NOT_FOUND,
                );
            }
            const user = new User();  //建立User物件
            user.username = this.configService.get<string>('ROOT_USER_NAME');
            user.role = role;
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

    async findUserById(authorid:String): Promise<User> {
        // this.logger.log(authorid);
        try{
            const Result = await this.userModel.findById(authorid);
            return Result;
        }catch{
            throw new ApolloError(
                `Can not find user.`,
                ErrorCode.USER_NOT_FOUND,
            );
        }
    }

    async updateUser(id: string, userUpdate:ApolloUserInfo): Promise<ApolloUser>{
        let nowUser = await this.findUserById(id);  //取出User物件
        if (!nowUser){
            throw new ApolloError(
                `Can not find user on MongoDB.`,
                ErrorCode.USER_NOT_FOUND,
            );
        }
        this.logger.log(nowUser.email,userUpdate);
        const Result = await this.userModel.findByIdAndUpdate(
            nowUser._id,
            {
                email: userUpdate.email ? userUpdate.email : nowUser.email,
                detail: {
                    firstName: userUpdate.firstname ? userUpdate.firstname: nowUser.detail.firstName,
                    lastName: userUpdate.lastname ? userUpdate.lastname: nowUser.detail.lastName,
                    Age: userUpdate.age ? userUpdate.age: nowUser.detail.Age,
                }
            },
            {
                new: true,
                useFindAndModify: false,
            },
        ); 
        
        //回傳更新後的結果
        if (Result){
            return Result.toApolloUser();
        }
        return null
    }

    async createUser(basicInfo:ApolloBasicInfo):Promise<ApolloResult>{
        if (!basicInfo) {
            return this.userResult(null,false);
        }
        const findone = await this.findUser(basicInfo.email)
        if (findone) {
            this.logger.log(basicInfo.email)
            throw new ApolloError(
                `Can not create exist user.`,
                ErrorCode.USER_ALREADY_EXISTED,
            );
        }

        const role = await this.permissionService.queryRoleTemplate(Roles.MEMBER);
        if(!role){
            throw new ApolloError(
                `There is a role template '${Roles.MEMBER}' not in the DB`,
                ErrorCode.ROLE_TEMPLATE_NOT_FOUND,
            );
        }
        const user = new User();  //建立User物件
        user.username = basicInfo.username
        user.role = role;
        user.email = basicInfo.email;

        const userinfo = new UserInfo();
        userinfo.firstName=basicInfo.firstname?basicInfo.firstname:"";
        userinfo.lastName=basicInfo.lastname?basicInfo.lastname:"";
        userinfo.Age=basicInfo.age?basicInfo.age:0;
        
        user.detail= userinfo;
        user.password = CommonUtility.encryptBySalt(basicInfo.password)
        const getResult = await this.userModel.create(user)
        if (getResult!==null) {
            this.logger.log(`A user has been created. id: ${getResult._id}`)
            return this.userResult(getResult._id,true);
        }
        throw new ApolloError(
            `Can not create user on MongoDB.`,
            ErrorCode.MONGODB_ERROR,
        );
        return this.userResult(null,false); //不會到這
    }

    async deleteUser(email: string):Promise<ApolloResult> {
        const user = await this.findUser(email);
        if (!user){
            throw new ApolloError(
                `Can not find user on MongoDB.`,
                ErrorCode.USER_NOT_FOUND,
            );
        }
        //找到user後先刪除所有user關聯之文章
        const result = await this.todoService.deletePosts(user);
        if (!result){
            throw new ApolloError(
                `Can not delete user's Todo on MongoDB.`,
                ErrorCode.TODO_DELETE_FAILED,
            );
        }

        //找到user後先刪除所有token
        const result2 = await this.authService.deleteTokenByUser(user);
        if (!result2){
            throw new ApolloError(
                `Can not delete user's Token on MongoDB.`,
                ErrorCode.TOKEN_DELETE_FAILED,
            );
        }

        //刪除user本身
        const document = await this.userModel.findByIdAndRemove(user._id).exec();
        if (!document) {
            throw new ApolloError(
                `Can not delete user on MongoDB.`,
                ErrorCode.USER_DELETE_FAILED,
            );
        }
        return this.userResult(user.id,true);
    }

    async hasUser():Promise<Boolean> {
        const count = await this.userModel.estimatedDocumentCount().exec();
        return count > 0;
    }

    userResult(id:string,status:boolean):ApolloResult{
        const result = new ApolloResult();
        result.id=id;
        result.status=status;
        return result;
    }
    
}



