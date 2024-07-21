const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

const corsOptions = {
    origin: 'https://accredian-front-end-pi.vercel.app/', // Replace with your frontend URL
    optionsSuccessStatus: 200 // For legacy browser support
  };
  
  app.use(cors(corsOptions)); // Add this line
  app.use(bodyParser.json());

app.use(bodyParser.json());



// Endpoint to handle referral form submission
app.post('/api/referrals', async (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

  // Validate required fields
  if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
      },
    });


    try{
        await sendReferralEmail(referrerEmail,refereeEmail);

    }catch(emailError){
        return res.status(500).json({error: 'Referral created but email sending failed.'});
    }

    // Send referral email
    // sendReferralEmail(referrerEmail, refereeEmail);

    res.status(201).json(referral);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});





// Function to send referral email
const sendReferralEmail = async (referrerEmail, refereeEmail) => {
    try {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: refereeEmail,
    subject: 'You have been referred!',
    text: `You have been referred by ${referrerEmail}`,
  };

    await transporter.sendMail(mailOptions);
      console.log('Email sent succesfully');
    } catch(error) {
      console.error('Error sending email', error);
      throw new Error('Email sending failed');
    }
  };






// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
