import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Address } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at'],
    });
    
    return users.map(user => {
      const { password_hash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async findById(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses'],
      select: ['id', 'email', 'first_name', 'last_name', 'role', 'phone', 'is_active', 'created_at'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Retirer le mot de passe de la réponse
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    
    Object.assign(user, updateUserDto);
    
    const updatedUser = await this.userRepository.save(user);
    
    // Retirer le mot de passe de la réponse
    const { password_hash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async createAddress(userId: number, createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create({
      ...createAddressDto,
      user_id: userId,
    });

    return this.addressRepository.save(address);
  }

  async getUserAddresses(userId: number): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user_id: userId },
    });
  }
} 