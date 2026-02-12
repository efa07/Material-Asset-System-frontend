import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async syncUser(payload: any) {
    const { sub: keycloakId, email, given_name: firstName, family_name: lastName, preferred_username: username } = payload;
    
    // 1. Try to find by Keycloak ID (primary)
    let user = await this.prisma.user.findUnique({
      where: { keycloakId },
      include: { role: true },
    });

    if (user) {
      return user;
    }

    // 2. Try to find by email if Keycloak ID not found (legacy/migration case)
    if (email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });

      if (existingUser) {
        // Link existing user to Keycloak ID
        return this.prisma.user.update({
          where: { id: existingUser.id },
          data: { keycloakId },
          include: { role: true },
        });
      }
    }

    // 3. Create new user if not found
    return this.prisma.user.create({
      data: {
        keycloakId,
        email: email || `${keycloakId}@placeholder.com`, // Ensure unique email if missing
        firstName: firstName || username || 'Unknown',
        lastName: lastName || '',
        isActive: true,
      },
      include: { role: true },
    });
  }


  findAll() {
    return this.prisma.user.findMany({
      include: {
        role: true,
        currentAssets: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        currentAssets: {
          include: {
            maintenanceLogs: true
          }
        },
        assignments: {
          include: {
            asset: true,
          },
        },
      },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        currentAssets: {
          include: {
            maintenanceLogs: true
          }
        },
        assignments: {
          include: {
            asset: true,
          },
        },
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
