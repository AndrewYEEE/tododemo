import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();   //宣告definitions工廠物件 (等同於直接在app.modules.ts中GraphQLModule中的definitions)
void definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],                      //graphql的結構檔位置
  path: join(process.cwd(), 'src/graphql.schema.ts'),     //指定Typescript產生位置
  outputAs: 'class',                                      //一般情況下GraphQL只會產生interface，此參數用於另外要求產生class
});
