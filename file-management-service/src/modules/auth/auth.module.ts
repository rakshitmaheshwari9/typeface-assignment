import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt-strategy";
import { JwtAuthGuard } from "./guards";
import { HttpModule } from "@nestjs/axios";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({}),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET') || 'typeface',
                signOptions: { expiresIn: '15m' },
            }),
            inject: [ConfigService],
        }),
        HttpModule,
        TypeOrmModule.forFeature([User]),
        forwardRef(() => UserModule)
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        UserService
    ],
    exports: [AuthService],
})
export class AuthModule {}
