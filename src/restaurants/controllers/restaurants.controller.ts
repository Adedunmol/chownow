import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, ClassSerializerInterceptor, UseGuards, HttpCode, Request, ParseIntPipe } from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantAdminDto, UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { ApiBody, ApiForbiddenResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiCreatedResponse, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger';
import { RestaurantAuthGuard } from '../../auth/guards/local-auth.guard';
import { AuthService } from '../../auth/auth.service';
import { LoginRestaurantDto } from '../dto/login-restaurant.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../utils/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateMenuItemDto } from '../dto/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dto/update-menu-item.dto';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService, private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiCreatedResponse({ description: 'Restaurant successfully created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  registerRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @UseGuards(RestaurantAuthGuard)
  @ApiBody({ type: LoginRestaurantDto })
  @Post('login')
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  loginRestaurant(@Request() req) {
    return this.authService.loginRestaurant(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll() {
    return this.restaurantsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.findById(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  updateAdmin(@Param('id', ParseIntPipe) id: number, @Body() updateRestaurantAdminDto: UpdateRestaurantAdminDto) {
    return this.restaurantsService.updateAdmin(id, updateRestaurantAdminDto);
  }

  @Roles(Role.RESTAURANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  update(@Request() req, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantsService.update(req.user.id, updateRestaurantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  remove(@Request() req) {
    return this.restaurantsService.remove(req.user.id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  removeAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('menu-items/all')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getMenuItems(@Request() req) {
    return this.restaurantsService.getMenuItems(req.user.id);
  }

  
  @UseGuards(JwtAuthGuard)
  @Get('menu-items/:id/')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getMenuItem(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.getMenuItem(id);
  }

  @Roles(Role.RESTAURANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @Post('menu-items')
  addMenuItem(@Request() req, @Body() createMenuItemDto: CreateMenuItemDto) {
    return this.restaurantsService.createMenuItem(req.user.id, createMenuItemDto)
  }

  @Roles(Role.RESTAURANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @Patch('menu-items/:id')
  updateMenuItem(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.restaurantsService.updateMenuItem(id, req.user.id, updateMenuItemDto)
  }

  @Roles(Role.RESTAURANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('menu-items/:id')
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  removeMenuItem(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.restaurantsService.removeMenuItem(req.user.id, id);
  }
}
