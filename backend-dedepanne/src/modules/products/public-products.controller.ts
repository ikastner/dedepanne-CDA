import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('Produits Reconditionnés (Public)')
@Controller('public/products')
export class PublicProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les produits reconditionnés (public)' })
  @ApiResponse({ status: 200, description: 'Liste des produits reconditionnés' })
  async findAllProducts(@Query() query: any) {
    const { search, category, brand } = query;
    return this.productsService.findAllProductsPublic(search, category, brand);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un produit reconditionné par ID (public)' })
  @ApiResponse({ status: 200, description: 'Détails du produit reconditionné' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProductByIdPublic(id);
  }
} 