import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LogsService } from '../logs/logs.service';

@ApiTags('Produits')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly logsService: LogsService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les produits reconditionnés' })
  @ApiResponse({ status: 200, description: 'Liste des produits' })
  async findAllProducts(@Request() req) {
    const result = await this.productsService.findAllProducts();
    
    // Log de la consultation des produits
    await this.logsService.log(
      'info',
      'product',
      `Consultation de tous les produits`,
      { 
        userId: req.user.id,
        count: result.length 
      },
      req.user.id
    );
    
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un produit par ID' })
  @ApiResponse({ status: 200, description: 'Détails du produit' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async findProductById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.productsService.findProductById(id);
    
    // Log de la consultation d'un produit
    await this.logsService.log(
      'info',
      'product',
      `Consultation d'un produit`,
      { 
        productId: id,
        userId: req.user.id 
      },
      req.user.id
    );
    
    return result;
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau produit reconditionné' })
  @ApiResponse({ status: 201, description: 'Produit créé avec succès' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Seuls les admins peuvent créer des produits' })
  async createProduct(@Body() productData: any, @Request() req) {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Seuls les administrateurs peuvent créer des produits');
    }

    const result = await this.productsService.createProduct(productData);
    
    // Log de la création d'un produit
    await this.logsService.log(
      'info',
      'product',
      `Nouveau produit créé`,
      { 
        productId: result.id,
        userId: req.user.id,
        productName: result.name 
      },
      req.user.id
    );
    
    return result;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un produit reconditionné' })
  @ApiResponse({ status: 200, description: 'Produit modifié avec succès' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Seuls les admins peuvent modifier des produits' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() productData: any, @Request() req) {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Seuls les administrateurs peuvent modifier des produits');
    }

    const result = await this.productsService.updateProduct(id, productData);
    
    // Log de la modification d'un produit
    await this.logsService.log(
      'info',
      'product',
      `Produit modifié`,
      { 
        productId: id,
        userId: req.user.id,
        productName: result.name 
      },
      req.user.id
    );
    
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un produit reconditionné' })
  @ApiResponse({ status: 200, description: 'Produit supprimé avec succès' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Seuls les admins peuvent supprimer des produits' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Seuls les administrateurs peuvent supprimer des produits');
    }

    const result = await this.productsService.deleteProduct(id);
    
    // Log de la suppression d'un produit
    await this.logsService.log(
      'info',
      'product',
      `Produit supprimé`,
      { 
        productId: id,
        userId: req.user.id 
      },
      req.user.id
    );
    
    return result;
  }

  @Post('orders')
  @ApiOperation({ summary: 'Créer une nouvelle commande' })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès' })
  async createOrder(@Body() orderData: { items: Array<{ product_id: number; quantity: number }> }, @Request() req) {
    const result = await this.productsService.createOrder(req.user.id, orderData.items);
    
    // Log de la création d'une commande
    await this.logsService.log(
      'info',
      'order',
      `Nouvelle commande créée`,
      { 
        orderId: result.id,
        userId: req.user.id,
        itemsCount: orderData.items.length,
        totalItems: orderData.items.reduce((sum, item) => sum + item.quantity, 0) 
      },
      req.user.id
    );
    
    return result;
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Récupérer une commande par ID' })
  @ApiResponse({ status: 200, description: 'Détails de la commande' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée' })
  async findOrderById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.productsService.findOrderById(id, req.user.id);
    
    // Log de la consultation d'une commande
    await this.logsService.log(
      'info',
      'order',
      `Consultation d'une commande`,
      { 
        orderId: id,
        userId: req.user.id 
      },
      req.user.id
    );
    
    return result;
  }
} 