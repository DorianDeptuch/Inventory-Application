var Breed = require("../models/breed");
var Dog = require("../models/dog");

var async = require("async");

const { body, validationResult } = require("express-validator");

// Display list of all breeds
exports.breed_list = function (req, res, next) {
  Breed.find()
    // .populate()
    .exec(function (err, list_breeds) {
      if (err) {
        return next(err);
      }
      res.render("breed_list", {
        title: "List of Breeds",
        error: err,
        breed_list: list_breeds,
      });
    });
};

exports.breed_detail = function (req, res, next) {
  async.parallel(
    {
      breed: function (callback) {
        Breed.findById(req.params.id).exec(callback);
      },
      breed_dogs: function (callback) {
        Dog.find({ breed: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.breed == null) {
        var err = new Error("Breed not found");
        res.error = 404;
        return next(err);
      }
      res.render("breed_detail", {
        title: results.breed.name,
        breed: results.breed,
        breed_dogs: results.breed_dogs,
      });
    }
  );
};

exports.breed_create_get = function (req, res, next) {
  res.render("breed_form", { title: "Create a Breed", errors: false });
};

exports.breed_create_post = [
  body("name", "Breed name required").trim().isLength({ min: 1 }).escape(),
  body("size", "Breed size required").trim().isLength({ min: 1 }).escape(),
  body("description", "Breed description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var breed = new Breed({
      name: req.body.name,
      size: req.body.size,
      description: req.body.description,
      photoURL: req.body.photoURL,
    });

    if (!errors.isEmpty()) {
      res.render("breed_form", {
        title: "Create a Breed",
        breed,
        errors: errors.array(),
      });
      return;
    } else {
      Breed.findOne({ name: req.body.name }).exec(function (err, found_breed) {
        if (err) {
          return next(err);
        }

        if (found_breed) {
          res.redirect(found_breed.url);
        } else {
          breed.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(breed.url);
          });
        }
      });
    }
  },
];

exports.breed_delete_get = function (req, res, next) {
  async.parallel(
    {
      breed: function (callback) {
        Breed.findById(req.params.id).exec(callback);
      },
      breed_dogs: function (callback) {
        Dog.find({ breed: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.breed == null) {
        res.redirect("/catalog/breeds");
      }
      res.render("breed_delete", {
        title: "Delete Breed",
        breed: results.breed,
        breed_dogs: results.breed_dogs,
      });
    }
  );
};

exports.breed_delete_post = function (req, res, next) {
  async.parallel(
    {
      breed: function (callback) {
        Breed.findById(req.params.breedid).exec(callback);
      },
      breed_dogs: function (callback) {
        Dog.find({ breed: req.params.breedid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.breed_dogs.length > 0) {
        res.render("breed_delete", {
          title: "Delete Breed",
          breed: results.breed,
          breed_dogs: results.breed_dogs,
        });
        return;
      } else {
        Breed.findByIdAndRemove(req.body.breedid, function deleteBreed(err) {
          if (err) {
            return next(err);
          }
          res.redirect("/catalog/breeds");
        });
      }
    }
  );
};

exports.breed_update_get = function (req, res, next) {
  async.parallel(
    {
      breed: function (callback) {
        Breed.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.breed == null) {
        var err = new Error("Breed not found");
        err.status = 404;
        return next(err);
      }
      res.render("breed_form", {
        title: "Update Breed",
        breed: results.breed,
        errors: false,
      });
    }
  );
};

exports.breed_update_post = [
  body("name", "Breed name required").trim().isLength({ min: 1 }).escape(),
  body("size", "Breed size required").trim().isLength({ min: 1 }).escape(),
  body("description", "Breed description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var breed = new Breed({
      name: req.body.name,
      size: req.body.size,
      description: req.body.description,
      photoURL: req.body.photoURL,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("breed_form", {
        title: "Update Breed",
        breed,
        errors: errors.array(),
      });
      return;
    } else {
      Breed.findByIdAndUpdate(
        req.params.id,
        breed,
        {},
        function (err, thebreed) {
          if (err) {
            return next(err);
          }
          res.redirect(thebreed.url);
        }
      );
    }
  },
];
