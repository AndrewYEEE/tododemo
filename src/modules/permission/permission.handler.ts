import { SetMetadata } from '@nestjs/common';
import { Constants } from 'src/constants';
import { AppAbility } from './ability.factory';  //AppAbility= Ability<[Action, Subject]>; Action定義所有動作，Subject定義所有對象

interface IPermissionHandler {    //定義第一種函式 (只是定型，實際還是要先建立物件，不能直接用)
  handle(ability: AppAbility): boolean;  //使用 interface 表示函式  //handle好像只是名稱而已，用來具體表示有個叫handle function
}

type PermissionHandlerCallback = (ability: AppAbility) => boolean;  //定義第二種函式 (只是定型，實際還是要先建立物件，不能直接用) (應該是方便接收callback function) //使用 type 表示函式 

export type PermissionHandler = IPermissionHandler | PermissionHandlerCallback; //使用 type 表示PermissionHandler函式，此函式同時包含 interface/type 兩種類型

export const CheckPermissions = (...handlers: PermissionHandler[]) =>  //定義Metadata Decorator //輸入同時可能包含Interface與type (function)
  SetMetadata(Constants.KEY_CHECK_PERMISSIONS, handlers); //將輸入參數加入metadata，並用"check_permissions"Key值當代表
