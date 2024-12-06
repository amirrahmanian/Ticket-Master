import * as Joi from 'joi';

export default Joi.object({
  DATABASE_NAME: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().required(),
  DATABASE_AUTO_LOAD_ENTITY: Joi.boolean().required(),
  ZIBAL_MERCHANT_ID: Joi.string().required(),
  ZIBAL_REQUEST_URL: Joi.string().required(),
  ZIBAL_VERIFY_URL: Joi.string().required(),
  ZIBAL_CALL_BACK_URL: Joi.string().required(),
  ZIBAL_PAYMENT_URL: Joi.string().required(),
  ZIBAL_REFUND_URL: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required(),
});
