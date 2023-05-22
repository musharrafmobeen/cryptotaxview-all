import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { createExcelFile } from './common/excelSheet';
import { createPDF } from './common/pdf';
import { UserplanService } from '../userPlan/userPlan.service';
import { TaxCalculationService } from './algorithms/fifoAlogorithm';

@Injectable()
export class AllExchangesRepository {
  constructor(
    private readonly transactionService: TransactionsService,
    private readonly userPlanService: UserplanService,
    private readonly taxCalculationService: TaxCalculationService,
  ) {}

  algos = {
    fifo: this.taxCalculationService.taxCalculator,
    lifo: this.taxCalculationService.taxCalculatorLifo,
  };

  async getExcelFile(
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAllTrxs(userID)
        : await this.transactionService.getAllTransactionsDataByFiscalYear(
            userID,
            financialYear,
          );
    if (trades.length < 1) {
      throw new HttpException(
        'No transaction found for the exchange',
        HttpStatus.NOT_FOUND,
      );
    }
    const userPlans = await this.userPlanService.findByUserID(userID);

    if (userPlans.length > 0) {
      const userPlan = userPlans.filter((userPlan) =>
        userPlan.formula.hasOwnProperty(financialYear),
      );
      if (
        userPlan.length > 0 &&
        userPlan[0].type === 'personal' &&
        userPlan[0].formula[financialYear] < trades.length
      ) {
        throw new HttpException(
          'Cannot create report. As the bought package does not support this number of transactions',
          HttpStatus.CONFLICT,
        );
      }
      if (userPlan.length === 0) {
        throw new HttpException(
          'Cannot create report. As the bought package does not have this fiscal year.',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        'Cannot create report. As you have not bought any package',
        HttpStatus.CONFLICT,
      );
    }

    return await createExcelFile(trades, filename, algorithm);
  }

  async getPDFFile(
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAllTrxs(userID)
        : await this.transactionService.getAllTransactionsDataByFiscalYear(
            userID,
            financialYear,
          );
    if (trades.length < 1) {
      throw new HttpException(
        'No transaction found for the exchange',
        HttpStatus.NOT_FOUND,
      );
    }
    const userPlans = await this.userPlanService.findByUserID(userID);

    if (userPlans.length > 0) {
      const userPlan = userPlans.filter((userPlan) =>
        userPlan.formula.hasOwnProperty(financialYear),
      );
      if (
        userPlan.length > 0 &&
        userPlan[0].type === 'personal' &&
        userPlan[0].formula[financialYear] < trades.length
      ) {
        throw new HttpException(
          'Cannot create report. As the bought package does not support this number of transactions',
          HttpStatus.CONFLICT,
        );
      }
      if (userPlan.length === 0) {
        throw new HttpException(
          'Cannot create report. As the bought package does not have this fiscal year.',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        'Cannot create report. As you have not bought any package',
        HttpStatus.CONFLICT,
      );
    }
    return await createPDF(trades, filename, algorithm, financialYear);
  }
  async getExcelFileClient(
    accountantID: string,
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
    fiscalYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAllTrxs(userID)
        : await this.transactionService.getAllTransactionsDataByFiscalYear(
            userID,
            financialYear,
          );
    if (trades.length < 1) {
      throw new HttpException(
        'No transaction found for the exchange',
        HttpStatus.NOT_FOUND,
      );
    }
    const userPlans = await this.userPlanService.findByUserID(accountantID);

    if (userPlans.length > 0) {
      const userPlan = userPlans.filter((userPlan) =>
        userPlan.formula.hasOwnProperty(fiscalYear),
      );
      if (
        userPlan.length > 0 &&
        userPlan[0].type === 'personal' &&
        userPlan[0].formula[fiscalYear] < trades.length
      ) {
        throw new HttpException(
          'Cannot create report. As the bought package does not support this number of transactions',
          HttpStatus.CONFLICT,
        );
      }
      if (userPlan.length === 0) {
        throw new HttpException(
          'Cannot create report. As the bought package does not have this fiscal year.',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        'Cannot create report. As you have not bought any package',
        HttpStatus.CONFLICT,
      );
    }

    return await createExcelFile(trades, filename, algorithm);
  }

  async getPDFFileClient(
    accountantID: string,
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
    fiscalYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAllTrxs(userID)
        : await this.transactionService.getAllTransactionsDataByFiscalYear(
            userID,
            financialYear,
          );
    if (trades.length < 1) {
      throw new HttpException(
        'No transaction found for the exchange',
        HttpStatus.NOT_FOUND,
      );
    }
    const userPlans = await this.userPlanService.findByUserID(accountantID);

    if (userPlans.length > 0) {
      const userPlan = userPlans.filter((userPlan) =>
        userPlan.formula.hasOwnProperty(fiscalYear),
      );
      if (
        userPlan.length > 0 &&
        userPlan[0].type === 'personal' &&
        userPlan[0].formula[fiscalYear] < trades.length
      ) {
        throw new HttpException(
          'Cannot create report. As the bought package does not support this number of transactions',
          HttpStatus.CONFLICT,
        );
      }
      if (userPlan.length === 0) {
        throw new HttpException(
          'Cannot create report. As the bought package does not have this fiscal year.',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        'Cannot create report. As you have not bought any package',
        HttpStatus.CONFLICT,
      );
    }
    return await createPDF(trades, filename, algorithm, financialYear);
  }
}
