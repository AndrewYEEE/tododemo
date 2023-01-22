import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException,Logger } from '@nestjs/common';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {  //檢查beartoken，將使用者指定的group的inUse設成true，其他設為false，回傳整個user物件 //複寫PassportStrategy並使用passport-http-bearer策略
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true,
    });
  }
  private readonly logger = new Logger(HttpStrategy.name);
  async validate(req: Request, accessToken: string): Promise<any> {   //Req應該是指使用者傳入的req內容 (比如query、mutation、Subscription) (accessToken=bear token)
    // we could do a database lookup in our validate()
    // method to extract more information about the user
    const token = await this.authService.getAccessToken(accessToken); //檢查MongoDB有沒有此Token (從oauth_access_tokens資料表)
    const current = new Date();
    if (token){
      this.logger.log(token.accessToken)
      this.logger.log(token.accessTokenExpiresAt)
      this.logger.log(token.user._id)
      this.logger.log(token.user.id)
      this.logger.log(token.user.email)
      this.logger.log(token.user.username)
    }
    if (  //如果沒有Token，或是Token過期了
      token === null ||
      current.getTime() > token.accessTokenExpiresAt.getTime()     
    ) {
      this.logger.log(token.accessToken)
      this.logger.log(token.accessTokenExpiresAt)
      throw new UnauthorizedException();  //拋出意外錯誤 (PassportStrategy預設都這個錯誤，會回傳401 Unauthoized)
    }
    return { userModel: token.user }; //原來HttpAuthGuard和@CurrentUser的user是從這邊來的
  }
}

/*
{
  "authorization": "Bearer 1qaz2wsx3edc",
}
db.oauth_access_tokens.insertOne({user: ObjectId("6371a788396d31f6db2a7e3e"),accessToken:"1qaz2wsx3edc", accessTokenExpiresAt:ISODate("2032-11-23T12:06:17.170Z") })
*/