import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Query,
  Res,
  StreamableFile,
  UploadedFiles,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
} from '../../shared/services/storage/file-upload.utils';
import { SearchDto } from '../../shared/dto/search.dto';
import { createReadStream } from 'fs';
import { join } from 'path';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Admin Transaction')
@Controller('transaction')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        customerId: {
          type: 'number',
        },
        price: {
          type: 'number',
        },
        remark: {
          type: 'string',
        },
        type: {
          type: 'array',
          items: {
            enum: ['WITHDRAW', 'DEPOSIT'],
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/transaction/',
        filename: editFileName,
      }),
    }),
  )
  create(
    @Body() body: CreateTransactionDto,
    @UploadedFiles() files,
    @Request() req: any,
  ): Promise<object> {
    return this.transactionsService.create(body, files, req.user);
  }

  @Get()
  findAll(@Query() searchDto: SearchDto): Promise<object> {
    return this.transactionsService.findAll(searchDto);
  }

  @Get(':customerId/customer')
  findOne(
    @Param('customerId') id: string,
    @Query() searchDto: SearchDto,
  ): Promise<object> {
    return this.transactionsService.findOne(+id, searchDto);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        price: {
          type: 'number',
        },
        remark: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/transaction/',
        filename: editFileName,
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @UploadedFiles() file,
    @Request() req: any,
  ): Promise<object> {
    return this.transactionsService.update(
      +id,
      updateTransactionDto,
      file,
      req,
    );
  }

  @Patch(':id/file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/transaction/',
        filename: editFileName,
      }),
    }),
  )
  updateFile(
    @Param('id') id: string,
    @UploadedFiles() file,
    @Request() req: any,
  ): Promise<object> {
    return this.transactionsService.updateFile(+id, file, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<object> {
    return this.transactionsService.remove(+id);
  }

  @Get('generate/slip/:id')
  generateSlip(@Param('id') id: string): Promise<object> {
    return this.transactionsService.generateSlip(+id);
  }

  @Get('download/slip/:path')
  async downloadFile(@Param('path') path: string) {
    const file = createReadStream(join(process.cwd(), `/uploads/slip/${path}`));
    return new StreamableFile(file);
  }

  @Get('generate/pdf/:id')
  async generatePdf(@Query() searchDto: SearchDto, @Param('id') id: number) {
    await this.transactionsService.generatePdf(searchDto, +id);
    const file = createReadStream(join(process.cwd(), `transaction.pdf`));
    return new StreamableFile(file);
  }
}
