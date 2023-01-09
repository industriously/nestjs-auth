# nestjs-auth

[![npm version](https://badge.fury.io/js/@rojiwon%2Fnestjs-auth.svg)](https://badge.fury.io/js/@rojiwon%2Fnestjs-auth)

- A way to apply Oauth2 Auth module to nestjs

```sh
  passport를 사용하지 않습니다.
  passport보다 type-safe합니다.
  하나의 라이브러리만 설치하면 적용가능합니다.
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
npm i @rojiwon/nestjs-auth
```

<!-- EXAMPLE -->

## Example

```typescript
import { ConfigService } from '@nestjs/config';
import { AbstractGoogleStrategy } from '@rojiwon/nestjs-auth';

@Injectable()
export class GoogleStrategy extends AbstractGoogleStrategy {
  constructor(configService: ConfigService) {
    super({
      client_id: configService.get('CLIENT_ID'),
      client_secret: configService.get('CLIENT_SECRET'),
      redirect_uri: configService.get('OAUTH_CALLBACK'),
      scope: ['email', 'profile'],
    });
  }
  validate(request: Request): boolean {
    // custom validate logic
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
import { AuthGuard } from '@rojiwon/nestjs-auth';

  // in controller
  // Inject decorator get "GoogleStrategy" token
  @Get("sign-in")
  @UseGuards(AuthGuard("GoogleStrategy"))
  signIn(){ return; }
```
