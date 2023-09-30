import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Request, ValidationPipe, UseInterceptors, ClassSerializerInterceptor, UseGuards, HttpCode, ParseIntPipe } from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { UpdateCustomerAdminDto, UpdateCustomerDto } from '../dto/update-customer.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { ApiTags, ApiConflictResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiBody, ApiForbiddenResponse } from '@nestjs/swagger';
import { LoginCustomerDto } from '../dto/login-customer.dto';
import { CustomerAuthGuard } from '../../auth/guards/local-auth.guard';
import { AuthService } from '../../auth/auth.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../utils/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('customers')
@ApiTags('Customers')
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

  @UseGuards(CustomerAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginCustomerDto })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  loginCustomer(@Request() req) {
    return this.authService.loginCustomer(req.user)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  getCustomers() {
    return this.customersService.findCustomers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findById(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  updateAdmin(@Param('id', ParseIntPipe) id: number, @Body() updateCustomerAdminDto: UpdateCustomerAdminDto) {
    console.log('running')
    return this.customersService.updateAdmin(id, updateCustomerAdminDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(@Request() req, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(req.user.id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
