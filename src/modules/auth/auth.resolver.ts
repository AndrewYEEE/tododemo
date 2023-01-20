import { AuthService } from './auth.service';
import { Resolver, Query, Args ,Mutation} from "@nestjs/graphql";
import { Public } from './auth.decorator';
import { 
    SignupInput,
    SignupPayload,
    SigninInput,
    SigninPayload
} from 'src/graphql.schema';

@Resolver('Auth')
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
    ) {}
    
    @Public()
    @Mutation()  
    async signup(@Args('signupInput') signupInput: SignupInput): Promise<SignupPayload> { 
        return this.authService.signup(signupInput);
    }

    @Public()
    @Mutation() 
    async signin(@Args('signinInput') signinInput: SigninInput): Promise<SigninPayload> { 
        return this.authService.signin(signinInput);
    }
    
}
