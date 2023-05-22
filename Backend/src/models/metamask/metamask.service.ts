import { Injectable } from '@nestjs/common';
import { CreateMetamaskDto } from './dto/create-metamask.dto';
import { UpdateMetamaskDto } from './dto/update-metamask.dto';

@Injectable()
export class MetamaskService {
  create(createMetamaskDto: CreateMetamaskDto) {
    return 'This action adds a new metamask';
  }

  findAll() {
    return `This action returns all metamask`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metamask`;
  }

  update(id: number, updateMetamaskDto: UpdateMetamaskDto) {
    return `This action updates a #${id} metamask`;
  }

  remove(id: number) {
    return `This action removes a #${id} metamask`;
  }
}
