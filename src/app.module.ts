import { Module } from '@nestjs/common';
import path, { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from 'src/modules/todo/todo.module';
import { CopyTodoModule } from 'src/modules/copy-todo/copy-todo.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CatsModule } from 'src/modules/cats/cats.module';
import { UserModule } from 'src/modules/user/user.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'; //用來代替graphql playground的工具

@Module({
  imports: [
    CatsModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env',
    }),
    TodoModule, 
    CopyTodoModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      playground: true,
      typePaths: ['./**/*.graphql'],
      //plugins: [ApolloServerPluginLandingPageLocalDefault()],
      definitions: {
        path: join(process.cwd(), './src/graphql.schema.ts'),
        outputAs: 'class',
      },
      subscriptions: {                                        //用於客製化GraphQL在Subscription時的連線內容，比如做字串處裡與認證
        'subscriptions-transport-ws': {                       //指定使用哪種WebSocket引擎 (官方表示請改用graphql-ws)
          onConnect: (connectionParams: any) => {             //連線時內容會以connectionParams傳遞近來
            console.log("connectionParams:");
            console.log(connectionParams);
            return connectionParams
          },
        },
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
