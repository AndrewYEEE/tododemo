import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    Logger
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
  import { AuthGuard } from '@nestjs/passport';
  import { Request } from 'express';
  import { IS_PUBLIC_KEY } from './auth.decorator';
  
  @Injectable()
  export class HttpAuthGuard extends AuthGuard('bearer') {  //複寫AuthGuard('bearer') //@Public的判斷，BearToken檢查、以及GraphQL請求參數context類型轉換 //(依據auth.module.ts設定，此Guard被設為Global自動套用)
    constructor(private reflector: Reflector) {   //建立一個Reflector方便在後續擷取Metadata
      super();
    }
    
    private readonly logger = new Logger(HttpAuthGuard.name);

    canActivate(context: ExecutionContext) {     //複寫AuthGuard一定要複寫的方法 (ExecutionContext有getArgs、getHandler、getClass、getType等)
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ //getAllAndOverride會以放在最前面的Metadata為優先，在此以getHandler()為優先
        context.getHandler(),  //呼叫對象面對的Method
        context.getClass(),    //呼叫對象所屬的Class
      ]);
  
      if (isPublic) {    //如果上面有從getHandler或getClass任一個有成功取得Metadata Decorator值並為true，則回傳true
        // true: the current request is allowed to proceed
        this.logger.log("is public api")
        return true;    //不論哪種Guard只會回傳true or false
      }
  
      // remove this line will lead to error -> Cannot read property 'headers' of undefined
      if (context.getHandler().name === '__resolveType') {  //????
        return true;    //不論哪種Guard只會回傳true or false
      }
  
      return super.canActivate(context);  //由於是複寫AuthGuard('bearer')，所以最後還是要呼叫AuthGuard('bearer')的canActivate做實際處理
    }
  
    handleRequest(err, user, _info): any {       //複寫AuthGuard一定要複寫的方法，目的是可以客製化意外處理
      // You can throw an exception based onx either "info" or "err" arguments
      if (err || !user) {
        throw err || new UnauthorizedException();
      }
      return user;
    }
  
    getRequest(context: ExecutionContext): any {  //依照官方，意思好像是拿Req參數時會觸發，由於GraphQL是使用GqlExecutionContext，所以要特地轉一層GraphQL的Query和mutation才拿的到資料
      return HttpAuthGuard.executionContextToRequest(context);
    }
  
    static executionContextToRequest(context: ExecutionContext): any {  //自訂方法，做到同時兼顧Http Req和Graphql Req處理
      console.log("executionContextToRequest")
      if (context.getType() === 'http') {                      //檢查centext是否是http模式
        return context.switchToHttp().getRequest<Request>();   //如果是一般的http請求，則值接回傳該請求的Request內容 (Query Variable部份)
      } else if (context.getType<GqlContextType>() === 'graphql') {  //檢查centext是否是graphql模式
        const ctx = GqlExecutionContext.create(context);       //將NestJS預設的ExecutionContext轉成GqlExecutionContext以支援graphql專用的功能函式
        const { req, connection } = ctx.getContext();          //這裡呼叫的其實已經是被grapql複寫過的Context，validation回傳的東西會在req裡面
        if (false){
          console.log(ctx.getContext())
          console.log(connection)  //用Subscription情況下會變undefined //但好像mutation和query也是undefined
          console.log(req) //用Subscription情況下會變undefined，所以app.module.ts內才改寫header //query與mutation都有東西
        }
        return connection && connection.context && connection.context.headers
          ? connection.context
          : req;
      }
    }
  }
  