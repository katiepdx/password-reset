module.exports = {
  'aws': {
    'key': process.env.AWS_ACCESS_KEY,
    'secret': process.env.AWS_ACCESS_SECRET,
    'ses': {
      'from': {
        'default': process.env.AWS_FROM_EMAIL,
      },
      'region': process.env.AWS_ACCESS_REGION
    }
  }
};
