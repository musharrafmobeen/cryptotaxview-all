import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payments.repository';
import Stripe from 'stripe';
import { PaymentPlansRepository } from '../payment-plans/payment-plans.repository';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { TransactionsService } from '../transactions/transactions.service';
import { InvoiceService } from '../invoice/invoice.service';
import { UserplanService } from '../userPlan/userPlan.service';
import { UserpaymentamountsService } from '../userPaymentAmounts/userPaymentAmounts.service';
import { LedgersService } from '../ledgers/ledgers.service';
@Injectable()
export class PaymentsService {
  constructor(
    @Inject('PAYMENT_REPOSITORY')
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentPlansService: PaymentPlansRepository,
    private readonly rolesService: RolesService,
    private readonly userService: UsersService,
    private readonly transactionsService: TransactionsService,
    private readonly invoiceService: InvoiceService,
    private readonly userPlanService: UserplanService,
    private readonly userPaymentAmountsService: UserpaymentamountsService,
    private readonly ledgersService: LedgersService,
  ) {}
  async create(createPaymentDto: CreatePaymentDto, fiscalYear: string) {
    let paymentPlan = await this.paymentPlansService.findOne(
      createPaymentDto.paymentPlan,
    );

    const paymentPlans = await this.paymentPlansService.findAll();

    if (paymentPlan.type === 'professional') {
      const userPlans = await this.userPlanService.findByUserID(
        createPaymentDto.userID,
      );
      const userPlan = userPlans.filter((userPlan) =>
        userPlan.formula.hasOwnProperty(fiscalYear),
      );
      if (userPlan.length > 0) {
        //@ts-ignore
        const paymentPlanClients = paymentPlan?.info?.planFeatures[0]['value'];
        const userPlanClients = userPlan[0].formula[fiscalYear];

        if (paymentPlanClients <= userPlanClients) {
          throw new HttpException(
            'Cannot downgrade and buy the same plan',
            HttpStatus.CONFLICT,
          );
        } else {
          //@ts-ignore
          const price =
            //@ts-ignore
            (paymentPlan?.info?.planFeatures[0]['value'] -
              userPlan[0].formula[fiscalYear]) *
            //@ts-ignore
            (paymentPlan.price / paymentPlan?.info?.planFeatures[0]['value']);
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2020-08-27',
          });
          const charge = await stripe.charges.create({
            amount: price * 100,
            currency: 'aud',
            source: createPaymentDto.token,
          });

          if (charge) {
            const role = await this.rolesService.lookupRole(
              paymentPlan.roleShortCode,
            );
            const user = await this.userService.update(
              createPaymentDto.userID,
              {
                role,
              },
            );
            const invoice = await this.invoiceService.create({
              dateOfInvoice: new Date(),
              invoiceAmount: price * 100,
              expiryDate: new Date('06/30/' + fiscalYear.split('-')[1]),
              chargedOn: new Date(),
              mode: 'stripe',
              status: 1,
              user,
              pId: paymentPlan.id,
            });
            if (userPlans.length > 0) {
              const userPlan = userPlans.filter((userPlan) =>
                userPlan.formula.hasOwnProperty(fiscalYear),
              );
              if (userPlan.length > 0) {
                await this.userPlanService.update(userPlan[0].id, {
                  status: 0,
                });
              }
            }

            const userPlan = await this.userPlanService.create({
              dateOfSubscription: new Date(),
              dateOfUpgrade: null,
              formula: JSON.parse(
                JSON.stringify({
                  [fiscalYear]:
                    //@ts-ignore
                    +paymentPlan?.info?.planFeatures[0]['value'],
                }),
              ),
              type: createPaymentDto.type,
              status: 1,
              paymentPlan: [paymentPlan],
              user: user.id,
            });
          }
          await this.paymentRepository.create(
            createPaymentDto,
            +paymentPlan.price,
          );
        }
      } else {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2020-08-27',
        });
        const charge = await stripe.charges.create({
          amount: paymentPlan.price * 100,
          currency: 'aud',
          source: createPaymentDto.token,
        });
        if (charge) {
          const role = await this.rolesService.lookupRole(
            paymentPlan.roleShortCode,
          );
          const user = await this.userService.update(createPaymentDto.userID, {
            role,
          });
          const invoice = await this.invoiceService.create({
            dateOfInvoice: new Date(),
            invoiceAmount: paymentPlan.price * 100,
            expiryDate: new Date('06/30/' + fiscalYear.split('-')[1]),
            chargedOn: new Date(),
            mode: 'stripe',
            status: 1,
            user,
            pId: paymentPlan.id,
          });
          if (userPlans.length > 0) {
            const userPlan = userPlans.filter((userPlan) =>
              userPlan.formula.hasOwnProperty(fiscalYear),
            );
            if (userPlan.length > 0) {
              await this.userPlanService.update(userPlan[0].id, {
                status: 0,
              });
            }
          }

          const userPlan = await this.userPlanService.create({
            dateOfSubscription: new Date(),
            dateOfUpgrade: null,
            formula: JSON.parse(
              JSON.stringify({
                [fiscalYear]:
                  //@ts-ignore
                  +paymentPlan.info?.planFeatures[0]['value'],
              }),
            ),
            type: createPaymentDto.type,
            status: 1,
            paymentPlan: [paymentPlan],
            user: user.id,
          });
        } else {
          throw new HttpException(
            'Transactions Not Completed',
            HttpStatus.CONFLICT,
          );
        }
        await this.paymentRepository.create(
          createPaymentDto,
          +paymentPlan.price,
        );
      }
    } else if (paymentPlan.type === 'personal') {
      // const date = new Date();
      // let fiscalYear = '';
      // const month = date.getMonth() + 1;
      // const year = date.getFullYear();
      // if (month > 6) {
      //   fiscalYear = year + '-' + (year + 1);
      // } else {
      //   fiscalYear = year - 1 + '-' + year;
      // }

      const userPlans = await this.userPlanService.findByUserID(
        createPaymentDto.userID,
      );

      const transactions =
        await this.transactionsService.getAllTransactionsDataByFiscalYear(
          createPaymentDto.userID,
          fiscalYear,
        );
      let transactionsLength = transactions.length;
      if (userPlans.length > 0) {
        const userPlan = userPlans.filter((userPlan) =>
          userPlan.formula.hasOwnProperty(fiscalYear),
        );
        if (
          (userPlan.length > 0 &&
            userPlan[0].formula[fiscalYear] >= transactionsLength &&
            userPlan[0].paymentPlan[0].id === createPaymentDto.paymentPlan) ||
          (userPlan.length > 0 &&
            userPlan[0].formula[fiscalYear] === null &&
            userPlan[0].paymentPlan[0].id === createPaymentDto.paymentPlan)
        ) {
          throw new HttpException('Already Paid', HttpStatus.CONFLICT);
        } else if (
          userPlan.length > 0 &&
          userPlan[0].formula[fiscalYear] < transactionsLength &&
          userPlan[0].paymentPlan[0].id === createPaymentDto.paymentPlan
        ) {
          transactionsLength =
            transactionsLength - userPlan[0].formula[fiscalYear];
          const order = userPlan[0].paymentPlan[0].order;
          const nextPaymentPlan = paymentPlans.filter(
            (paymentPlan) =>
              paymentPlan.order === order + 1 &&
              paymentPlan.type === 'personal',
          );
          if (
            transactions.length >=
            (nextPaymentPlan[0].userPaymentAmounts.percentageValue === null
              ? Number.POSITIVE_INFINITY
              : nextPaymentPlan[0].userPaymentAmounts.percentageValue)
          ) {
            throw new HttpException(
              'You Can Cannot Upgrade this plan',
              HttpStatus.CONFLICT,
            );
          }
          if (
            nextPaymentPlan.length > 0 &&
            paymentPlan.info.hasOwnProperty('planFeatures')
          ) {
            paymentPlan = {
              ...paymentPlan,
              price:
                transactionsLength *
                (nextPaymentPlan[0].userPaymentAmounts.price /
                  nextPaymentPlan[0].userPaymentAmounts.minNoOfTransactions),
              info: {
                ...paymentPlan.info,
                //@ts-ignore
                planFeatures: [
                  ...paymentPlan.info['planFeatures'],
                  { text: 'Transactions', value: transactionsLength },
                ],
                priceValue: (
                  transactionsLength *
                  (nextPaymentPlan[0].userPaymentAmounts.price /
                    nextPaymentPlan[0].userPaymentAmounts.minNoOfTransactions)
                ).toString(),
              },
            };
          }
        }
      }

      if (userPlans.length > 0) {
        const userPlan = userPlans.filter((userPlan) =>
          userPlan.formula.hasOwnProperty(fiscalYear),
        );

        if (userPlan.length > 0) {
          const paymentPlanUser = await this.paymentPlansService.findOne(
            userPlan[0].paymentPlan[0].id,
          );

          if (
            paymentPlanUser.userPaymentAmounts.maxNoOfTransactions >
              (paymentPlan.userPaymentAmounts.maxNoOfTransactions === null
                ? Number.POSITIVE_INFINITY
                : paymentPlan.userPaymentAmounts.maxNoOfTransactions) ||
            paymentPlanUser.userPaymentAmounts.maxNoOfTransactions === null
          ) {
            throw new HttpException(
              'Cannot Not Downgrade plan.',
              HttpStatus.CONFLICT,
            );
          }
          if (paymentPlan.id !== paymentPlanUser.id) {
            paymentPlan = {
              ...paymentPlan,
              price: paymentPlan.price - paymentPlanUser.price,
            };
          }
        }
      }

      const userAmounts = await this.userPaymentAmountsService.findAll();

      const userAmount = userAmounts.filter(
        (userAmount) =>
          Math.floor(paymentPlan.price) >= userAmount.minNoOfTransactions &&
          Math.floor(paymentPlan.price) <= userAmount.maxNoOfTransactions,
      );

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2020-08-27',
      });

      try {
        const price =
          Math.floor(paymentPlan.price * 100) < 50
            ? 50
            : Math.floor(paymentPlan.price * 100);
        const charge = await stripe.charges.create({
          amount: price,
          currency: 'aud',
          source: createPaymentDto.token,
        });
        if (charge) {
          const role = await this.rolesService.lookupRole(
            paymentPlan.roleShortCode,
          );
          const user = await this.userService.update(createPaymentDto.userID, {
            role,
          });
          const invoice = await this.invoiceService.create({
            dateOfInvoice: new Date(),
            invoiceAmount: price,
            expiryDate: new Date('06/30/' + fiscalYear.split('-')[1]),
            chargedOn: new Date(),
            mode: 'stripe',
            status: 1,
            user,
            pId: paymentPlan.id,
          });
          if (userPlans.length > 0) {
            const userPlan = userPlans.filter((userPlan) =>
              userPlan.formula.hasOwnProperty(fiscalYear),
            );
            if (userPlan.length > 0) {
              await this.userPlanService.update(userPlan[0].id, { status: 0 });
            }
          }

          const userPlan = await this.userPlanService.create({
            dateOfSubscription: new Date(),
            dateOfUpgrade: null,
            formula: JSON.parse(
              JSON.stringify({
                [fiscalYear]:
                  paymentPlan.userPaymentAmounts.maxNoOfTransactions <
                  transactions.length
                    ? transactions.length
                    : paymentPlan.userPaymentAmounts.maxNoOfTransactions,
              }),
            ),
            type: createPaymentDto.type,
            status: 1,
            paymentPlan: [paymentPlan],
            user: user.id,
          });
        }
        await this.paymentRepository.create(
          createPaymentDto,
          +paymentPlan.price,
        );
      } catch (e) {
        console.log(e);
      }
      return 'This action adds a new payment';
    } else {
      throw new HttpException(
        'No such payment plan found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async createProfessional(createPaymentDto: CreatePaymentDto) {
    const date = new Date();
    let fiscalYear = '';
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (month > 6) {
      fiscalYear = year + '-' + (year + 1);
    } else {
      fiscalYear = year - 1 + '-' + year;
    }
    let paymentPlan = await this.paymentPlansService.findOne(
      createPaymentDto.paymentPlan,
    );

    const paymentPlans = await this.paymentPlansService.findAll();

    if (paymentPlan.type === 'professional') {
      const userPlans = await this.userPlanService.findByUserID(
        createPaymentDto.userID,
      );

      const userPlanFiltered = userPlans.filter(
        (userPlan) =>
          userPlan.type === 'professional' &&
          userPlan.formula.hasOwnProperty(fiscalYear),
      );

      const price =
        //@ts-ignore
        +paymentPlan?.info['priceValue'];

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2020-08-27',
      });
      const charge = await stripe.charges.create({
        amount: price * 100,
        currency: 'aud',
        source: createPaymentDto.token,
      });

      if (charge) {
        const role = await this.rolesService.lookupRole(
          paymentPlan.roleShortCode,
        );
        const user = await this.userService.update(createPaymentDto.userID, {
          role,
        });
        const invoice = await this.invoiceService.create({
          dateOfInvoice: new Date(),
          invoiceAmount: price * 100,
          expiryDate: new Date('06/30/' + fiscalYear.split('-')[1]),
          chargedOn: new Date(),
          mode: 'stripe',
          status: 1,
          user,
          pId: paymentPlan.id,
        });

        // let additionalBalance = 0;

        const ledgers = await this.ledgersService.findByUserAndFiscalYear(
          createPaymentDto.userID,
          fiscalYear,
        );

        // for (let i = 0; i < ledgers.length; i++) {
        //   additionalBalance += ledgers[i].balance;
        // }

        //@ts-ignore
        const credits = +paymentPlan?.info?.planFeatures[0]['value'];

        const ledger = await this.ledgersService.create({
          accountantID: createPaymentDto.userID,
          date: new Date().getTime().toString(),
          balance: credits + (ledgers.length > 0 ? ledgers.at(-1).balance : 0),
          credit: credits,
          fiscalYear,
          user: null,
        });
        if (userPlanFiltered.length > 0) {
          await this.userPlanService.update(userPlanFiltered[0].id, {
            formula: JSON.parse(
              JSON.stringify({
                [fiscalYear]: userPlanFiltered[0].formula[fiscalYear] + credits,
              }),
            ),
          });
        } else {
          const userPlan = await this.userPlanService.create({
            dateOfSubscription: new Date(),
            dateOfUpgrade: null,
            formula: JSON.parse(
              JSON.stringify({
                [fiscalYear]: credits,
              }),
            ),
            type: createPaymentDto.type,
            status: 1,
            paymentPlan: [paymentPlan],
            user: user.id,
          });
        }
      }
      await this.paymentRepository.create(createPaymentDto, +paymentPlan.price);
    } else {
      throw new HttpException(
        'No such payment plan found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
