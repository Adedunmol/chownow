import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, UseInterceptors, ClassSerializerInterceptor, UseGuards, HttpCode, Request } from '@nestjs/common';
import { DriversService } from '../services/drivers.service';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { UpdateDriverDto } from '../dto/update-driver.dto';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { DriverAuthGuard } from '../../auth/guards/local-auth.guard';
import { LoginDriverDto } from '../dto/login-driver.dto';
import { AuthService } from '../../auth/auth.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../utils/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('drivers')
@ApiTags('Drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService, private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiCreatedResponse({ description: 'Customer successfully created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  registerDriver(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @UseGuards(DriverAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDriverDto })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  loginDriver(@Request() req) {
    return this.authService.loginDriver(req.user)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  getDrivers() {
    return this.driversService.findDrivers();
  }

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(+id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driversService.remove(+id);
  }
}
