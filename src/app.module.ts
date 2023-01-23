import { Module } from '@nestjs/common';
import path, { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from 'src/modules/todo/todo.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'; //nestjs中graphQL要靠Apollo Server Driver驅動
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { Connection } from 'mongoose';
import StringUtils from 'src/modules/utils/StringUtils';
import { DateScalar } from 'src/modules/scalar/date';  //自訂義GraphQL ScalarType : Date
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'; //用來代替graphql playground的工具

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env',
    }),
    TodoModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      playground: true,
      typePaths: ['./**/*.graphql'],
      //plugins: [ApolloServerPluginLandingPageLocalDefault()],
      definitions: {
        path: join(process.cwd(), './src/graphql.schema.ts'),
        outputAs: 'class',
        defaultScalarType: 'unknown',                         //依據官方說明，在自訂義scaler在Typescript中被視為any，安全起見強制為它設定型態
        customScalarTypeMapping: {                            //依據官方說明，在自訂義scaler在Typescript中被視為any，安全起見強制為它設定型態
          DateTime: 'Date',                                   //設定DateTime型態對應DateScalar Providor裡複寫的Date型態
        },
      },
      cors: true,                                             //main.ts中的CORS設定只對Restful有效，GraphQL本身要靠此設定支援跨網域存取
      subscriptions: {                                        //用於客製化GraphQL在Subscription時的連線內容，比如做字串處裡與認證
        'subscriptions-transport-ws': {                       //指定使用哪種WebSocket引擎 (官方表示請改用graphql-ws)
          onConnect: (connectionParams: any) => {             //連線時內容會以connectionParams傳遞近來
            console.log("connectionParams:");
            console.log(connectionParams);
            const result = {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              req: { headers: StringUtils.keysToLowerCase(connectionParams) },   //不改寫的話會使用Subscription時在http-auth.guard.ts中executionContextToRequest那邊出錯
            };
            console.log(result);
            return result;
          },
        },
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],                                              //使用useFactory時，如果引入參數要用到其他Module要加
      useFactory: async (configService: ConfigService) => ({                //引入configService以讀取環境參數
        uri: configService.get<string>('MONGODB_URI'),                      //指定連線URL //,useFindAndModify: false, (指要求Mongo Driver棄用舊版useFindAndModify功能)(我看很多地方都有加) (如果在這裡加每個地方都能套用)(為何不加???)
        connectionFactory: (connection: Connection) => {                    //依據NestJS官方說法，利用connectionFactory攔截connection
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-var-requires
          connection.plugin(require('mongoose-autopopulate'));              //在建立mongoDB connection之前，套用Plugin，讓每個自建的Schema自動啟用populate關聯性功能
          return connection;
        },
      }),
      inject: [ConfigService],  
    }),
    AuthModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService,DateScalar],  //導入自訂義GraphQL ScalarType : Date 
})
export class AppModule {}
