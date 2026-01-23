import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: createDto,
    });
  }

  findAll() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  update(id: string, updateDto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
