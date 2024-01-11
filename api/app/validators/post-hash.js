import hashNetValidator from "./hashnet-validator.js";
const { body, param } = hashNetValidator;

const postHashValidator = [
  param("hashFunction")
    .exists()
    .notEmpty()
    .isLowercase()
    .isHashNetSupportedHashFunction()
    .bail()
  ,
  param("hashValue")
    .exists()
    .notEmpty()
    .isLowercase()
    .if(param("hashFunction").custom(hashFunction => param("hashValue").isHash(hashFunction)))
    .bail()
  ,
  body()
    .exists()
    .notEmpty()
    .custom(file => Buffer.isBuffer(file))
    .bail()
];

export default postHashValidator;
