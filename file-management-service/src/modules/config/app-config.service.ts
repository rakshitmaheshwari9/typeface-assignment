/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "./app-config.interface";

@Injectable()
export class AppConfigService implements OnModuleInit {
    public database: AppConfig["database"];
    public jwtConfig: AppConfig["jwtConfig"];
    public s3: AppConfig["s3"];

    private readonly configKeys: string[] = [
        "database",
        "jwtConfig",
        "s3"
    ];

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        await this.loadConfigurations();
    }

    public async loadConfigurations(): Promise<void> {
        const configPromises: Promise<any>[] = this.configKeys.map(key => this.configService.getOrThrow(key));
        const configs = await Promise.all(configPromises);

        this.configKeys.forEach((key, index) => {
            const localConfig = configs[index];
            this[key] = localConfig;
        });
    }
}
