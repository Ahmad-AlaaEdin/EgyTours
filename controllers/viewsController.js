exports.getOverview = (req, res) => {
  res.status(200).render('base', {
    title: 'All Tours',
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('base');
};
