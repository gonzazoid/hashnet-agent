import hashNetValidator from "./hashnet-validator.js";

const { buildCheckFunction, body, param } = hashNetValidator;
const auxiliaryParam = buildCheckFunction(["auxiliaryParams"]);

const postSignedValidator = [
  (req, res, next) => {
    console.log("REQUEST!!!", req.body);
    req.auxiliaryParams = { message: {}};
    next();
  },
  body()
    .exists()
    .notEmpty()
  ,
  body("hash")
    .exists()
    .isString()
    .notEmpty()
    .bail()
    .isLowercase()
    .custom((hash, { req }) => {
      const chunks = hash.split(":");
      if (chunks.length !== 2) return false;
      req.auxiliaryParams.message.hashFunction = chunks[0];
      req.auxiliaryParams.message.hashValue = chunks[1];
      return true;
    })
  ,
    auxiliaryParam("message.hashFunction")
      .exists()
      .notEmpty()
      .isLowercase()
      .isHashNetSupportedHashFunction()
      .bail()
    ,
    auxiliaryParam("message.hashValue")
      .exists()
      .notEmpty()
      .isLowercase()
      .if(auxiliaryParam("message.hashFunction").custom(hashFunction => auxiliaryParam("message.hashValue").isHash(hashFunction)))
      .bail()
    ,
  body("label")
    .exists()
    .isString()
    .notEmpty()
  ,
  body("nonce")
    .exists()
    .isString()
    .notEmpty()
    .isDecimal()
  ,
  body("publicKey")
    .exists()
    .isString()
    .notEmpty()
    .custom((publicKey, { req }) => {
      const chunks = publicKey.split(":");
      if (chunks.length !== 2) return false;
      req.auxiliaryParams.message.signFunction = chunks[0];
      req.auxiliaryParams.message.publicKeyValue = chunks[1];
      return true;
    })
    .bail()
  ,
    auxiliaryParam("message.signFunction")
      .exists()
      .notEmpty()
      .isLowercase()
      .isHashNetSupportedSignFunction()
      .bail()
    ,
    auxiliaryParam("message.publicKeyValue")
      .exists()
      .notEmpty()
      .isLowercase()
      .isHexadecimal()
      .bail()
    ,
  body("relatedTo")
    .optional()
    .isString()
    .notEmpty()
    .bail()
  ,
  body("signature")
    .exists()
    .isString()
    .notEmpty()
    .isLowercase()
    .isHexadecimal()
    .bail()
  ,
  param("urlSignFunction")
    .exists()
    .notEmpty()
    .custom(urlSignFunction => auxiliaryParam("message.signFunction").equals(urlSignFunction))
    .bail()
  ,
  param("urlPublicKey")
    .exists()
    .notEmpty()
    .custom(urlPublicKey => auxiliaryParam("message.publicKeyValue").equals(urlPublicKey))
    .bail()
];

export default postSignedValidator;
