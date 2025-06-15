import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { S3Service } from './s3.service';
import { AppConfigModule } from '../config';

@Module({
  imports: [TypeOrmModule.forFeature([File]), AppConfigModule],
  controllers: [FilesController],
  providers: [FilesService, S3Service],
  exports: [FilesService],
})
export class FilesModule {}
