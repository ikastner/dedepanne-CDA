import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReconditionedProduct, Order, OrderItem, OrderHistory, OrderStatus } from '../../database/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ReconditionedProduct)
    private productRepository: Repository<ReconditionedProduct>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderHistory)
    private orderHistoryRepository: Repository<OrderHistory>,
  ) {}

  async findAllProducts(): Promise<ReconditionedProduct[]> {
    return this.productRepository.find({
      where: { is_available: true },
      order: { created_at: 'DESC' },
    });
  }

  async findAllProductsPublic(search?: string, category?: string, brand?: string): Promise<any[]> {
    let query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.applianceType', 'applianceType')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('product.is_available = :isAvailable', { isAvailable: true });

    if (search) {
      query = query.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (category && category !== 'all') {
      query = query.andWhere('applianceType.name = :category', { category });
    }

    if (brand && brand !== 'all') {
      query = query.andWhere('brand.name = :brand', { brand });
    }

    const products = await query
      .orderBy('product.created_at', 'DESC')
      .getMany();

    // Transformer les données pour le frontend
    return products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand?.name || 'Marque inconnue',
      category: product.applianceType?.name || 'Catégorie inconnue',
      price: parseFloat(product.price.toString()),
      original_price: parseFloat(product.original_price.toString()),
      condition: product.condition_rating,
      warranty_months: product.warranty_months,
      features: product.features || [],
      description: product.description,
      image_url: product.image_url || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent((product.brand?.name || '') + ' ' + (product.applianceType?.name || ''))}`,
      is_available: product.is_available,
      stock_quantity: product.stock_quantity,
      created_at: product.created_at,
      savings_percentage: parseFloat(product.savings_percentage.toString())
    }));
  }

  async findProductById(id: number): Promise<ReconditionedProduct> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }
    
    return product;
  }

  async findProductByIdPublic(id: number): Promise<any> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.applianceType', 'applianceType')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('product.id = :id', { id })
      .andWhere('product.is_available = :isAvailable', { isAvailable: true })
      .getOne();

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    // Créer les spécifications techniques basées sur les features
    const features = product.features || [];
    const specifications = {
      "Capacité": features.find((f: string) => f.includes('kg') || f.includes('L')) || "N/A",
      "Vitesse d'essorage": features.find((f: string) => f.includes('tr/min')) || "N/A",
      "Classe énergétique": features.find((f: string) => f.includes('A+') || f.includes('A++')) || "N/A",
      "Programmes": features.find((f: string) => f.includes('programmes')) || "N/A",
      "Affichage": features.find((f: string) => f.includes('écran') || f.includes('LED')) || "N/A",
      "Dimensions": "60 x 60 x 85 cm" // Valeur par défaut
    };

    // Détails du reconditionnement
    const reconditioning_details = [
      "Test complet de toutes les fonctions",
      "Nettoyage professionnel",
      "Remplacement des pièces usées",
      "Vérification de l'étanchéité",
      "Test de performance"
    ];

    return {
      id: product.id,
      name: product.name,
      brand: product.brand?.name || 'Marque inconnue',
      category: product.applianceType?.name || 'Catégorie inconnue',
      price: parseFloat(product.price.toString()),
      original_price: parseFloat(product.original_price.toString()),
      condition: product.condition_rating,
      warranty_months: product.warranty_months,
      features: features,
      description: product.description,
      image_url: product.image_url || `/placeholder.svg?height=400&width=400&text=${encodeURIComponent((product.brand?.name || '') + ' ' + (product.applianceType?.name || ''))}`,
      is_available: product.is_available,
      stock_quantity: product.stock_quantity,
      created_at: product.created_at,
      savings_percentage: parseFloat(product.savings_percentage.toString()),
      specifications: specifications,
      reconditioning_details: reconditioning_details
    };
  }

  async createProduct(productData: any): Promise<ReconditionedProduct> {
    // Calculer le pourcentage de réduction
    const savingsPercentage = ((productData.original_price - productData.price) / productData.original_price) * 100;

    const product = this.productRepository.create({
      ...productData,
      savings_percentage: savingsPercentage,
      is_available: true,
      stock_quantity: productData.stock_quantity || 0
    });

    const savedProduct = await this.productRepository.save(product);
    return savedProduct;
  }

  async updateProduct(id: number, productData: any): Promise<ReconditionedProduct> {
    const product = await this.findProductById(id);
    
    // Calculer le pourcentage de réduction si les prix ont changé
    if (productData.original_price && productData.price) {
      productData.savings_percentage = ((productData.original_price - productData.price) / productData.original_price) * 100;
    }

    Object.assign(product, productData);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    const product = await this.findProductById(id);
    
    // Option 1: Suppression physique
    await this.productRepository.remove(product);
    
    // Option 2: Suppression logique (décommenter si préféré)
    // product.is_available = false;
    // await this.productRepository.save(product);
    
    return { message: 'Produit supprimé avec succès' };
  }

  async createOrder(userId: number, items: Array<{ product_id: number; quantity: number }>): Promise<Order> {
    const referenceCode = this.generateReferenceCode('ORD');
    
    // Calculer le montant total
    let totalAmount = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of items) {
      const product = await this.findProductById(item.product_id);
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        order_id: 0, // Sera mis à jour après création de la commande
        product_id: item.product_id,
        name: product.name,
        price: product.price,
      });
    }

    // Créer la commande
    const order = this.orderRepository.create({
      user_id: userId,
      reference_code: referenceCode,
      total_amount: totalAmount,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Créer les articles de commande
    for (const item of orderItems) {
      item.order_id = savedOrder.id;
      await this.orderItemRepository.save(item);
    }

    // Créer l'historique initial
    await this.createOrderHistory(savedOrder.id, 'confirmée', 'Commande créée');

    return savedOrder;
  }

  async findOrderById(id: number, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, user_id: userId },
      relations: ['items', 'history'],
    });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    return order;
  }

  async updateOrderStatus(id: number, status: OrderStatus, userId: number): Promise<Order> {
    const order = await this.findOrderById(id, userId);
    
    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);

    // Créer l'historique
    await this.createOrderHistory(id, status, `Statut mis à jour vers ${status}`);

    return updatedOrder;
  }

  private async createOrderHistory(orderId: number, etape: string, commentaire?: string): Promise<OrderHistory> {
    const history = this.orderHistoryRepository.create({
      order_id: orderId,
      etape,
      commentaire,
    });

    return this.orderHistoryRepository.save(history);
  }

  private generateReferenceCode(prefix: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }
} 