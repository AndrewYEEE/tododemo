import { PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { Action, Subject } from 'src/graphql.schema';

export type AppAbility = PureAbility<[Action, Subject]>;     //定義Type，將Action, Subject內容定型在Ability中 (只是定型，實際還是要先建立物件，不能直接用) (具體運作原理不是很懂)
//目前理解，由於是使用type定義，所以之後建立的物件內欄位只少不能多，例如Action有'Read','View'，則後續物件如果加入'Read','Write'就會出錯，因為因為AppAbility沒有Write
@Injectable()
export class AbilityFactory {
  async createForUser(user: User) {   //透過給予的user建立Ability權限管理物件
    const Role = user.role;
    const ability = new PureAbility(
        user.role.permission?.rules ? user.role.permission?.rules : [],
    );  //建立一個Ability物件，導入該Group所屬的rules ([{ action: 'VIEW', subject: 'DASHBOARD' },{ action: 'VIEW', subject: 'LIGHTMAP' },....])，否則導入空List
    return ability as AppAbility; //將ability強制轉型為AppAbility物件
  }
}
