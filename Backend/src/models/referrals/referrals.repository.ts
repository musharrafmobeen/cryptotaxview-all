import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { getManager, Repository } from 'typeorm';
import { UsersRepository } from '../users/users.repository';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { Referral } from './entities/referral.entity';

@Injectable()
export class ReferralsRepository {
  constructor(
    @Inject('REFERRAL_REPOSITORY')
    private referralRepository: Repository<Referral>,
    @Inject(forwardRef(() => UsersRepository))
    private usersRepository: UsersRepository,
  ) {}

  async create(createReferralDto: CreateReferralDto) {
    return await this.referralRepository.save(createReferralDto);
  }

  async findAll(userId: string) {
    const user = await this.usersRepository.findOne(userId);

    const entityManager = getManager();
    const transactions =
      await entityManager.query(`SELECT users.id,users.email,users."referredBy",COUNT(trx.id) FROM public.user AS users
left JOIN PUBLIC."transaction" AS trx ON uuid(trx."user") = users."id"
WHERE users."referredBy"='${user.referralCode}'
GROUP BY users.id`);

    const exchanges =
      await entityManager.query(`SELECT users.id,users.email,expair.name FROM public.user AS users
JOIN public.exchange_pair expair ON uuid(expair."userID")=users.id
WHERE users."referredBy"='${user.referralCode}'
UNION
SELECT users.id,users.email,userfile.exchange FROM public.user AS users
left JOIN PUBLIC.user_file userfile ON uuid(userfile.user)=users.id
WHERE users."referredBy"='${user.referralCode}' AND userfile."type"=false
UNION
SELECT users.id,users.email,trx.exchange FROM public.user AS users
join PUBLIC."transaction" trx ON uuid(trx.user) =users.id
WHERE users."referredBy"='${user.referralCode}' AND trx."source"='manual'`);

    const transactionsCount = {};
    const exchangesNames = {};
    transactions.forEach((trxCountObj) => {
      transactionsCount[trxCountObj.email] = trxCountObj.count;
    });
    exchanges.forEach((exchangesObj) => {
      if (exchangesObj.name) {
        if (exchangesNames[exchangesObj.email]) {
          exchangesNames[exchangesObj.email].push(exchangesObj.name);
        } else {
          exchangesNames[exchangesObj.email] = [exchangesObj.name];
        }
      }
    });

    let referrals = await this.referralRepository.find({
      where: { referrersID: user.referralCode },
    });

    return referrals.map((referral) => ({
      ...referral,
      transactionCount: transactionsCount[referral.email],
      exchanges: exchangesNames[referral.email]
        ? exchangesNames[referral.email]
        : [],
    }));
  }

  async findAllByReferralCode(code: string) {
    return await this.referralRepository.find({ where: { referrersID: code } });
  }

  async findAllByReferralCodeAndUserEmail(code: string, email: string) {
    return await this.referralRepository.findOne({
      where: { referrersID: code, email },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} referral`;
  }

  update(id: number, updateReferralDto: UpdateReferralDto) {
    return `This action updates a #${id} referral`;
  }

  async updateReferralEmailSent(email: string) {
    const referral = await this.referralRepository.findOne({
      where: { email },
    });
    if (referral) {
      referral.status = 2;
      await this.referralRepository.save(referral);
    }

    return referral ? referral : {};
  }

  async updateReferral(email: string) {
    const referral = await this.referralRepository.findOne({
      where: { email },
    });
    if (referral) {
      referral.status = 3;
      await this.referralRepository.save(referral);
    }

    return referral ? referral : {};
  }

  remove(id: number) {
    return `This action removes a #${id} referral`;
  }
}
