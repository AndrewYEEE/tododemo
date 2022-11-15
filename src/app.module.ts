import { Module } from '@nestjs/common';
import path, { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './features/todo/todo.module';
import { CopyTodoModule } from './features/copy-todo/copy-todo.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CatsModule } from './modules/cats/cats.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'; //用來代替graphql playground的工具

@Module({
  imports: [
    CatsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../env/.env',
    }),
    TodoModule, 
    CopyTodoModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      typePaths: ['./**/*.graphql'],
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      definitions: {
        path: join(process.cwd(), './src/graphql.schema.ts'),
        outputAs: 'class',
      },
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => ({
    //     uri: config.get<string>('mongo.uri')
    //   })
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
