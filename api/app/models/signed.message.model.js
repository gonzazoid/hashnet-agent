export default mongoose => {
  var schema = mongoose.Schema(
    {
      hash: String,
      label: String,
      nonce: String,
      relatedTo: String,
      publicKey: String,
      signature: String
    },
    { }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
  });

  const SignedMessage = mongoose.model("signedMessage", schema);
  return SignedMessage;
};
