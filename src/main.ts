import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.setGlobalPrefix('api')  //所有controller URL皆加上api/前綴
  app.enableCors();                                                 //啟用跨網域請求機制，這樣當前後端在不同網域時可以存取 (只有本身Restful有效)
  await app.listen(3000);
  Logger.log(`🚀 Server running on http://127.0.0.1:3000`, 'Bootstrap');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
