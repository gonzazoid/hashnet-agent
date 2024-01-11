import hashNetValidator from "./hashnet-validator.js";
const { param } = hashNetValidator;

const getHashValidator = [
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
];

export default getHashValidator;
