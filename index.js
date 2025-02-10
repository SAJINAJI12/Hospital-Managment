const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const url = process.env.DB_URL ;
const client = new MongoClient(url);
const dbName = process.env.DB_NAME ;

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

async function startServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const patientCollection = db.collection('patient');
        const doctorCollection = db.collection('doctor');

        // Patient Routes
        app.get('/api/patients', async (req, res) => {
            try {
                const patients = await patientCollection.find().toArray();
                res.json(patients);
            } catch (err) {
                res.status(500).json({ message: "Error fetching patients", error: err });
            }
        });

        app.post('/api/patients', async (req, res) => {
            try {
                const newPatient = req.body;
                const result = await patientCollection.insertOne(newPatient);
                res.status(201).json({ message: "Patient added successfully", patientId: result.insertedId });
            } catch (err) {
                res.status(500).json({ message: "Error adding patient", error: err });
            }
        });

        app.delete('/api/patients/:id', async (req, res) => {
            try {
                const patientId = req.params.id;
                const result = await patientCollection.deleteOne({ _id: new ObjectId(patientId) });

                if (result.deletedCount === 1) {
                    res.status(200).json({ message: "Patient deleted successfully" });
                } else {
                    res.status(404).json({ message: "Patient not found" });
                }
            } catch (err) {
                res.status(500).json({ message: "Error deleting patient", error: err });
            }
        });

        app.put('/api/patients/:id', async (req, res) => {
            try {
                const patientId = req.params.id;

                if (!ObjectId.isValid(patientId)) {
                    return res.status(400).json({ message: "Invalid ID format" });
                }

                const updatedPatient = req.body;
                delete updatedPatient._id;

                const result = await patientCollection.updateOne(
                    { _id: new ObjectId(patientId) },
                    { $set: updatedPatient }
                );

                if (result.matchedCount === 1) {
                    res.status(200).json({ message: "Patient updated successfully" });
                } else {
                    res.status(404).json({ message: "Patient not found" });
                }
            } catch (err) {
                res.status(500).json({ message: "Error updating patient", error: err });
            }
        });

        // Doctor Routes
        app.get('/api/doctors', async (req, res) => {
            try {
                const doctors = await doctorCollection.find().toArray();
                res.json(doctors);
            } catch (err) {
                res.status(500).json({ message: "Error fetching doctors", error: err });
            }
        });

        app.post('/api/doctors', async (req, res) => {
            try {
                const newDoctor = req.body;
                const result = await doctorCollection.insertOne(newDoctor);
                res.status(201).json({ message: "Doctor added successfully", doctorId: result.insertedId });
            } catch (err) {
                res.status(500).json({ message: "Error adding doctor", error: err });
            }
        });

        app.delete('/api/doctors/:id', async (req, res) => {
            try {
                const doctorId = req.params.id;
                const result = await doctorCollection.deleteOne({ _id: new ObjectId(doctorId) });

                if (result.deletedCount === 1) {
                    res.status(200).json({ message: "Doctor deleted successfully" });
                } else {
                    res.status(404).json({ message: "Doctor not found" });
                }
            } catch (err) {
                res.status(500).json({ message: "Error deleting doctor", error: err });
            }
        });

        app.put('/api/doctors/:id', async (req, res) => {
            try {
                const doctorId = req.params.id;

                if (!ObjectId.isValid(doctorId)) {
                    return res.status(400).json({ message: "Invalid ID format" });
                }

                const updatedDoctor = req.body;
                delete updatedDoctor._id;

                const result = await doctorCollection.updateOne(
                    { _id: new ObjectId(doctorId) },
                    { $set: updatedDoctor }
                );

                if (result.matchedCount === 1) {
                    res.status(200).json({ message: "Doctor updated successfully" });
                } else {
                    res.status(404).json({ message: "Doctor not found" });
                }
            } catch (err) {
                res.status(500).json({ message: "Error updating doctor", error: err.message });
            }
        });


        // Appointment Routes
        app.get('/api/appointments', async (req, res) => {
            try {
                const appointmentCollection = db.collection('appointments');
                const appointments = await appointmentCollection.find().toArray();
                res.json(appointments);
            } catch (err) {
                res.status(500).json({ message: "Error fetching appointments", error: err });
            }
        });

        app.post('/api/appointments', async (req, res) => {
            try {
                const newAppointment = req.body;
                const appointmentCollection = db.collection('appointments');
                const result = await appointmentCollection.insertOne(newAppointment);
                res.status(201).json({ message: "Appointment booked successfully", appointmentId: result.insertedId });
            } catch (err) {
                res.status(500).json({ message: "Error booking appointment", error: err });
            }
        });

        app.delete('/api/appointments/:id', async (req, res) => {
            try {
                const appointmentId = req.params.id;
                const appointmentCollection = db.collection('appointments');
                const result = await appointmentCollection.deleteOne({ _id: new ObjectId(appointmentId) });
        
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: "Appointment deleted successfully" });
                } else {
                    res.status(404).json({ message: "Appointment not found" });
                }
            } catch (err) {
                res.status(500).json({ message: "Error deleting appointment", error: err });
            }
        });

        app.put('/api/appointments/:id', async (req, res) => {
            try {
                const appointmentId = req.params.id;
        
                if (!ObjectId.isValid(appointmentId)) {
                    return res.status(400).json({ message: "Invalid Appointment ID format" });
                }
        
                const updatedAppointment = req.body;
                delete updatedAppointment._id; 
        
                const appointmentCollection = db.collection('appointments');
                
                const result = await appointmentCollection.updateOne(
                    { _id: new ObjectId(appointmentId) },
                    { $set: updatedAppointment }
                );
        
                if (result.matchedCount === 1) {
                    res.status(200).json({ message: "Appointment updated successfully" });
                } else {
                    res.status(404).json({ message: "Appointment not found" });
                }
            }catch (err) {
                res.status(500).json({ message: "Error updating appointment", error: err });
            }
        });
        

        // Start Server
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });

    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

startServer();

