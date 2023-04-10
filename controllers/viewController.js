exports.getOverview = (req, res, next) => {
  res.json({
    message: 'The first project-ecommerce',
    author: 'Joseph Maina',
    year: '2023',
    for: 'Junior dev Qhala',
  });
};