import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { UserpaymentamountsService } from '../userPaymentAmounts/userPaymentAmounts.service';
import { UserplanService } from '../userPlan/userPlan.service';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';
import { PaymentPlansRepository } from './payment-plans.repository';

@Injectable()
export class PaymentPlansService {
  constructor(
    private readonly paymentRepository: PaymentPlansRepository,
    private readonly transactionsService: TransactionsService,
    private readonly userPlanService: UserplanService,
    private readonly userPaymentAmountService: UserpaymentamountsService,
  ) {}

  create(createPaymentPlanDto: CreatePaymentPlanDto) {
    return this.paymentRepository.create(createPaymentPlanDto);
  }

  async findAll(userID: string, fiscalYear: string) {
    // const date = new Date();
    // let fiscalYear = '';
    // const month = date.getMonth() + 1;
    // const year = date.getFullYear();
    // if (month > 6) {
    //   fiscalYear = year + '-' + (year + 1);
    // } else {
    //   fiscalYear = year - 1 + '-' + year;
    // }

    const paymentPlans = await this.paymentRepository.findAll();
    const userPaymentPlans = await this.userPaymentAmountService.findAll();
    const transactions =
      await this.transactionsService.getAllTransactionsDataByFiscalYear(
        userID,
        fiscalYear,
      );

    let transactionsLength = transactions.length;

    const userPlans = await this.userPlanService.findByUserID(userID);
    if (userPlans.length > 0) {
      const userPlan = userPlans.filter((userPlan) =>
        userPlan.formula.hasOwnProperty(fiscalYear),
      );
      if (userPlan.length > 0 && userPlan[0].formula[fiscalYear] === null) {
        transactionsLength = 0;
      } else if (
        userPlan.length > 0 &&
        userPlan[0].type === 'personal' &&
        userPlan[0].formula[fiscalYear] <= transactions.length
      ) {
        transactionsLength =
          transactionsLength - userPlan[0].formula[fiscalYear];
      } else if (
        userPlan.length > 0 &&
        userPlan[0].type === 'professional' &&
        userPlan[0].formula[fiscalYear]
      ) {
      }
    }

    let subtract = false;
    let subtractPrice = 0;
    let subtractProfessional = false;
    let subtractPriceProfessional = 0;
    const userPlan = userPlans.filter((userPlan) =>
      userPlan.formula.hasOwnProperty(fiscalYear),
    );

    const paymentPlansUpdated = paymentPlans.map((paymentPlan) => {
      if (paymentPlan.type === 'personal') {
        if (userPlan.length > 0) {
          const order = userPlan[0].paymentPlan[0].order;
          const nextPaymentPlan = paymentPlans.filter(
            (paymentPlan) =>
              paymentPlan.order === order + 1 &&
              paymentPlan.type === 'personal',
          );

          if (
            paymentPlan.info['title'] &&
            userPlan.length > 0 &&
            nextPaymentPlan.length > 0 &&
            paymentPlan.info['title'] ===
              userPlan[0].paymentPlan[0]?.info['title'] &&
            userPlan[0].paymentPlan[0].type === 'personal' &&
            userPlan[0].formula[fiscalYear] <= transactions.length
          ) {
            if (paymentPlan.type === 'personal') {
              subtract = true;
              subtractPrice = paymentPlan.price;
            }
            if (
              transactions.length >=
              (nextPaymentPlan[0].userPaymentAmounts.percentageValue === null
                ? Number.POSITIVE_INFINITY
                : nextPaymentPlan[0].userPaymentAmounts.percentageValue)
            ) {
              const price = 0;
              return {
                ...paymentPlan,
                price: price,
                info: {
                  ...paymentPlan.info,
                  buttonSubmitText: 'Active',
                  // planFeatures: [
                  //   ...paymentPlan.info['planFeatures'],
                  //   { text: 'Transactions', value: transactions.length },
                  // ],
                  priceValue: price.toString(),
                },
                status: 1,
              };
            } else {
              const price =
                transactionsLength *
                  (nextPaymentPlan[0].userPaymentAmounts.price /
                    nextPaymentPlan[0].userPaymentAmounts.minNoOfTransactions) <
                  0.5 && transactionsLength !== 0
                  ? 0.5
                  : transactionsLength *
                    (nextPaymentPlan[0].userPaymentAmounts.price /
                      nextPaymentPlan[0].userPaymentAmounts
                        .minNoOfTransactions);
              return {
                ...paymentPlan,
                price: price,
                info: {
                  ...paymentPlan.info,
                  buttonSubmitText: 'Active',
                  // planFeatures: [
                  //   ...paymentPlan.info['planFeatures'],
                  //   { text: 'Transactions', value: transactions.length },
                  // ],
                  priceValue: price.toString(),
                },
                status: 1,
              };
            }
          } else if (
            paymentPlan.info['title'] &&
            userPlan.length > 0 &&
            paymentPlan.info['title'] ===
              userPlan[0].paymentPlan[0]?.info['title'] &&
            userPlan[0].paymentPlan[0].type === 'personal' &&
            userPlan[0].formula[fiscalYear] >= transactions.length
          ) {
            if (paymentPlan.type === 'personal') {
              subtract = true;
              subtractPrice = paymentPlan.price;
            }
            return {
              ...paymentPlan,
              price: 0,
              info: {
                ...paymentPlan.info,
                buttonSubmitText: 'Active',
                // planFeatures: [
                //   ...paymentPlan.info['planFeatures'],
                //   { text: 'Transactions', value: transactions.length },
                // ],
                priceValue: 0,
              },

              status: 1,
            };
          }
        }
        if (paymentPlan.type === 'personal') {
          return {
            ...paymentPlan,
            status: 0,
            price:
              subtract === true
                ? paymentPlan.price - subtractPrice
                : paymentPlan.price,
            info: {
              ...paymentPlan.info,
              priceValue:
                subtract === true
                  ? (
                      parseInt(paymentPlan.info['priceValue']) - subtractPrice
                    ).toString()
                  : paymentPlan.price.toString(),
            },
          };
        }
        return paymentPlan;
      } else if (paymentPlan.type === 'professional') {
        // if (userPlan.length > 0) {
        //   const paymentPlanClients =
        //     //@ts-ignore
        //     paymentPlan?.info?.planFeatures[0]['value'];
        //   const userPlanClients = userPlan[0].formula[fiscalYear];
        //   if (paymentPlan.id === userPlan[0].paymentPlan[0].id) {
        //     return {
        //       ...paymentPlan,
        //       price: 0,
        //       info: {
        //         ...paymentPlan.info,
        //         buttonSubmitText: 'Active',
        //         priceValue: 0,
        //       },

        //       status: 1,
        //     };
        //   } else if (paymentPlanClients > userPlanClients) {
        //     return {
        //       ...paymentPlan,
        //       price:
        //         (paymentPlanClients - userPlanClients) *
        //         (paymentPlan.price / paymentPlanClients),
        //       info: {
        //         ...paymentPlan.info,
        //         priceValue:
        //           (paymentPlanClients - userPlanClients) *
        //           (paymentPlan.price / paymentPlanClients),
        //       },

        //       status: 0,
        //     };
        //   } else {
        //     return {
        //       ...paymentPlan,
        //       price: 0,
        //       info: {
        //         ...paymentPlan.info,
        //         priceValue: 0,
        //       },

        //       status: 0,
        //     };
        //   }
        // } else {
        //   return paymentPlan;
        // }

        return paymentPlan;
      }
    });

    return paymentPlansUpdated.sort((a, b) => a.order - b.order);
  }

  async findOne(id: string) {
    return await this.paymentRepository.findOne(id);
  }

  update(id: string, updatePaymentPlanDto: UpdatePaymentPlanDto) {
    return this.paymentRepository.update(id, updatePaymentPlanDto);
  }

  remove(id: string) {
    return this.paymentRepository.remove(id);
  }
}
