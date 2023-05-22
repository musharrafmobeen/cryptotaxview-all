import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Repository } from 'typeorm';
import { CreateBitcoinDto } from './dto/create-bitcoin.dto';
import { UpdateBitcoinDto } from './dto/update-bitcoin.dto';
import { Bitcoin } from './entities/bitcoin.entity';

@Injectable()
export class BitcoinRepository {
  constructor(
    @Inject('BITCOIN_REPOSITORY')
    private bitcoinRepository: Repository<Bitcoin>,
  ) {}

  getTransactions(createBitcoinDto: CreateBitcoinDto) {
    return 'This action adds a new bitcoin';
  }

  async findAll(keys: string[]) {
    const [key] = keys;
    const transactions = await axios.get(
      `https://blockchain.info/rawaddr/${key}`,
    );
    return transactions.data;
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
