var Breeder = require("../models/breeder");
var Dog = require("../models/dog");
var Location = require("../models/location");
// var defaultBreederPhoto = require("../public/images/silhouette-dog-breeder.jpg");

var async = require("async");

const { body, validationResult } = require("express-validator");

// Display list of all breeders
exports.breeder_list = function (req, res, next) {
  Breeder.find()
    // .populate('dogs') implement dogs into breeder schema
    .exec(function (err, list_breeders) {
      if (err) {
        return next(err);
      }
      res.render("breeder_list", {
        title: "List of Breeders",
        breeder_list: list_breeders,
      });
    });
};

exports.breeder_detail = function (req, res) {
  async.parallel(
    {
      breeder: function (callback) {
        Breeder.findById(req.params.id).populate("location").exec(callback);
      },
      breeder_dogs: function (callback) {
        Dog.find({ breeder: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.breeder == null) {
        var err = new Error("Breeder not found");
        err.status = 404;
        return next(err);
      }
      res.render("breeder_detail", {
        title: results.breeder.name,
        breeder: results.breeder,
        breeder_dogs: results.breeder_dogs,
      });
    }
  );
};

exports.breeder_create_get = function (req, res, next) {
  async.parallel(
    {
      locations: function (callback) {
        Location.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("breeder_form", {
        title: "Create a Breeder",
        locations: results.locations,
        errors: false,
      });
    }
  );
};

exports.breeder_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Name contains non-alphabet characters."),
  body("established", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("location").trim().isLength({ min: 1 }).escape(),
  body("specialty").trim().isLength({ min: 1 }).escape(),
  body("description").trim().isLength({ min: 1 }).escape(),
  // body("photoURL", "Invalid File")
  //   .trim()
  //   .isLength({ min: 1 })
  //   // .escape()
  //   .optional({ checkFalsy: true }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (req.body.photoURL == "") {
      req.body.photoURL = "https://imgur.com/GEfMuTp.jpg";
    }

    var breeder = new Breeder({
      name: req.body.name,
      established: req.body.established,
      location: req.body.location,
      specialty: req.body.specialty,
      description: req.body.description,
      photoURL: req.body.photoURL,
    });

    if (!errors.isEmpty()) {
      // console.log(res.status(400).json({ errors: errors.array() }));
      res.render("breeder_form", {
        title: "Create a Breeder",
        breeder,
        errors: errors.array(),
      });
      return;
    } else {
      Breeder.findOne({ name: req.body.name }).exec(function (
        err,
        found_breeder
      ) {
        if (err) {
          return next(err);
        }

        if (found_breeder) {
          res.redirect(found_breeder.url);
        } else {
          breeder.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(breeder.url);
          });
        }
      });
    }
  },
];

exports.breeder_delete_get = function (req, res, next) {
  async.parallel(
    {
      breeder: function (callback) {
        Breeder.findById(req.params.id).exec(callback);
      },
      breeder_dogs: function (callback) {
        Dog.find({ breeder: req.params.id }).exec(callback);
      },
      // breeder_locations: function (callback) {
      //   Location.find({ breeder: req.params.id }).exec(callback);
      // },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.breeder == null) {
        res.redirect("/catalog/breeders");
      }
      res.render("breeder_delete", {
        title: "Delete Breeder",
        breeder: results.breeder,
        breeder_dogs: results.breeder_dogs,
        // breeder_locations: results.breeder_locations,
      });
    }
  );
};

exports.breeder_delete_post = function (req, res, next) {
  async.parallel(
    {
      breeder: function (callback) {
        Breeder.findById(req.body.breederid).exec(callback);
      },
      breeder_dogs: function (callback) {
        Dog.find({ breeder: req.body.breederid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.breeder_dogs.length > 0) {
        res.render("breeder_delete", {
          title: "Delete Breeder",
          breeder: results.breeder,
          breeder_dogs: results.breeder_dogs,
        });
        return;
      } else {
        Breeder.findByIdAndRemove(
          req.body.breederid,
          function deleteBreeder(err) {
            if (err) {
              return next(err);
            }
            res.redirect("/catalog/breeders");
          }
        );
      }
    }
  );
};

exports.breeder_update_get = function (req, res, next) {
  async.parallel(
    {
      breeder: function (callback) {
        Breeder.find(callback);
      },
      locations: function (callback) {
        Location.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.breeder == null) {
        var err = new Error("Breeder not found");
        err.status = 404;
        return next(err);
      }
      res.render("breeder_form", {
        title: "Update Breeder",
        breeder: results.breeder,
        locations: results.locations,
        errors: false,
      });
    }
  );
};

exports.breeder_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Name contains non-alphabet characters."),
  body("established", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("location").trim().isLength({ min: 1 }).escape(),
  body("specialty").trim().isLength({ min: 1 }).escape(),
  body("description").trim().isLength({ min: 1 }).escape(),
  // body("photoURL", "Invalid File")
  //   .trim()
  //   .isLength({ min: 1 })
  //   .escape()
  //   .optional({ checkFalsy: true }),

  (req, res, next) => {
    const errors = validationResult(req);

    var breeder = new Breeder({
      name: req.body.name,
      established: req.body.established,
      location: req.body.location,
      specialty: req.body.specialty,
      description: req.body.description,
      photoURL: req.body.photoURL,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // console.log(res.status(400).json({ errors: errors.array() }));
      res.render("breeder_form", {
        title: "Update Breeder",
        breeder,
        errors: errors.array(),
      });
      return;
    } else {
      Breeder.findByIdAndUpdate(
        req.params.id,
        breeder,
        {},
        function (err, thebreeder) {
          if (err) {
            return next(err);
          }
          res.redirect(thebreeder.url);
        }
      );
    }
  },
];
