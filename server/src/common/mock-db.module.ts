import { Global, Module } from '@nestjs/common';
import { MockDbService } from './mock-db.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [MockDbService],
    exports: [MockDbService],
})
export class MockDbModule { }
