import { Injectable, OnModuleInit } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, DeleteObjectCommandOutput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppConfigService } from '../config';

@Injectable()
export class S3Service implements OnModuleInit {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: AppConfigService) {
    this.s3Client = new S3Client({
      region: 'ap-south-1',
      // credentials: {
      //   accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      //   secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      // },
    });
  }

  onModuleInit(){
    this.bucket = this.configService.s3?.name;
  }

  async generatePresignedUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async generateGetPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async deleteFile(key: string): Promise<DeleteObjectCommandOutput> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const response = await this.s3Client.send(command);
      console.log(`Successfully deleted file with key: ${key} from bucket: ${this.bucket}`);
      return response;
    } catch (error) {
      console.error(`Error deleting file with key: ${key} from bucket: ${this.bucket}`, error);
      throw error;
    }
  }

  getBucket(): string {
    return this.bucket;
  }
} 