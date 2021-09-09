var Location = require("../models/location");
var Dog = require("../models/dog");

var async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all locations
exports.location_list = function (req, res, next) {
  Location.find()
    // .populate()
    .exec(function (err, list_locations) {
      if (err) {
        return next(err);
      }
      res.render("location_list", {
        title: "List of Locations",
        error: err,
        location_list: list_locations,
      });
    });
};

exports.location_detail = function (req, res, next) {
  async.parallel(
    {
      location: function (callback) {
        Location.findById(req.params.id).exec(callback);
      },
      location_dogs: function (callback) {
        Dog.find({ location: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.location == null) {
        var err = new Error("Location not found");
        err.status = 404;
        return next(err);
      }
      res.render("location_detail", {
        title: results.location.name,
        location: results.location,
        location_dogs: results.location_dogs,
      });
    }
  );
};

exports.location_create_get = function (req, res) {
  res.render("location_form", { title: "Create a Location", errors: false });
};

exports.location_create_post = [
  body("name", "Name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Name contains non-alphabetic characters"),
  body("description", "Description must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var location = new Location({
      name: req.body.name,
      description: req.body.description,
      photoURL: req.body.photoURL,
    });

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("location_form", {
        title: "Create a Location",
        // name: req.body.name,
        // description: req.body.description,
        // photoURL: req.body.photoURL,
        location,
        errors: errors.array(),
      });
      return;
    } else {
      Location.findOne({ name: req.body.name }).exec(function (
        err,
        found_location
      ) {
        if (err) {
          return next(err);
        }

        if (found_location) {
          res.redirect(found_location.url);
        } else {
          location.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(location.url);
          });
        }
      });
    }
  },
];

exports.location_delete_get = function (req, res, next) {
  async.parallel(
    {
      location: function (callback) {
        Location.findById(req.params.id).exec(callback);
      },
      location_dogs: function (callback) {
        Dog.find({ location: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.location == null) {
        res.redirect("/catalog/locations");
      }
      res.render("location_delete", {
        title: "Delete Location",
        location: results.location,
        location_dogs: results.location_dogs,
      });
    }
  );
};

exports.location_delete_post = function (req, res) {
  async.parallel(
    {
      location: function (callback) {
        Location.findById(req.body.locationid).exec(callback);
      },
      location_dogs: function (callback) {
        Dog.find({ location: req.params.locationid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.location_dogs > 0) {
        res.render("location_delete", {
          title: "Delete Location",
          location: results.location,
          location_dogs: results.location_dogs,
        });
        return;
      } else {
        Location.findByIdAndRemove(
          req.body.locationid,
          function deleteLocation(err) {
            if (err) {
              return next(err);
            }
            res.redirect("/catalog/locations");
          }
        );
      }
    }
  );
};

exports.location_update_get = function (req, res, next) {
  async.parallel(
    {
      location: function (callback) {
        Location.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.location == null) {
        var err = new Error("Location not found");
        err.status = 404;
        return next(err);
      }
      res.render("location_form", {
        title: "Update Location",
        location: results.location,
        errors: false,
      });
    }
  );
};

exports.location_update_post = [
  body("name", "Name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Name contains non-alphabetic characters"),
  body("description", "Description must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var location = new Location({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("location_form", {
        title: "Update Location",
        name: req.body.name,
        description: req.body.description,
        photoURL: req.body.photoURL,
        errors: errors.array(),
      });
      return;
    } else {
      Location.findByIdAndUpdate(
        req.params.id,
        location,
        {},
        function (err, thelocation) {
          if (err) {
            return next(err);
          }
          res.redirect(thelocation.url);
        }
      );
    }
  },
];
