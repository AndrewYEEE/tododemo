import { Injectable,Logger,forwardRef,Inject } from '@nestjs/common';
import {
    OAuthAccessToken,
    OAuthAccessTokenDocument,
} from 'src/models/oauth.access.token';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { 
    SignupInput,
    SignupPayload,
    SigninInput,
    SigninPayload,
    User as ApolloUser,
    UserInfo as ApolloUserInfo, 
    BasicInfo as ApolloBasicInfo,
    Result as ApolloResult,
} from 'src/graphql.schema';
import { UserService } from 'src/modules/user/user.service';
import { CommonUtility } from "src/modules/utils/common.utility";
import { randomBytes } from 'crypto';
import { ApolloError } from 'apollo-server-express';
import { ErrorCode } from 'src/modules/error.code';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(OAuthAccessToken.name)
        private readonly tokenModel: Model<OAuthAccessTokenDocument>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}
    
    private readonly logger = new Logger(AuthService.name);

    async getAccessToken(accessToken: string): Promise<OAuthAccessToken> { //從oauth_access_tokens資料表檢查是否有Token
        return this.tokenModel.findOne({ accessToken });
    }

    async deleteTokenByUser(user: User):Promise<Boolean>{
        const { deletedCount } = await this.tokenModel.deleteMany(
            {
                user: user._id,
            }
        )
        if (deletedCount == null){
            return false
        }
        return true 
        
    }

    async signup(signupInput:SignupInput):Promise<SignupPayload>{
        if (!signupInput.email || !signupInput.password || !signupInput.username){
            return this.SignupResult(null,false);
        }
        const user = new ApolloBasicInfo();  //建立User物件
        user.username = signupInput.username
        user.email = signupInput.email;
        user.password = signupInput.password

        const result = await this.userService.createUser(user);
        this.logger.log(result.id);
        this.logger.log(result.status);
        return this.SignupResult(result.id,result.status);
    }

    async signin(signinInput:SigninInput):Promise<SigninPayload>{
        if (!signinInput.id || !signinInput.password || !signinInput.username){
            return this.SigninResult(null,false);
        }
        const user = await this.userService.findUserById(signinInput.id);
        if (!user){

        }
        const { hash } = CommonUtility.encryptBySalt(
          signinInput.password,
          user?.password?.salt,
        );
        if (!user || hash !== user?.password?.hash) { //密碼不對
          throw new ApolloError(
                `username or password is not correct.`,
                ErrorCode.AUTH_INVALID_PASSWORD_OR_USERNAME,
            );
        }

        //建立Token
        const token = new OAuthAccessToken();
        const newDate = this.addHours(new Date(), 1);
        token.accessToken = randomBytes(64).toString('base64');
        token.accessTokenExpiresAt = newDate;
        token.createdAt = new Date();
        token.updatedAt = new Date();
        token.user = user;
        const result = await this.tokenModel.create(token);
        if (!result){
            this.SigninResult(null,false);
        }
        return this.SigninResult(result.accessToken,true);
    }

    SignupResult(id:string,status:boolean):SignupPayload{
        const result = new SignupPayload();
        result.id=id;
        result.result=status;
        return result;
    }

    SigninResult(token:string,status:boolean):SigninPayload{
        const result = new SigninPayload();
        result.token=token;
        result.result=status;
        return result;
    }

    addHours(date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
    }
}
