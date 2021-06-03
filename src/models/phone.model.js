module.exports = mongoose => {
  const Phone = mongoose.model(
    "Phone",
    mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
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
      available: Boolean,
    }, {
      timestamps: true
    })
  );

  return Phone;
};