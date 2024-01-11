export default mongoose => {
  var schema = mongoose.Schema(
    {
      hash: String,
      range: [Number, Number],
      files: [{
        path: String,
        length: Number,
        offset: Number,
      }]
    },
    { }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
  });

  const ChunkMessage = mongoose.model("chunkMessage", schema);
  return ChunkMessage;
};
