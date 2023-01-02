import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class AuthModule {
  static register(options: unknown): DynamicModule {
    return {
      module: AuthModule,
      //  providers: [{ provide: {}, useValue: options }],
    };
  }
}
