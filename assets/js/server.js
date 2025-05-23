const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

exports.sendGoalNotification = functions.database.ref('/goals/{month}')
  .onUpdate(async (change, context) => {
    const before = change.before.val();
    const after = change.after.val();
    const month = context.params.month;

    // Check if goal was achieved
    const donationsRef = admin.database().ref(`donations/${month}`);
    const donationsSnap = await donationsRef.once('value');
    const donations = donationsSnap.val() || 0;
    const childrenSponsored = Math.floor(donations / 3000); // $30 per child

    if (childrenSponsored >= after && childrenSponsored < before) {
      // Get admin emails
      const adminsSnap = await admin.database().ref('adminEmails').once('value');
      const admins = adminsSnap.val();
      
      // Send emails
      const mailOptions = {
        from: 'Dzikwa Trust <notifications@dzikwatrust.org>',
        to: admins.join(','),
        subject: `🎉 Goal Achieved for ${month}!`,
        html: `
          <h2>Congratulations!</h2>
          <p>You've reached the monthly goal of sponsoring ${after} children!</p>
          <p>Actual sponsorships: ${childrenSponsored}</p>
          <p>Total donations: $${(donations/100).toFixed(2)}</p>
          <a href="https://your-admin-site.com">View Dashboard</a>
        `
      };

      return transporter.sendMail(mailOptions);
    }
    return null;
  });