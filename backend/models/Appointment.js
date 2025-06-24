const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: String,
  doctorName: String,
  patientName: String,
  date: String,
  time: String,
  medicalHistory: {type: String, required: false},
  medicalHistoryFile: {type: String,required: false},
  status: {
    type: String,
    default: 'Confirmed',
  }
}, { collection: 'appointment-doctor' }); // Specify collection name here

module.exports = mongoose.model('Appointment', appointmentSchema);