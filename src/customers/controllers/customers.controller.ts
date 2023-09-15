import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { ApiTags, ApiConflictResponse, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { LoginCustomerDto } from '../dto/login-customer.dto';

@Controller('customers')
@ApiTags('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiCreatedResponse({ description: 'Customer successfully created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  registerCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  loginCustomer(@Body() loginCustomerDto: LoginCustomerDto) {
    return this.customersService.login(loginCustomerDto)
  }

  @Get()
  getCustomers() {
    return this.customersService.getCustomers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
