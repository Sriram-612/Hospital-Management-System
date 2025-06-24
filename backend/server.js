const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/MITDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Error connecting to MongoDB:", err));

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Book appointment route
/*app.post('/api/book-appointment', async (req, res) => {
  const { userId, doctorName, patientName, date, time, medicalHistory } = req.body;

  if (!userId || !doctorName || !patientName || !date || !time) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAppointment = new Appointment({
      userId,
      doctorName,
      patientName,
      date,
      time,
      medicalHistory,
      status: 'Confirmed'
    });

    await newAppointment.save();
    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
});
*/
app.post('/api/upload-local-appointments', async (req, res) => {
    const { doctorName, appointments } = req.body;
  
    if (!doctorName || !appointments || !Array.isArray(appointments)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }
  
    try {
      const docs = appointments.map(appt => ({
        ...appt,
        doctorName,
        status: 'Confirmed'
      }));
  
      await Appointment.insertMany(docs);
      res.status(200).json({ message: 'Appointments uploaded successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading appointments', error: error.message });
    }
  });
  const uploadAppointmentsToDB = async () => {
    const data = {
      doctorName,
      appointments
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/upload-local-appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Appointments uploaded to database successfully');
      } else {
        alert(`Upload failed: ${result.message}`);
      }
    } catch (err) {
      alert('Error uploading appointments: ' + err.message);
    }
  };

// Fetch appointments
app.get('/api/get-appointments/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
