import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LogsService } from '../logs/logs.service';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logsService: LogsService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    
    // Log de l'inscription
    await this.logsService.log(
      'info',
      'auth',
      `Nouvelle inscription utilisateur`,
      { 
        email: registerDto.email,
        userId: result.user.id,
        role: result.user.role 
      },
      result.user.id
    );
    
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    
    // Log de la connexion
    await this.logsService.log(
      'info',
      'auth',
      `Connexion utilisateur réussie`,
      { 
        email: loginDto.email,
        userId: result.user.id,
        role: result.user.role 
      },
      result.user.id
    );
    
    return result;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async getProfile(@Request() req) {
    const profile = await this.authService.getProfile(req.user.id);
    
    // Log de la consultation du profil
    await this.logsService.log(
      'info',
      'user_action',
      `Consultation du profil utilisateur via auth`,
      { userId: req.user.id },
      req.user.id
    );
    
    return profile;
  }
} 