# nestjs-auth

[![npm version](https://img.shields.io/npm/v/@devts%2Fnestjs-auth.svg)](https://www.npmjs.com/package/@devts/nestjs-auth)
[![Downloads](https://img.shields.io/npm/dm/@devts%2Fnestjs-auth.svg?logo=npm)](https://www.npmjs.com/package/@devts/nestjs-auth)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type%20coverage&color=brightgreen&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Findustriously%2Fnestjs-auth%2Fmain%2Fpackage.json)](https://github.com/industriously/nestjs-auth)

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
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Google, StrategyException } from '@devts/nestjs-auth';

interface GoogleProfile {
  username: string;
  email: string;
}

@Injectable()
export class GoogleStrategy extends Google.AbstractStrategy<
  'user',
  "emails" | "profile"
  GoogleProfile
> {
  constructor(configService: ConfigService) {
    super({
      client_id: configService.get('CLIENT_ID'),
      client_secret: configService.get('CLIENT_SECRET'),
      redirect_uri: configService.get('OAUTH_CALLBACK'),
      access_type: "offline",
      prompt: "consent",
      scope: ['email', 'profile'],
      key: 'user',
    });
  }

  protected throw({
    statusCode = 401,
    message = ''
  }:StrategyException): never {
    throw new HttpException(statusCode, message);
  }

  validate(
    identity: Google.IdToken<'email' | 'profile'>,
    credentials: Google.Credentials,
  ): boolean {
    return true;
  }

  transform(
    identity: Google.IdToken<'email' | 'profile'>,
  ): GoogleProfile {
    const { name, email } = identity;
    return { username: name, emails };
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
