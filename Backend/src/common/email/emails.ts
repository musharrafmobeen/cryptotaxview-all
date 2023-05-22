import { array } from 'joi';
import * as nodemailer from 'nodemailer';
import { makeid as randomString } from './randomString';

export const sendEmailConfirmation = async (email, subject, text) => {
  var transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  var mailOptions = {
    from: 'TechGenix',
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export const emailVerification = async (
  firstName,
  LastName,
  email,
  invitationToken,
  userID,
  referrersName,
  referrersEmail,
) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  let stringVerificationId = randomString(100);

  var mailOptions = {
    from: 'TechGenix',
    to: email,
    subject: 'Email Verification',
    html: `<h2>${firstName} ${LastName}</h2>
    <p>Click Here To Verify Email <a href="${process.env.EMAIL_VERIFICATION_LINK}${firstName}/${LastName}/${email}/${invitationToken}/${userID}/${referrersName}/${referrersEmail}"> ${stringVerificationId} </a></p>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export const emailUpdatePassword = async (email) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  let stringVerificationId = randomString(100);

  var mailOptions = {
    from: 'Ineffable',
    to: email,
    subject: 'Email Verification',
    html: `<p>Click Here To Update Password <a href="http://192.168.18.42:5000/forgotPassword/${email}"> ${stringVerificationId} </a></p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export const sendEmail = async (name, subject, text) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  var mailOptions = {
    from: name,
    to: [
      'a.syed@techgenix.com.pk',
      'o.usman@techgenix.com.pk',
      'umer27@gmail.com',
    ],
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
