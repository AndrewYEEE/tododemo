import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { Logger,Injectable,forwardRef,OnModuleInit,Inject} from "@nestjs/common";

@Scalar('Date',(type) => Date)
export class DateScalar implements CustomScalar<number, Date> { 
  description = 'Date custom scalar type';
  private readonly logger = new Logger(DateScalar.name);
  parseValue(value: number): Date {     //client傳遞的"value"會進來 ex: query {isFriday(date: 1540791381379)}
    return new Date(value); // value from the client
  }

  serialize(value: Date): number {      //擷取Resolver給的值(graphql處理完的)，再回傳給client (只要是 JSON 格式允許的值都行，如 Int, String, Object, Array 等等)
    this.logger.log("DateScalar called")
    return value.getTime(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): Date {  //client傳遞的"Object"會進來 ex: query ($date: Date!) {isFriday(date: $date)} ; VARIABLES{  "date": 1540791381379  }
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  }
}
