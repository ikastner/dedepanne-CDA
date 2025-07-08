import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepairsService } from './repairs.service';
import { CreateRepairRequestDto } from './dto/create-repair-request.dto';
import { UpdateRepairRequestDto } from './dto/update-repair-request.dto';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LogsService } from '../logs/logs.service';

@ApiTags('Réparations')
@Controller('repairs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepairsController {
  constructor(
    private readonly repairsService: RepairsService,
    private readonly logsService: LogsService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle demande de réparation' })
  @ApiResponse({ status: 201, description: 'Demande de réparation créée avec succès' })
  async createRepairRequest(@Body() createRepairRequestDto: CreateRepairRequestDto, @Request() req) {
    const result = await this.repairsService.createRepairRequest(createRepairRequestDto, req.user.id);
    
    // Log de la création de demande de réparation
    await this.logsService.log(
      'info',
      'repair',
      `Nouvelle demande de réparation créée`,
      { 
        repairRequestId: result.id,
        userId: req.user.id,
        applianceTypeId: createRepairRequestDto.appliance_type_id,
        issueDescription: createRepairRequestDto.issue_description 
      },
      req.user.id
    );
    
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les demandes de réparation' })
  @ApiResponse({ status: 200, description: 'Liste des demandes de réparation' })
  async findAllRepairRequests(@Request() req) {
    const result = await this.repairsService.findAllRepairRequests(req.user.id, req.user.role);
    
    // Log de la consultation des demandes de réparation
    await this.logsService.log(
      'info',
      'repair',
      `Consultation des demandes de réparation`,
      { 
        userId: req.user.id,
        role: req.user.role,
        count: result.length 
      },
      req.user.id
    );
    
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une demande de réparation par ID' })
  @ApiResponse({ status: 200, description: 'Détails de la demande de réparation' })
  @ApiResponse({ status: 404, description: 'Demande de réparation non trouvée' })
  async findRepairRequestById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.repairsService.findRepairRequestById(id, req.user.id, req.user.role);
    
    // Log de la consultation d'une demande de réparation
    await this.logsService.log(
      'info',
      'repair',
      `Consultation d'une demande de réparation`,
      { 
        repairRequestId: id,
        userId: req.user.id,
        role: req.user.role 
      },
      req.user.id
    );
    
    return result;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une demande de réparation' })
  @ApiResponse({ status: 200, description: 'Demande de réparation mise à jour' })
  @ApiResponse({ status: 404, description: 'Demande de réparation non trouvée' })
  async updateRepairRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRepairRequestDto: UpdateRepairRequestDto,
    @Request() req,
  ) {
    const result = await this.repairsService.updateRepairRequest(id, updateRepairRequestDto, req.user.id, req.user.role);
    
    // Log de la mise à jour d'une demande de réparation
    await this.logsService.log(
      'info',
      'repair',
      `Mise à jour d'une demande de réparation`,
      { 
        repairRequestId: id,
        userId: req.user.id,
        role: req.user.role,
        updatedFields: Object.keys(updateRepairRequestDto) 
      },
      req.user.id
    );
    
    return result;
  }

  @Post(':repairRequestId/interventions')
  @ApiOperation({ summary: 'Créer une nouvelle intervention' })
  @ApiResponse({ status: 201, description: 'Intervention créée avec succès' })
  async createIntervention(
    @Param('repairRequestId', ParseIntPipe) repairRequestId: number,
    @Body() createInterventionDto: CreateInterventionDto,
    @Request() req,
  ) {
    const result = await this.repairsService.createIntervention(repairRequestId, createInterventionDto, req.user.id);
    
    // Log de la création d'une intervention
    await this.logsService.log(
      'info',
      'intervention',
      `Nouvelle intervention créée`,
      { 
        interventionId: result.id,
        repairRequestId: repairRequestId,
        userId: req.user.id,
        commentaire: createInterventionDto.commentaire 
      },
      req.user.id
    );
    
    return result;
  }

  @Put('interventions/:id')
  @ApiOperation({ summary: 'Mettre à jour une intervention' })
  @ApiResponse({ status: 200, description: 'Intervention mise à jour' })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async updateIntervention(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInterventionDto: UpdateInterventionDto,
    @Request() req,
  ) {
    const result = await this.repairsService.updateIntervention(id, updateInterventionDto, req.user.id);
    
    // Log de la mise à jour d'une intervention
    await this.logsService.log(
      'info',
      'intervention',
      `Mise à jour d'une intervention`,
      { 
        interventionId: id,
        userId: req.user.id,
        updatedFields: Object.keys(updateInterventionDto) 
      },
      req.user.id
    );
    
    return result;
  }

  @Put('interventions/:id/finalize')
  @ApiOperation({ summary: 'Finaliser une intervention' })
  @ApiResponse({ status: 200, description: 'Intervention finalisée' })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async finalizeIntervention(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.repairsService.finalizeIntervention(id, req.user.id);
    
    // Log de la finalisation d'une intervention
    await this.logsService.log(
      'info',
      'intervention',
      `Intervention finalisée`,
      { 
        interventionId: id,
        userId: req.user.id,
        status: 'finalized' 
      },
      req.user.id
    );
    
    return result;
  }
} 