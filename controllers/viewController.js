exports.getOverview = (req, res, next) => {
  res.json({
    message: 'The first project-ecommerce Live project',
    author: 'Joseph Maina',
    year: '2023',
    for: 'Junior dev Qhala',
  });
};