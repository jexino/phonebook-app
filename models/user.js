const mongoose=require("mongoose");
const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
      },
      phonenumber : {
        type: Number,
        trim:true,
        unique:true
      },
      email: {
        type: String,
        trim: true,
        required: true,
        unique: true
      }
    },
    { timestamps: true }
  );
  
  const User = mongoose.model("User", userSchema);
  module.exports = User;