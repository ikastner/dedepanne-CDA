import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../modules/users/entities/user.entity';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { LoginDto } from '../modules/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password_hash, first_name, last_name, phone } = createUserDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Créer le nouvel utilisateur
    const user = this.usersRepository.create({
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      phone,
      role: UserRole.CLIENT, // Rôle par défaut
      is_active: true,
    });

    const savedUser = await this.usersRepository.save(user);

    // Générer le token JWT
    const payload = { email: savedUser.email, sub: savedUser.id, role: savedUser.role };
    const token = this.jwtService.sign(payload);

    // Retourner les données sans le mot de passe
    const { password_hash: _, ...result } = savedUser;
    return {
      user: result,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Trouver l'utilisateur
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier si l'utilisateur est actif
    if (!user.is_active) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Générer le token JWT
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    // Retourner les données sans le mot de passe
    const { password_hash: _, ...result } = user;
    return {
      user: result,
      token,
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const { password_hash: _, ...result } = user;
    return result;
  }

  async promoteUser(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Promouvoir en admin
    user.role = UserRole.ADMIN;
    user.updated_at = new Date();
    
    const updatedUser = await this.usersRepository.save(user);
    
    const { password_hash: _, ...result } = updatedUser;
    return {
      message: 'Utilisateur promu avec succès',
      user: result,
    };
  }

  async getAllUsers() {
    const users = await this.usersRepository.find({
      select: ['id', 'email', 'first_name', 'last_name', 'phone', 'role', 'is_active', 'created_at', 'updated_at'],
      order: { created_at: 'DESC' },
    });

    return {
      users,
      total: users.length,
    };
  }
} 