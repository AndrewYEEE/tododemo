/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Constants } from 'src/constants';
import { AppAbility, AbilityFactory } from './ability.factory';
import { PermissionHandler } from './permission.handler';
import { HttpAuthGuard } from '../auth/http-auth.guard';
import { User } from 'src/models/user.model';

@Injectable()
export class PermissionGuard implements CanActivate {  //自訂義Guard(不依賴Passport) //配合permission.handler.ts 的 @CheckPermissions Decorator
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,   //導入ability.factory.ts以方便使用createForUser()
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionHandlers =
      this.reflector.get<PermissionHandler[]>(
        Constants.KEY_CHECK_PERMISSIONS,
        context.getHandler(),
      ) || [];                   //使用Reflector將@CheckPermissions Decorator中MetaData取出 (為PermissionHandler[] Array)

    const { user } = HttpAuthGuard.executionContextToRequest(context); //取得Request並擷取User物件出來 //參考http-auth.guard.ts
    const ability = await this.abilityFactory.createForUser(           //呼叫createForUser，依據User物件中inUse=true的Group取出對應的rules //參考ability.factory.ts
      user.userModel as User,
    );

    return permissionHandlers.every((handler) =>                   //使用every將Array中每個元素(PermissionHandler)取出並做指定動作
      this.execPermissionHandler(handler, ability),                //注意! 這裡的handler即為從Resolver丟進來的callback function //將callback與對應的rules整合判斷是否合法
    ); //(ex: this.execPermissionHandler((ability: AppAbility) => ability.can(Action.ADD, Subject.USER), ability)
  }

  private execPermissionHandler(  //將Resolver丟進來的Callback Function取出，並將createForUser給的ability帶入做權限判斷
    handler: PermissionHandler,
    ability: AppAbility,
  ) {
    if (typeof handler === 'function') {  //由於PermissionHandler同時包含 interface/type 兩種類型，所以要依哪種來判斷做法 (參考permission.handler.ts)
      return handler(ability);  //此種是type類型 (參考permission.handler.ts) (ex: (ability)=>ability.can(Action.ADD, Subject.USER))
    }
    return handler.handle(ability); //此種是interface類型 (參考permission.handler.ts) (ex: PermissionHandler.handle(ability)=>ability.can(Action.ADD, Subject.USER))
  }
}
