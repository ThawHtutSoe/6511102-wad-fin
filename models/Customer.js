import mongoose from 'mongoose';

// Define the customer schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  memberNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
  },
  interests: {
    type: String,
    required: true,
  }
});

// Check if the model already exists before defining it again
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer;
