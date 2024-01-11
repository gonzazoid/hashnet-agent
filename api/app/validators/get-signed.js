import hashNetValidator from "./hashnet-validator.js";
const { param } = hashNetValidator;

const getSignedValidator = [
  param("0") // label
    .exists()
    .notEmpty()
  ,
  param("signFunction")
    .exists()
    .notEmpty()
    .isLowercase()
    .isHashNetSupportedSignFunction()
  ,
  param("publicKey")
    .exists()
    .notEmpty()
    .isLowercase()
    .isHexadecimal()
];

export default getSignedValidator;
