import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.setGlobalPrefix('api')  //所有controller URL皆加上api/前綴
  await app.listen(3000);
  Logger.log(`🚀 Server running on http://127.0.0.1:3000`, 'Bootstrap');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
