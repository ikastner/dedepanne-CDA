import { Controller, Get, Put, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LogsService } from '../logs/logs.service';

@ApiTags('Utilisateurs')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logsService: LogsService
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
  async getProfile(@Request() req) {
    await this.logsService.log(
      'info',
      'user_action',
      `Consultation du profil utilisateur`,
      { userId: req.user.id },
      req.user.id
    );
    return this.usersService.findById(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Mettre à jour le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour avec succès' })
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Ajouter une adresse à l\'utilisateur connecté' })
  @ApiResponse({ status: 201, description: 'Adresse ajoutée avec succès' })
  async createAddress(@Body() createAddressDto: CreateAddressDto, @Request() req) {
    return this.usersService.createAddress(req.user.id, createAddressDto);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Récupérer les adresses de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Liste des adresses' })
  async getUserAddresses(@Request() req) {
    return this.usersService.getUserAddresses(req.user.id);
  }
} 