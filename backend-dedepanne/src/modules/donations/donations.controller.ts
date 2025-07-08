import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LogsService } from '../logs/logs.service';

@ApiTags('Dons')
@Controller('donations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DonationsController {
  constructor(
    private readonly donationsService: DonationsService,
    private readonly logsService: LogsService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau don' })
  @ApiResponse({ status: 201, description: 'Don créé avec succès' })
  async createDonation(@Body() donationData: any, @Request() req) {
    const result = await this.donationsService.createDonation(req.user.id, donationData);
    
    // Log de la création d'un don
    await this.logsService.log(
      'info',
      'donation',
      `Nouveau don créé`,
      { 
        donationId: result.id,
        userId: req.user.id,
        deviceType: donationData.deviceType,
        condition: donationData.condition 
      },
      req.user.id
    );
    
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les dons de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des dons' })
  async findAllDonations(@Request() req) {
    const result = await this.donationsService.findAllDonations(req.user.id);
    
    // Log de la consultation des dons
    await this.logsService.log(
      'info',
      'donation',
      `Consultation des dons de l'utilisateur`,
      { 
        userId: req.user.id,
        count: result.length 
      },
      req.user.id
    );
    
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un don par ID' })
  @ApiResponse({ status: 200, description: 'Détails du don' })
  @ApiResponse({ status: 404, description: 'Don non trouvé' })
  async findDonationById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.donationsService.findDonationById(id, req.user.id);
    
    // Log de la consultation d'un don
    await this.logsService.log(
      'info',
      'donation',
      `Consultation d'un don`,
      { 
        donationId: id,
        userId: req.user.id 
      },
      req.user.id
    );
    
    return result;
  }
} 