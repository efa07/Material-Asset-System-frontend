import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.get('KEYCLOAK_ISSUER')}/protocol/openid-connect/certs`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // audience: config.get('KEYCLOAK_CLIENT_ID'), // Disabled to prevent 401 if Keycloak uses 'account' as aud
      issuer: config.get('KEYCLOAK_ISSUER'), 
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    console.log('Validating user:', payload.preferred_username);
    // tis payload is injected into request.user
    return { 
        userId: payload.sub, 
        username: payload.preferred_username, 
        roles: payload.realm_access?.roles || [] 
    };
  }
}