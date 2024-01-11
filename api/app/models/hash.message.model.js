export default mongoose => {
  var schema = mongoose.Schema(
    {
      hash: String,
      file: Buffer,
    },
    { }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
  });

  const HashMessage = mongoose.model("hashMessage", schema);
  return HashMessage;
};
