import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation, DonationHistory, DonationStatus } from '../../database/entities/donation.entity';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
    @InjectRepository(DonationHistory)
    private donationHistoryRepository: Repository<DonationHistory>,
  ) {}

  async createDonation(userId: number, donationData: any): Promise<Donation> {
    const referenceCode = this.generateReferenceCode('DON');
    
    const donation = this.donationRepository.create({
      ...donationData,
      user_id: userId,
      reference_code: referenceCode,
      status: DonationStatus.PENDING,
    });

    const savedDonation = await this.donationRepository.save(donation) as unknown as Donation;

    // Créer l'historique initial
    await this.createDonationHistory(savedDonation.id, 'collecté', 'Don proposé');

    return savedDonation;
  }

  async findAllDonations(userId: number): Promise<Donation[]> {
    return this.donationRepository.find({
      where: { user_id: userId },
      relations: ['history'],
      order: { created_at: 'DESC' },
    });
  }

  async findDonationById(id: number, userId: number): Promise<Donation> {
    const donation = await this.donationRepository.findOne({
      where: { id, user_id: userId },
      relations: ['history'],
    });

    if (!donation) {
      throw new NotFoundException('Don non trouvé');
    }

    return donation;
  }

  async updateDonationStatus(id: number, status: DonationStatus, userId: number): Promise<Donation> {
    const donation = await this.findDonationById(id, userId);
    
    donation.status = status;
    const updatedDonation = await this.donationRepository.save(donation);

    // Créer l'historique
    await this.createDonationHistory(id, status, `Statut mis à jour vers ${status}`);

    return updatedDonation;
  }

  private async createDonationHistory(donationId: number, etape: string, commentaire?: string): Promise<DonationHistory> {
    const history = this.donationHistoryRepository.create({
      donation_id: donationId,
      etape,
      commentaire,
    });

    return this.donationHistoryRepository.save(history);
  }

  private generateReferenceCode(prefix: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }
} 