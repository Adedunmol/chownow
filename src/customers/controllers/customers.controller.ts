import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Request, ValidationPipe, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { ApiTags, ApiConflictResponse, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { LoginCustomerDto } from '../dto/login-customer.dto';
import { LocalAuthGuard } from '../../auth/local-auth.guard';
import { AuthService } from '../../auth/auth.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('customers')
@ApiTags('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService, private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiCreatedResponse({ description: 'Customer successfully created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  registerCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(ValidationPipe)
  loginCustomer(@Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
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
