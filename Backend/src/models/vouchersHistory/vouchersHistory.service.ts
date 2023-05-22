import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { VouchershistoryRepository } from './vouchersHistory.repository';
import { CreateVouchershistoryDto } from './dto/create-vouchersHistory.dto';
import { UpdateVouchershistoryDto } from './dto/update-vouchersHistory.dto';
import { UserplanRepository } from '../userPlan/userPlan.repository';
import { UserplanService } from '../userPlan/userPlan.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class VouchershistoryService {
  constructor(
    private readonly vouchersHistoryRepository: VouchershistoryRepository,
    private readonly userPlanService: UserplanService,
    private readonly usersService: UsersService,
  ) {}

  create(createVouchershistoryDto: CreateVouchershistoryDto) {
    return this.vouchersHistoryRepository.create(createVouchershistoryDto);
  }

  findAll() {
    return this.vouchersHistoryRepository.findAll();
  }

  findOne(id: string) {
    return this.vouchersHistoryRepository.findOne(id);
  }

  async findForFiscalYear(userID: string, fiscalYear: string) {
    const user = await this.usersService.findOne(userID);

    if (user.role.shortCode === 'PFLUX') {
      const vouchersNumber =
        await this.vouchersHistoryRepository.findByClientsByFiscalYear(
          userID,
          fiscalYear,
        );

      const userPlans = await this.userPlanService.findByUserIDAndFiscalYear(
        userID,
        fiscalYear,
      );

      if (userPlans.length > 0) {
        const numberOfVouchersAvailable = userPlans[0].formula[fiscalYear];
        return {
          available: numberOfVouchersAvailable - vouchersNumber,
          used: vouchersNumber,
          total: numberOfVouchersAvailable,
        };
      } else {
        throw new HttpException(
          'No Plan bought for this user for said fiscal year',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException('UnAuthorized', HttpStatus.CONFLICT);
    }
  }

  async findForAllFiscalYear(userID: string) {
    const user = await this.usersService.findOne(userID);

    if (user.role.shortCode === 'PFLUX') {
      const clients = await this.vouchersHistoryRepository.findByClients(
        userID,
      );

      const clientByFiscalYears = {};

      for (let i = 0; i < clients.length; i++) {
        if (clientByFiscalYears.hasOwnProperty(clients[i].fiscalYear)) {
          clientByFiscalYears[clients[i].fiscalYear] = clientByFiscalYears[
            clients[i].fiscalYear
          ].push(clients[i]);
        } else {
          clientByFiscalYears[clients[i].fiscalYear] = [clients[i]];
        }
      }

      const vouchers = [];

      // const fiscalYears = Object.keys(clientByFiscalYears);
      const userPlans = await this.userPlanService.findByUserID(userID);
      for (let i = 0; i < userPlans.length; i++) {
        const numberOfVouchersAvailable =
          userPlans[i].formula[Object.keys(userPlans[i].formula)[0]];

        vouchers.push({
          fiscalYear: Object.keys(userPlans[i].formula)[0],
          available:
            numberOfVouchersAvailable -
            (clientByFiscalYears[Object.keys(userPlans[i].formula)[0]]
              ? clientByFiscalYears[Object.keys(userPlans[i].formula)[0]].length
              : 0),
          used: clientByFiscalYears[Object.keys(userPlans[i].formula)[0]]
            ? clientByFiscalYears[Object.keys(userPlans[i].formula)[0]].length
            : 0,
          total: numberOfVouchersAvailable,
        });
      }
      return vouchers;
    } else {
      throw new HttpException('UnAuthorized', HttpStatus.CONFLICT);
    }
  }

  async findByUser(accountantID: string, fiscalYear: string) {
    return await this.vouchersHistoryRepository.findByUser(
      accountantID,
      fiscalYear,
    );
  }

  async findByClientID(
    accountantID: string,
    clientID: string,
    fiscalYear: string,
    creditYear: string,
  ) {
    return await this.vouchersHistoryRepository.findByClientID(
      accountantID,
      clientID,
      fiscalYear,
      creditYear,
    );
  }
  4;
  async findClientsByFiscalYear(accountantID: string, creditYear: string) {
    return await this.vouchersHistoryRepository.findByClientsByFiscalYear(
      accountantID,
      creditYear,
    );
  }

  update(id: string, updateVouchershistoryDto: UpdateVouchershistoryDto) {
    return this.vouchersHistoryRepository.update(id, updateVouchershistoryDto);
  }

  remove(id: string) {
    return this.vouchersHistoryRepository.remove(id);
  }
}
