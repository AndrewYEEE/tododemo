import {
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
  } from '@nestjs/common';
  import { HttpAuthGuard } from './http-auth.guard';
  
  export const CurrentUser = createParamDecorator(      //自定義一個CurrentUser Decorator //向HttpAuthGuard內的Method取得GraphQLContext並提取user物件
    (data: unknown, context: ExecutionContext) => {     //不接收任何參數(data)，只接收ExecutionContext
      const { user } = HttpAuthGuard.executionContextToRequest(context);  //透過HttpAuthGuard.executionContextToRequest()取得ExecutionContext回傳內容，並從中提取user物件
      return user.userModel; //回傳user物件中"userModel"內容(就是user Document) (User Document是從HttpGuard連結的HttpStrategy來的，所以實際來源要參考http.strategy.ts!!)
    },
  );
  
  export const IS_PUBLIC_KEY = 'isPublic';  //定義常數
  export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); //HttpAuthGuard在判斷 //自定一個不接收參數的Decorator，此Decorator會將Key='isPublic'的'true'值放入Metadata中。
  