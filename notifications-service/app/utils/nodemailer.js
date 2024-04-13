const handlebars = require('handlebars');
const { EMAIL_ID, SENDGRID_API_KEY } = require('../../config/env');
const logger = require('log4js').getLogger('nodemailer');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const MAIL_SETTINGS = {
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: SENDGRID_API_KEY,
  },
};
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

const today = new Date();
const year = today.getFullYear();
const month = ('0' + (today.getMonth() + 1)).slice(-2);
const day = ('0' + today.getDate()).slice(-2);
const currentDate = `${year}/${month}/${day}`;

const sendMailWithTemplate = async (params) => {
  try {
    let htmlTemplate = '';
    let subject = '';
    switch (params.purpose) {
      case 'Signup':
        const suPath = path.join(__dirname, '../views/register.html');
        htmlTemplate = fs.readFileSync(suPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{OTP}}', params.OTP);
        htmlTemplate = htmlTemplate.replace('{{email}}', params.to);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Confirm your account registration with OTP';
        break;
      case 'Register':
        const registerPath = path.join(__dirname, '../views/register.html');
        htmlTemplate = fs.readFileSync(registerPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{OTP}}', params.OTP);
        htmlTemplate = htmlTemplate.replace('{{email}}', params.to);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Confirm your account registration with OTP';
        break;
      case 'Totp':
        const totpPath = path.join(__dirname, '../views/totp.html');
        htmlTemplate = fs.readFileSync(totpPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{OTP}}', params.OTP);
        htmlTemplate = htmlTemplate.replace('{{email}}', params.to);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Confirm your google authenticator with OTP';
        break;
      case 'Forgot':
        const forgotPath = path.join(__dirname, '../views/forgot.html');
        htmlTemplate = fs.readFileSync(forgotPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{OTP}}', params.OTP);
        htmlTemplate = htmlTemplate.replace('{{email}}', params.to);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Reset your password with OTP';
        break;
      case 'Mobile':
        const mobilePath = path.join(__dirname, '../views/mobile.html');
        htmlTemplate = fs.readFileSync(mobilePath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{OTP}}', params.OTP);
        htmlTemplate = htmlTemplate.replace('{{email}}', params.to);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Confirm your contact number with OTP';
        break;
      case 'newOrder':
        const noPath = path.join(__dirname, '../views/newOrder.html');
        htmlTemplate = fs.readFileSync(noPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{time}}', params.time);
        htmlTemplate = htmlTemplate.replace('{{amount}}', params.amount);
        htmlTemplate = htmlTemplate.replace(
          '{{order_type}}',
          params.order_type
        );
        htmlTemplate = htmlTemplate.replace(
          '{{order_side}}',
          params.order_side
        );
        htmlTemplate = htmlTemplate.replace('{{orderId}}', params.orderId);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Order placed';
        break;
      case 'cancelOrder':
        const coPath = path.join(__dirname, '../views/cancelOrder.html');
        htmlTemplate = fs.readFileSync(coPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{time}}', params.time);
        htmlTemplate = htmlTemplate.replace('{{orderId}}', params.orderId);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Order cancelled';
        break;
      case 'confirmedOrder':
        const confPath = path.join(__dirname, '../views/confirmedOrder.html');
        htmlTemplate = fs.readFileSync(confPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{time}}', params.time);
        htmlTemplate = htmlTemplate.replace('{{amount}}', params.amount);
        htmlTemplate = htmlTemplate.replace(
          '{{order_type}}',
          params.order_type
        );
        htmlTemplate = htmlTemplate.replace(
          '{{order_side}}',
          params.order_side
        );
        htmlTemplate = htmlTemplate.replace('{{orderId}}', params.orderId);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Order confirmed';
        break;
      case 'wOtp':
        const woPath = path.join(__dirname, '../views/wOtp.html');
        htmlTemplate = fs.readFileSync(woPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{OTP}}', params.OTP);
        htmlTemplate = htmlTemplate.replace('{{email}}', params.to);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Confirm your withdrawal with OTP';
        break;
      case 'withdrawConfirmed':
        const wcPath = path.join(__dirname, '../views/withdrawConfirmed.html');
        htmlTemplate = fs.readFileSync(wcPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{time}}', params.time);
        htmlTemplate = htmlTemplate.replace('{{amount}}', params.amount);
        htmlTemplate = htmlTemplate.replace('{{dest_add}}', params.dest_add);
        htmlTemplate = htmlTemplate.replace('{{txid}}', params.txid);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Withdrawal confirmed';
        break;
      case 'withdrawFailed':
        const wfPath = path.join(__dirname, '../views/withdrawFailed.html');
        htmlTemplate = fs.readFileSync(wfPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{time}}', params.time);
        htmlTemplate = htmlTemplate.replace('{{amount}}', params.amount);
        htmlTemplate = htmlTemplate.replace('{{dest_add}}', params.dest_add);
        htmlTemplate = htmlTemplate.replace('{{txid}}', params.txid);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Withdrawal failed';
        break;
      case 'despositConfimed':
        const dcPath = path.join(__dirname, '../views/despositConfimed.html');
        htmlTemplate = fs.readFileSync(dcPath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{time}}', params.time);
        htmlTemplate = htmlTemplate.replace('{{amount}}', params.amount);
        htmlTemplate = htmlTemplate.replace('{{dest_add}}', params.dest_add);
        htmlTemplate = htmlTemplate.replace('{{txid}}', params.txid);
        htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
        subject = 'Desposit confimed';
        break;
      default:
        logger.error('Invalid email purpose');
    }

    let info = await transporter.sendMail({
      from: EMAIL_ID,
      to: params.to,
      subject,
      html: htmlTemplate,
    });
    return info;
  } catch (error) {
    logger.error(' ❌ Error in sending email >> %O', error);
    return false;
  }
};

const sendMailWithArray = async (params) => {
  try {
    const _path = path.join(__dirname, '../views/dynamic.html');
    let htmlTemplate = fs.readFileSync(_path, 'utf8');
    htmlTemplate = htmlTemplate.replace('{{currentDate}}', currentDate);
    const template = handlebars.compile(htmlTemplate);

    let info = await transporter.sendMail({
      from: EMAIL_ID,
      to: params.to,
      subject: 'Orders cancelled',
      html: template({ orders: params.data.data }),
    });
    return info;
  } catch (error) {
    logger.error(' ❌ Error in sending email >> %O', error);
    return false;
  }
};

module.exports = { sendMailWithTemplate, sendMailWithArray };
