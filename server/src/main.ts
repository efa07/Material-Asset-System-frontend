import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // for security 
  app.use(helmet());

  // cores 
  app.enableCors();

  // globale validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Material & Asset Management System API')
    .setDescription('Enterprise-grade asset management backend')
    .setVersion('1.0')
    .addTag('users', 'User management')
    .addTag('roles', 'Role management')
    .addTag('stores', 'Store management')
    .addTag('shelves', 'Shelf management')
    .addTag('assets', 'Asset management')
    .addTag('asset-categories', 'Asset category management')
    .addTag('asset-assignments', 'Asset assignment operations')
    .addTag('asset-transfers', 'Asset transfer operations')
    .addTag('asset-returns', 'Asset return operations')
    .addTag('asset-disposals', 'Asset disposal operations')
    .addTag('maintenance', 'Maintenance records')
    .addTag('performance', 'Performance records')
    .addTag('workflows', 'Workflow management')
    .addTag('notifications', 'Notifications')
    .addTag('audit', 'Audit logs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/docs`);
}
bootstrap();
