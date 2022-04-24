
const mongoose = require('mongoose'),
  Category = mongoose.model('Categories'),
  fs = require('fs');


exports.newCategory = function (req, res, next) {
  console.log(req.files);
  console.log(req.body);
  category = new Category();
  category.name = req.body.name;
  category.icon = req.body.icon;
  category.black_picture = req.files[0].filename;
  category.white_picture = req.files[1].filename;
  category.save((err, doc) => {
    if (err) {

      if (err.code === 11000)
        return res.status(500).json({ message: "Category already exits" });
    }
    else {
      return res.status(200).send(doc);
    }
  })
}
exports.fetchAllCategories = function (req, res, next) {

  Category.find({}, function (err, doc) {

    if (err) {

      return res.status(500).json(err);
    }
    else {
      return res.status(200).send(doc);
    }
  });

}
exports.renameCategory = function (req, res) {
  Category.findOne({ _id: req.body.categoryId },
    (err, category) => {
      if (!category)
        return res.status(404).json({ status: false, message: 'Category record not found.' });
      else {
        category.name = req.body.name;
        Category.updateOne({ _id: req.body.categoryId }, category).then(
          () => {
            res.status(201).json({
              message: 'Category updated successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}

exports.changeIcon = function (req, res) {
  Category.findOne({ _id: req.body.categoryId },
    (err, category) => {
      if (!category)
        return res.status(404).json({ status: false, message: 'Category record not found.' });
      else {
        category.icon = req.body.icon;
        Category.updateOne({ _id: req.body.categoryId }, category).then(
          () => {
            res.status(201).json({
              message: 'Category updated successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}
exports.updateCategory = function (req, res) {
  Category.findOne({ _id: req.body.categoryId },
    (err, category) => {
      if (!category)
        return res.status(404).json({ status: false, message: 'Category record not found.' });
      else {
        category.icon = req.body.icon;
        category.name = req.body.name;
        Category.updateOne({ _id: req.body.categoryId }, category).then(
          () => {
            res.status(201).json({
              message: 'Category updated successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}

exports.changeBlackPicture = function (req, res, next) {

  Category.findOne({ _id: req.body.categoryId },
    (err, category) => {
      if (!category)
        return res.status(404).json({ status: false, message: 'Category record not found.' });
      else {
        fs.unlink('./public/img/' + category.black_picture, (err) => {
          if (err) {
            res.status(400).json({
              error: err
            });
          }
          else {
            category.black_picture = req.file.filename;
            Category.updateOne({ _id: req.body.categoryId }, category).then(
              () => {
                res.status(201).json({
                  message: 'Category updated successfully!'
                });
              }
            ).catch(
              (error) => {
                res.status(400).json({
                  error: error
                });
              }
            );
          }
        })

      }
    });
}
exports.changeWhitePicture = function (req, res, next) {
  Category.findOne({ _id: req.body.categoryId },
    (err, category) => {
      if (!category)
        return res.status(404).json({ status: false, message: 'Category record not found.' });
      else {
        fs.unlink('./public/img/' + category.white_picture, (err) => {
          if (err) {
            res.status(400).json({
              error: err
            });
          }
          else {
            category.white_picture = req.file.filename;
            Category.updateOne({ _id: req.body.categoryId }, category).then(
              () => {
                res.status(201).json({
                  message: 'Category updated successfully!'
                });
              }
            ).catch(
              (error) => {
                res.status(400).json({
                  error: error
                });
              }
            );
          }
        })

      }
    });
}