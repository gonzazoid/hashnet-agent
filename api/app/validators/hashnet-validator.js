import { ExpressValidator } from 'express-validator';

const isHashNetSupportedHashFunction = hashFunction => ["sha1", "sha256", "sha384", "sha512"].includes(hashFunction);
const isHashNetSupportedSignFunction = signFunction => {
  const chunks = signFunction.split(".");
  if (chunks.length !== 2) return false;
  return (
    ["secp256k1", "secp256r1"].includes(chunks[0]) &&
    isHashNetSupportedHashFunction(chunks[1])
  );
};

const hashnetValidator = new ExpressValidator(
  {
    isHashNetSupportedHashFunction,
    isHashNetSupportedSignFunction
  }
);

export default hashnetValidator
