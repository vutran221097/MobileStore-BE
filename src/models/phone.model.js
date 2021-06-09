module.exports = mongoose => {
  const Phone = mongoose.model(
    "Phone",
    mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      image:String,
      category: {
        type: String,
        required: true,
      },
      description: String,
      guarantee: {
        type: Number,
        required: true,
      },
      details: String,
      color: String,
      price: {
        type: Number,
        required: true,
      },
      available: String,
    }, {
      timestamps: true
    })
  );

  return Phone;
};