import * as Joi from 'joi';

const nameRegexp = new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/);
const usernameRegexp = new RegExp(
  /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/,
);
const contactRegexp = new RegExp(
  /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
);

export const uuidSchema = Joi.string().uuid();

export const createUserSchema = Joi.object({
  email: Joi.string().min(6).email().required(),
  password: Joi.string().min(4).max(24).required(),
  reEnterPassword: Joi.string().min(4).max(24).required(),
  // status: Joi.number().min(0).required(),
  firstName: Joi.string().min(2).max(24).regex(nameRegexp).required(),
  lastName: Joi.string().min(2).max(24).regex(nameRegexp).required(),
  username: Joi.string().min(6).regex(usernameRegexp).required(),
  contact: Joi.string().regex(contactRegexp).required(),
  role: Joi.string().min(2).max(5).required(),
  referredBy: Joi.string().allow(''),
  referralCode: Joi.string().allow(''),
});

export const updateUserSchema = Joi.object({
  // email: Joi.string().min(6).email(),
  // password: Joi.string().min(4).max(24),
  // status: Joi.number().min(0),
  firstName: Joi.string().min(2).max(24).regex(nameRegexp),
  lastName: Joi.string().min(2).max(24).regex(nameRegexp),
  // username: Joi.string().min(6).regex(usernameRegexp),
  contact: Joi.string().regex(contactRegexp),
  role: Joi.string().uuid(),
});

export const updatePasswordUserSchema = Joi.object({
  // email: Joi.string().min(6).email(),
  password: Joi.string().min(4).max(24),
  // status: Joi.number().min(0),
  // firstName: Joi.string().min(2).max(24).regex(nameRegexp),
  // lastName: Joi.string().min(2).max(24).regex(nameRegexp),
  // username: Joi.string().min(6).regex(usernameRegexp),
  // contact: Joi.string().regex(contactRegexp),
  // role: Joi.string().uuid(),
});

export const updateProfileSchema = Joi.object({
  // email: Joi.string().min(6).email(),
  // password: Joi.string().min(4).max(24),
  // status: Joi.number().min(0),
  firstName: Joi.string().min(2).max(24).regex(nameRegexp),
  lastName: Joi.string().min(2).max(24).regex(nameRegexp),
  // username: Joi.string().min(6).regex(usernameRegexp),
  contact: Joi.string().regex(contactRegexp),
});

export const updateAccountSettings = Joi.object({
  currency: Joi.object(),
  country: Joi.object(),
  timezone: Joi.object(),
  cgtcalmethod: Joi.object(),
});

export const loginSchema = Joi.object({
  email: Joi.string().min(6).email().required(),
  password: Joi.string().min(4).max(24).required(),
});

export const creatRoleSchema = Joi.object({
  name: Joi.string().min(2).max(24).required(),
  shortCode: Joi.string().min(2).max(5).required(),
  // status: Joi.number().min(0).required(),
});

export const updateRoleSchema = Joi.object({
  name: Joi.string().min(2).max(24).required(),
  shortCode: Joi.string().min(2).max(5).required(),
  // status: Joi.number().min(0).required(),
});

export const creatActionSchema = Joi.object({
  name: Joi.string().min(2).max(24).required(),
  actions: Joi.array().items(Joi.string()).required(),
});

export const createRolePermissionSchema = Joi.object({
  shortName: Joi.string().min(2).max(25).required(),
  shortCode: Joi.string().min(2).max(10).required(),
  // status: Joi.number().min(0).required(),
  roleId: Joi.string().uuid().required(),
  actionId: Joi.string().uuid().required(),
  permissionId: Joi.string().uuid().required(),
});

export const updateRolePermissionSchema = Joi.object({
  shortName: Joi.string().min(2).max(25),
  shortCode: Joi.string().min(2).max(10),
});

export const createPermissionSchema = Joi.object({
  name: Joi.string().min(2).max(25).required(),
  shortCode: Joi.string().min(2).max(10).required(),
  level: Joi.number().min(0).required(),
});

export const updatePermissionSchema = Joi.object({
  name: Joi.string().min(2).max(25),
  shortCode: Joi.string().min(2).max(10),
  level: Joi.number().min(0),
});

export const createOrderHistoryExportSchema = Joi.object({
  transactionDate: Joi.date().required(),
  orderNo: Joi.string().required(),
  pair: Joi.string().required(),
  type: Joi.string().required(),
  side: Joi.string().required(),
  orderPrice: Joi.number().required(),
  orderAmount: Joi.number().required(),
  time: Joi.date().required(),
  executed: Joi.number().required(),
  averagePrice: Joi.number().required(),
  tradingTotal: Joi.number().required(),
  status: Joi.string().required(),
});

export const updateOrderHistoryExportSchema = Joi.object({
  transactionDate: Joi.date(),
  orderNo: Joi.string(),
  pair: Joi.string(),
  type: Joi.string(),
  side: Joi.string(),
  orderPrice: Joi.number(),
  orderAmount: Joi.number(),
  time: Joi.date(),
  executed: Joi.number(),
  averagePrice: Joi.number(),
  tradingTotal: Joi.number(),
  status: Joi.string(),
});

export const createOrderHistoryImportSchema = Joi.object({
  transactionDate: Joi.date().required(),
  type: Joi.string().required(),
  market: Joi.string().required(),
  amount: Joi.number().required(),
  rateIncFee: Joi.number().required(),
  rateExcFee: Joi.number().required(),
  fee: Joi.number().required(),
  feeCurrency: Joi.string().required(),
  feeAudIncGst: Joi.number().required(),
  gstAud: Joi.number().required(),
  totalAud: Joi.number().required(),
  totalIncGst: Joi.number().required(),
  totalIncGstCurrency: Joi.string().required(),
});

export const updateOrderHistoryImportSchema = Joi.object({
  transactionDate: Joi.date(),
  type: Joi.string(),
  market: Joi.string(),
  amount: Joi.number(),
  rateIncFee: Joi.number(),
  rateExcFee: Joi.number(),
  fee: Joi.number(),
  feeCurrency: Joi.string(),
  feeAudIncGst: Joi.number(),
  gstAud: Joi.number(),
  totalAud: Joi.number(),
  totalIncGst: Joi.number(),
  totalIncGstCurrency: Joi.string(),
});
