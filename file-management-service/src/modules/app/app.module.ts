import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionModule } from 'src/common/connection.module';
import { UserModule } from '../user/user.module';
import { FilesModule } from '../files/files.module';
import { AuthModule } from '../auth';

@Module({
  imports: [
    ConnectionModule.forRoot(),
    UserModule,
    FilesModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
