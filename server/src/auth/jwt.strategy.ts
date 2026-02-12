import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private usersService: UsersService,
  ) {
    //pass the setting to parent class
    super({
      //dynamically fetches the public keys from the Keycloak server
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.get('KEYCLOAK_ISSUER')}/protocol/openid-connect/certs`,
      }),
      // extract the token from the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: config.get('KEYCLOAK_ISSUER'), 
      algorithms: ['RS256'],
    });
  }


  
  async validate(payload: any) {
    // Sync user with local DB
    const user = await this.usersService.syncUser(payload);
    
    // Return local user entity + keycloak roles
    return { 
        ...user,
        // Preserve Keycloak roles for RBAC
        roles: payload.realm_access?.roles || [] 
    };
  }
}
