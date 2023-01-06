# nestjs-auth

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
import { GoogleStrategy, decode_jwt } from '@rojiwon/nestjs-auth';

const Strategy = new GoogleStrategy({
  // options
});
export const GoogleAuthGuard = createAuthGuard(
  Strategy,
  new UnauthorizedException('구글 인증 실패'),
);
```

```typescript
// in controller
  @Get('login')
  @UseGuards(GoogleAuthGuard)
  login(){ return; }
```
