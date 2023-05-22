import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExchangePairsService } from '../exchange-pairs/exchange-pairs.service';
import { BitcoinRepository } from './bitcoin.repository';
import { CreateBitcoinDto } from './dto/create-bitcoin.dto';
import { UpdateBitcoinDto } from './dto/update-bitcoin.dto';

@Injectable()
export class BitcoinService {
  constructor(
    private readonly bitcoinRepository: BitcoinRepository,
    private readonly exchangePairService: ExchangePairsService,
  ) {}

  create(createBitcoinDto: CreateBitcoinDto) {
    return 'This action adds a new bitcoin';
  }

  async findAll(userID: string) {
    const exchangePairs = await this.exchangePairService.findOne(
      userID,
      'bitcoin',
    );
    const exchangePairsFiltered = exchangePairs[0];

    if (
      exchangePairsFiltered !== undefined &&
      exchangePairsFiltered.keys &&
      exchangePairsFiltered.keys.length > 0
    ) {
      const transactions = await this.bitcoinRepository.findAll(
        exchangePairsFiltered.keys,
      );

      for (let i = 0; i < transactions.txs.length; i++) {}
    }
    throw new HttpException('Exchange Not Integrated', HttpStatus.NOT_FOUND);
  }

  findOne(id: number) {
    return `This action returns a #${id} bitcoin`;
  }

  update(id: number, updateBitcoinDto: UpdateBitcoinDto) {
    return `This action updates a #${id} bitcoin`;
  }

  remove(id: number) {
    return `This action removes a #${id} bitcoin`;
  }
}
