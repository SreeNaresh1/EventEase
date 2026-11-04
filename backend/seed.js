/**
 * EventEase - Database Seeder
 * Creates admin account + sample events
 * Run: node seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventease.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Admin created: admin@eventease.com / admin123');

    // Create sample student
    const student = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@student.edu',
      password: 'student123',
      role: 'student',
      department: 'CSE',
      year: '3rd Year',
    });
    console.log('👤 Student created: rahul@student.edu / student123');

    const now = new Date();
    const future = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // Create sample events
    const events = await Event.insertMany([
      {
        title: 'National Level Hackathon 2024',
        description:
          'Join us for a 24-hour hackathon where students solve real-world problems using cutting-edge technology. Teams of 2-4 members. Exciting prizes and internship opportunities await!',
        category: 'Hackathon',
        date: future(10),
        startTime: '09:00',
        endTime: '09:00',
        venue: 'Innovation Lab, Block A',
        eligibility: '2nd, 3rd & 4th Year Students',
        maxParticipants: 80,
        registeredCount: 34,
        registrationDeadline: future(7),
        organizer: 'IEEE Student Chapter',
        prize: '₹15,000 Cash Prize + Internship Offer',
        createdBy: admin._id,
      },
      {
        title: 'Web Development Workshop',
        description:
          'A hands-on workshop covering modern web development with React, Node.js and MongoDB. Learn to build full-stack applications from scratch. Laptops required.',
        category: 'Workshop',
        date: future(5),
        startTime: '10:00',
        endTime: '16:00',
        venue: 'Computer Lab 3, Block B',
        eligibility: 'All Years',
        maxParticipants: 50,
        registeredCount: 42,
        registrationDeadline: future(3),
        organizer: 'CSE Department',
        prize: 'Certificate of Participation',
        createdBy: admin._id,
      },
      {
        title: 'Techno Symposium 2024',
        description:
          'Annual technical symposium featuring paper presentations, project expo, coding contest and technical quiz. Showcase your projects to industry experts and win exciting prizes.',
        category: 'Technical',
        date: future(15),
        startTime: '09:30',
        endTime: '17:30',
        venue: 'Auditorium',
        eligibility: 'All Students',
        maxParticipants: 200,
        registeredCount: 87,
        registrationDeadline: future(12),
        organizer: 'Technical Events Committee',
        prize: 'Trophies + ₹20,000 Prize Pool',
        createdBy: admin._id,
      },
      {
        title: 'Cultural Fest – Kaleidoscope',
        description:
          'The biggest cultural extravaganza of the year! Dance, music, drama, fashion show and many more events. Come and showcase your talent on the biggest stage.',
        category: 'Cultural',
        date: future(20),
        startTime: '11:00',
        endTime: '20:00',
        venue: 'Open Air Theatre',
        eligibility: 'All Students',
        maxParticipants: 500,
        registeredCount: 230,
        registrationDeadline: future(17),
        organizer: 'Cultural Events Club',
        prize: 'Trophies + Certificates',
        createdBy: admin._id,
      },
      {
        title: 'Inter-Department Cricket Tournament',
        description:
          'Annual cricket tournament between all departments. Each department can field one team of 11 players. Knockout format with finals on the last day.',
        category: 'Sports',
        date: future(8),
        startTime: '07:00',
        endTime: '18:00',
        venue: 'College Cricket Ground',
        eligibility: 'All Students (One team per department)',
        maxParticipants: 120,
        registeredCount: 55,
        registrationDeadline: future(5),
        organizer: 'Sports Council',
        prize: 'Rolling Trophy + Medals',
        createdBy: admin._id,
      },
      {
        title: 'Machine Learning Bootcamp',
        description:
          'Intensive 2-day bootcamp on Machine Learning fundamentals to advanced applications. Covers Python, NumPy, Pandas, Scikit-learn and TensorFlow. Bring your laptops!',
        category: 'Workshop',
        date: future(12),
        startTime: '09:00',
        endTime: '18:00',
        venue: 'Seminar Hall B, Block C',
        eligibility: '3rd & 4th Year CSE/IT students',
        maxParticipants: 60,
        registeredCount: 60,
        registrationDeadline: future(10),
        organizer: 'AI & ML Club',
        prize: 'Certificate + Project Recognition',
        createdBy: admin._id,
      },
      {
        title: 'Entrepreneurship Summit',
        description:
          'Connect with successful entrepreneurs and startup founders. Panel discussions, pitch competitions, and networking sessions. Get your startup idea funded!',
        category: 'Technical',
        date: future(25),
        startTime: '10:00',
        endTime: '17:00',
        venue: 'Conference Hall, Admin Block',
        eligibility: 'All Students',
        maxParticipants: 150,
        registeredCount: 40,
        registrationDeadline: future(22),
        organizer: 'E-Cell',
        prize: 'Seed Funding for Best Pitch',
        createdBy: admin._id,
        eventType: 'Internal',
      },
      {
        title: 'Smart India Hackathon (SIH) 2024',
        description:
          'World’s biggest open innovation model. Compete across 50+ problem statements provided by Central Ministries and industry leaders. Register via the official national portal.',
        category: 'Hackathon',
        date: future(30),
        startTime: '08:00',
        endTime: '20:00',
        venue: 'Multiple Nodal Centers (Pan-India)',
        eligibility: 'All Engineering & Tech Students',
        maxParticipants: 10000,
        registeredCount: 156,
        registrationDeadline: future(20),
        organizer: 'Ministry of Education & AICTE',
        prize: '₹1,00,000 per Problem Statement',
        eventType: 'External',
        registrationLink: 'https://www.sih.gov.in',
        createdBy: admin._id,
      },
      {
        title: 'Google Solution Challenge 2024',
        description:
          'Build solutions for one or more of the United Nations 17 Sustainable Development Goals using Google technologies. Top 10 finalists receive cash prizes and mentoring from Google engineers.',
        category: 'Technical',
        date: future(40),
        startTime: '10:00',
        endTime: '18:00',
        venue: 'Virtual / Online Global Event',
        eligibility: 'Open to all university students',
        maxParticipants: 5000,
        registeredCount: 89,
        registrationDeadline: future(25),
        organizer: 'Google Developer Student Clubs',
        prize: '$3,000 per team member + Google Mentorship',
        eventType: 'External',
        registrationLink: 'https://developers.google.com/community/gdsc-solution-challenge',
        createdBy: admin._id,
      },
    ]);

    console.log(`📅 ${events.length} events created`);
    console.log('\n🎉 Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 Login Credentials:');
    console.log('   Admin    → admin@eventease.com    / admin123');
    console.log('   Student  → rahul@student.edu      / student123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err.message);
    process.exit(1);
  }
};

seedData();

