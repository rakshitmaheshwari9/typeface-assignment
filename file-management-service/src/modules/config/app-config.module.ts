import { ConfigModule } from "@nestjs/config";
import { Global, Module } from "@nestjs/common";
import { AppConfigService } from "./app-config.service";

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class AppConfigModule {}
