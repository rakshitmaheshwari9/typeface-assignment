import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppConfigService } from 'src/modules/config';
import { getConfig } from 'src/modules/config/config.local';

let defaultTypeOrmModule: DynamicModule;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        load: [getConfig]
    }),
    AppConfigModule
  ],
})
export class ConnectionModule {
    static forRoot(): DynamicModule {
      if (!defaultTypeOrmModule) {
        defaultTypeOrmModule = TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (appConfigService: AppConfigService) => {
            await appConfigService.loadConfigurations();
            const dbConfig = appConfigService.database;
            return {
              ...(dbConfig as any),
              autoLoadEntities: true,
              synchronize: true
            };
          },
          inject: [AppConfigService],
        });
      }
      return {
        module: ConnectionModule,
        imports: [defaultTypeOrmModule],
      };
    }
  
    static forPlugin(): DynamicModule {
      return {
        module: ConnectionModule,
        imports: [TypeOrmModule.forFeature()],
      };
    }

  }