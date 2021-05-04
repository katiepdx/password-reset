const AWS = require('aws-sdk');

// aws config keys, etc.
const config = require('./config');

AWS.config.update({
  accessKeyId: config.aws.key,
  secretAccessKey: config.aws.secret,
  region: config.aws.ses.region
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const sendEmail = (to, subject, message, from) => {
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: message
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    ReturnPath: from ? from : config.aws.ses.from.default,
    Source: from ? from : config.aws.ses.from.default,
  };

  // send email using the params
  ses.sendEmail(params, (err, data) => {
    if (err) return console.log('ERROR: ses-client: ', err);
    console.log('Email send', data);
  });
};

module.exports = {
  sendEmail
};
