import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Put,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { LoginDto } from '../modules/auth/dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../modules/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Put('users/:id/promote')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async promoteUser(@Param('id') id: string, @Request() req) {
    // Vérifier que l'utilisateur connecté est bien admin
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Seuls les administrateurs peuvent promouvoir des utilisateurs');
    }
    
    return this.authService.promoteUser(+id);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(@Request() req) {
    // Vérifier que l'utilisateur connecté est bien admin
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Seuls les administrateurs peuvent voir la liste des utilisateurs');
    }
    
    return this.authService.getAllUsers();
  }
} 