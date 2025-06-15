import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { S3Service } from './s3.service';
import { v4 as uuidv4 } from 'uuid';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private s3Service: S3Service,
  ) {}

  async generateUploadUrl(userId: string, inputFile: {filename: string, contentType: string, filesize: number}) {
    const {filename, contentType, filesize} = inputFile;
    const key = `${userId}/${uuidv4()}-${filename}`;
    const presignedUrl = await this.s3Service.generatePresignedUrl(key, contentType);
    
    const file = this.filesRepository.create({
      filename,
      originalname: filename,
      mimetype: contentType,
      key,
      bucket: this.s3Service.getBucket(),
      userId,
      size: filesize
    });

    await this.filesRepository.save(file);

    return {
      uploadUrl: presignedUrl,
      fileId: file.id,
      key,
    };
  }

  async getFileUrl(fileId: string, userId: string) {
    const file = await this.filesRepository.findOne({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new Error('File not found');
    }

    const presignedUrl = await this.s3Service.generateGetPresignedUrl(file.key);
    return { url: presignedUrl };
  }

  async deleteFile(fileId: string, userId){
    const file = await this.filesRepository.findOne({where: {id: fileId, userId: userId}});

    if(!file){
      throw new NotFoundException("File not found for a given user");
    }

    const s3deleteOutput = await this.s3Service.deleteFile(file?.key);

    if(s3deleteOutput?.$metadata?.httpStatusCode === 204){
      await this.filesRepository.remove(file);
      return {msg: "Deleted Successfully"};
    }else{
      throw new InternalServerErrorException("Error while deleting the file. Please try later!!");
    }
  }

  async getUserFiles(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [files, total] = await this.filesRepository.findAndCount({
      where: { userId },
      order: { createdDate: 'DESC' },
      skip,
      take: limit,
    });

    return {
      files,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
