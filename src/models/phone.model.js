module.exports = mongoose => {
    const Phone = mongoose.model(
      mongoose.Schema(
        {
          name: String,
          description: String,
          published: Boolean
        },
        { timestamps: true }
      )
    );
  
    return Phone;
  };