// src/files/files.controller.ts
import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    UseGuards,
    Request,
    Query,
    ParseUUIDPipe,
    HttpException,
    HttpStatus,
    Delete,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadUrlDto } from './dto/upload-url.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('presigned-url')
    async generateUploadUrl(
        @Request() req,
        @Body() uploadUrlDto: UploadUrlDto,
    ) {
        return await this.filesService.generateUploadUrl(
                req.user.id,
                uploadUrlDto,
            );
       
    }

    @Get(':fileId/url')
    async getFileUrl(
        @Request() req,
        @Param('fileId', ParseUUIDPipe) fileId: string,
    ) {
            return await this.filesService.getFileUrl(fileId, req.user.id);
      
    }

    @Delete(':fileId')
    async deleteFile(
        @Request() req,
        @Param('fileId', ParseUUIDPipe) fileId: string,
    ) {
            return await this.filesService.deleteFile(fileId, req.user.id);
      
    }

    @Get()
    async getUserFiles(
        @Request() req,
        @Query() paginationDto: PaginationDto,
    ) {
        return await this.filesService.getUserFiles(req.user.id, paginationDto);
    }
}
  