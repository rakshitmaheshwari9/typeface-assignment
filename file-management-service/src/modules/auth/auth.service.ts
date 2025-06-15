import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { Request } from 'express';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) {}

    async signin(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user);
        await this.updateUserTokens(user.id, tokens);

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            },
            ...tokens
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_SECRET') || 'typeface'
            });

            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTimestamp) {
                throw new UnauthorizedException('Refresh token has expired');
            }

            const user = await this.userService.findById(payload.sub);
            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const tokens = await this.generateTokens(user);
            await this.updateUserTokens(user.id, tokens);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username
                },
                ...tokens
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async generateTokens(user: any) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: user.id,
                    email: user.email,
                    username: user.username
                },
                {
                    secret: this.configService.get('JWT_SECRET') || 'typeface',
                    expiresIn: '15m'
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: user.id,
                    email: user.email,
                    username: user.username
                },
                {
                    secret: this.configService.get('JWT_REFRESH_SECRET') || 'typeface',
                    expiresIn: '7d'
                }
            )
        ]);

        return {
            accessToken,
            refreshToken
        };
    }

    private async updateUserTokens(userId: string, tokens: { accessToken: string; refreshToken: string }) {
        await this.userService.updateTokens(userId, tokens);
    }

    async extractCredentials(request: Request): Promise<string> {
        const authHeader = request.headers?.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Authorization Header is missing');
        }
    
        if (!authHeader.startsWith('Bearer')) {
            throw new UnauthorizedException('Authorization Header is not type of Bearer');
        }
    
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            throw new UnauthorizedException('Authorization Header has too many parts it must follow this pattern Bearer xxxc.yyy.zzz');
        }
        const token = parts[1];
    
        return token;
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET') || 'typeface'
            });

            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTimestamp) {
                return false;
            }

            const user = await this.userService.findById(payload.sub);
            return !!user && user.token === token;
        } catch {
            return false;
        }
    }
}
