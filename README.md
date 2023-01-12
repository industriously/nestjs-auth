# nestjs-auth

[![npm version](https://badge.fury.io/js/@devts%2Fnestjs-auth.svg)](https://badge.fury.io/js/@devts%2Fnestjs-auth)

- A way to apply Oauth2 Auth module to nestjs

```sh
  more type-safe than passport
  install only once
```

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#example">example</a></li>
  </ol>
</details>

<!-- INSTALLATION -->

## Installation

```sh
npm i @devts/nestjs-auth
```

<!-- EXAMPLE -->

## Example

```typescript
import { ConfigService } from '@nestjs/config';
import { AbstractGoogleStrategy } from '@devts/nestjs-auth';
import type { Request } from 'express';

interface GoogleIdTokenData {
  name: string;
  email: string;
}

interface GoogleProfile {
  username: string;
  email: string;
}

@Injectable()
export class GoogleStrategy extends AbstractGoogleStrategy<
  'user', // this is key that assign token data in Request object. If you write a key that already used, key type in options is never
  GoogleIdTokenData
> {
  constructor(configService: ConfigService) {
    super({
      client_id: configService.get('CLIENT_ID'),
      client_secret: configService.get('CLIENT_SECRET'),
      redirect_uri: configService.get('OAUTH_CALLBACK'),
      scope: ['email', 'profile'],
      key: 'user',
    });
  }
  validate(request: Request): boolean {
    const data = this.getData(request); // type is GoogleIdTokenData | undefined
    if (data == undefined) {
      return false;
    }
    // other validate logic
    this.setData<GoogleProfile>(request, { username: name, email }); // use if you want to transform data
    return true;
  }
}

// in module
@Module({
  providers: [
    {
      provide: 'GoogleStrategy',
      useClass: GoogleStrategy,
    },
  ],
})
export class AppModule {}
```

```typescript
import { AuthGuard } from '@devts/nestjs-auth';
import { Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  // Inject decorator get "GoogleStrategy" token
  @Get('sign-in')
  @UseGuards(AuthGuard('GoogleStrategy'))
  signIn() {
    return;
  }

  @Get('YOUR REDIRECT PATH')
  @UseGuards(AuthGuard('GoogleStrategy'))
  callback(@Req() req: Request) {
    return (req as any).user; // you can get data from request[key]
  }
}
```
