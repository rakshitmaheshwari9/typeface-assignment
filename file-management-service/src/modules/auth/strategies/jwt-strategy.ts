import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AppConfigService } from "../../config";
import { UserService } from "../../user/user.service";
import { REQUEST_CONTEXT_KEY } from "src/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        private appConfigService: AppConfigService,
        private userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'typeface',
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTimestamp) {
                throw new UnauthorizedException('Token has expired');
            }

            const user = await this.userService.findById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            if (user.token != req.headers['authorization']?.split(' ')[1]) {
                throw new UnauthorizedException('Token has been invalidated');
            }

            const userContext = {
                userId: user.id,
                username: user?.username,
            };

            (req as any)[REQUEST_CONTEXT_KEY] = {
                user: userContext,
            }

            return {
                id: user.id,
                email: user.email,
                username: user.username
            };
    }
}
