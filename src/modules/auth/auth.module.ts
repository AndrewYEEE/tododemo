import { Module,forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import {
  OAuthAccessToken,
  OAuthAccessTokenSchema,
} from 'src/models/oauth.access.token';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { HttpStrategy } from './http.strategy';
import { HttpAuthGuard } from './http-auth.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([      //MOngoose引入Schema
      {
        name: OAuthAccessToken.name,  //引入OAuthAccessToken Schema
        schema: OAuthAccessTokenSchema,
        collection: 'oauth_access_tokens', //指定使用oauth_access_tokens資料表
      },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService, 
    AuthResolver,
    // using HttpAuthGuard globally (是全域化，注意!!!!!!)
    {
      provide: APP_GUARD,
      useClass: HttpAuthGuard,
    },
    HttpStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
