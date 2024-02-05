import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomersDto } from './dto/create-customers.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SearchDto } from '../../shared/dto/search.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Admin Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(
    @Body() createCustomerDto: CreateCustomersDto,
    @Request() req: any,
  ): Promise<object> {
    return this.customerService.create(createCustomerDto, req.user);
  }

  @Get()
  findAll(@Query() searchDto: SearchDto): Promise<object> {
    return this.customerService.findAll(searchDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<object> {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<object> {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<object> {
    return this.customerService.remove(+id);
  }
}
