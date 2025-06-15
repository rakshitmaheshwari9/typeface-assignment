import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UploadUrlDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsNumber()
  @IsNotEmpty()
  filesize: number;
} 