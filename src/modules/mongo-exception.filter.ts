import { ArgumentsHost, Catch, ExceptionFilter,Logger } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { ApolloError } from 'apollo-server-express';
import { ErrorCode } from 'src/modules/error.code';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(MongoExceptionFilter.name);
  catch(exception: MongoError, host: ArgumentsHost) {
    // switch (exception.code) {
    //   case 11000:
    //     // duplicate exception
    //     // do whatever you want here, for instance send error to client
    // }
    this.logger.warn(exception);
    switch (exception.code) {
      default: {
        throw new ApolloError(
          exception.errmsg,
          ErrorCode.MONGODB_ERROR,
        );
      }
    }
  }
}