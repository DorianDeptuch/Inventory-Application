var Dog = require("../models/dog");
var Breeder = require("../models/breeder");
var Breed = require("../models/breed");
var Location = require("../models/location");

var async = require("async");

const { body, validationResult } = require("express-validator");

exports.index = function (req, res) {
  async.parallel(
    {
      dog_count: function (callback) {
        Dog.countDocuments({}, callback);
      },
      breeder_count: function (callback) {
        Breeder.countDocuments({}, callback);
      },
      breed_count: function (callback) {
        Breed.countDocuments({}, callback);
      },
      location_count: function (callback) {
        Location.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "Fur Friends Forever Home",
        error: err,
        data: results,
      });
    }
  );
};

exports.create_get = function (req, res) {
  res.render("create", { title: "Create" });
};

exports.dog_list = function (req, res, next) {
  Dog.find({}, "name breeder photoURL")
    .populate("breeder")
    .exec(function (err, list_dogs) {
      if (err) {
        return next(err);
      }
      res.render("dog_list", { title: "List of Dogs", dog_list: list_dogs });
    });
};

exports.dog_detail = function (req, res, next) {
  async.parallel(
    {
      dog: function (callback) {
        Dog.findById(req.params.id)
          .populate("breeder")
          .populate("breed")
          .populate("location")
          .exec(callback);
      },
      // dog_breeds: function (callback) {
      //   Dog.find({ breed: req.params.id }).exec(callback);
      // },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.dog == null) {
        var err = new Error("Dog not found");
        err.status = 404;
        return next(err);
      }
      res.render("dog_detail", {
        title: results.dog.name,
        dog: results.dog,
        // dog_breeds: results.dog_breeds,
      });
    }
  );
};

exports.dog_create_get = function (req, res) {
  async.parallel(
    {
      breeders: function (callback) {
        Breeder.find(callback);
      },
      breeds: function (callback) {
        Breed.find(callback);
      },
      locations: function (callback) {
        Location.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("dog_form", {
        title: "Create a Dog",
        breeders: results.breeders,
        breeds: results.breeds,
        locations: results.locations,
        // description,
        // temperment,
        // neuteredSpayed,
        // age,
        // sex,
        // adoptionFee,
        errors: false,
      });
    }
  );
};

exports.dog_create_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("breeder", "Breeder must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("breed", "Breed must not be empty").trim().isLength({ min: 1 }).escape(),
  body("location", "Location must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("temperment", "Temperment must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("neuteredSpayed", "Neutered/Spayed must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("age", "Age must not be empty").trim().isLength({ min: 1 }).escape(),
  body("sex", "Sex must not be empty").trim().isLength({ min: 1 }).escape(),
  body("adoptionFee", "Adoption Fee must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // body("breed.*").escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (req.body.photoURL == "") {
      req.body.photoURL = "https://imgur.com/M2Q1Zv2.jpg";
    }

    var dog = new Dog({
      name: req.body.name,
      breeder: req.body.breeder,
      breed: req.body.breed,
      location: req.body.location,
      description: req.body.description,
      temperment: req.body.temperment,
      neuteredSpayed: req.body.neuteredSpayed,
      age: req.body.age,
      sex: req.body.sex,
      adoptionFee: req.body.adoptionFee,
      photoURL: req.body.photoURL,
    });

    if (!errors.isEmpty()) {
      // console.log(res.status(400).json({ errors: errors.array() }));

      async.parallel(
        {
          breeders: function (callback) {
            Breeder.find(callback);
          },
          breeds: function (callback) {
            Breed.find(callback);
          },
          locations: function (callback) {
            Location.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          res.render("dog_form", {
            title: "Create a Dog",
            breeders: results.breeders,
            breeds: results.breeds,
            locations: results.locations,
            // description: results.description,
            // temperment: results.temperment,
            // neuteredSpayed: results.neuteredSpayed,
            // age: results.age,
            // sex: results.sex,
            // adoptionFee: results.adoptionFee,
            // photoURL: results.photoURL,
            dog: results.dog,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      dog.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(dog.url);
      });
    }
  },
];

exports.dog_delete_get = function (req, res, next) {
  async.parallel(
    {
      dog: function (callback) {
        Dog.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.dog == null) {
        res.redirect("/catalog/dogs");
      }
      res.render("dog_delete", { title: "Delete Dog", dog: results.dog });
    }
  );
};

exports.dog_delete_post = function (req, res, next) {
  async.parallel(
    {
      dog: function (callback) {
        Dog.findById(req.params.dogid).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      } else if (req.body.passwordid === "lalala") {
        Dog.findByIdAndRemove(req.body.dogid, function deleteDog(err) {
          if (err) {
            return next(err);
          }
          res.redirect("/catalog/dogs");
        });
      } else {
        return;
      }
    }
  );
};

exports.dog_update_get = function (req, res, next) {
  async.parallel(
    {
      dog: function (callback) {
        Dog.findById(req.params.id)
          .populate("breeder")
          .populate("breed")
          .populate("location")
          .exec(callback);
      },
      breeders: function (callback) {
        Breeder.find(callback);
      },
      breeds: function (callback) {
        Breed.find(callback);
      },
      locations: function (callback) {
        Location.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.dog == null) {
        var err = new Error("Dog not found");
        err.status = 404;
        return next(err);
      }
      res.render("dog_form", {
        title: "Update Dog",
        breeders: results.breeders,
        breeds: results.breeds,
        locations: results.locations,
        dog: results.dog,
        errors: false,
      });
    }
  );
};

exports.dog_update_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("breeder", "Breeder must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("breed", "Breed must not be empty").trim().isLength({ min: 1 }).escape(),
  body("location", "Location must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("temperment", "Temperment must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("neuteredSpayed", "Neutered/Spayed must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("age", "Age must not be empty").trim().isLength({ min: 1 }).escape(),
  body("sex", "Sex must not be empty").trim().isLength({ min: 1 }).escape(),
  body("adoptionFee", "Adoption Fee must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // body("breed.*").escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var dog = new Dog({
      name: req.body.name,
      breeder: req.body.breeder,
      breed: req.body.breed,
      location: req.body.location,
      description: req.body.description,
      temperment: req.body.temperment,
      neuteredSpayed: req.body.neuteredSpayed,
      age: req.body.age,
      sex: req.body.sex,
      adoptionFee: req.body.adoptionFee,
      photoURL: req.body.photoURL,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // console.log(res.status(400).json({ errors: errors.array() }));

      async.parallel(
        {
          breeders: function (callback) {
            Breeder.find(callback);
          },
          breeds: function (callback) {
            Breed.find(callback);
          },
          locations: function (callback) {
            Location.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          res.render("dog_form", {
            title: "Update Dog",
            breeders: results.breeders,
            breeds: results.breeds,
            locations: results.locations,
            // description: results.description,
            // temperment: results.temperment,
            // neuteredSpayed: results.neuteredSpayed,
            // age: results.age,
            // sex: results.sex,
            // adoptionFee: results.adoptionFee,
            // photoURL: results.photoURL,
            dog: results.dog,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Dog.findByIdAndUpdate(req.params.id, dog, {}, function (err, thedog) {
        if (err) {
          return next(err);
        }
        res.redirect(thedog.url);
      });
    }
  },
];

exports.dog_adopt_get = function (req, res, next) {
  async.parallel(
    {
      dog: function (callback) {
        Dog.findById(req.params.id)
          .populate("breeder")
          .populate("breed")
          .populate("location")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.dog == null) {
        var err = new Error("Dog not found");
        err.status = 404;
        return next(err);
      }
      res.render("dog_adopt", {
        title: results.dog.name,
        dog: results.dog,
      });
    }
  );
};

// exports.dog_adopt_post = function (req, res, next) {
//   async.parallel(
//     {
//       dog: function (callback) {
//         Dog.findById(req.params.dogid).exec(callback);
//       },
//       dogs: function (callback) {
//         Dog.findById(req.params.id)
//           .populate("breeder")
//           .populate("breed")
//           .populate("location")
//           .exec(callback);
//       },
//     },
//     function (err, results) {
//       if (err) {
//         return next(err);
//       } else {
//         res.render("dog_adoption_complete", {
//           title: "Adoption Complete",
//           dog: results.dog,
//           dogs: results.dogs,
//         });
//         setTimeout(function () {
//           console.log("Deleting...");
//           res.redirect("/catalog/dogs");
//         }, 5000);
//         // Dog.findByIdAndRemove(req.body.dogid, function deleteDog(err) {
//         //   if (err) {
//         //     return next(err);
//         //   }
//         //   res.redirect("/catalog/dogs");
//         // });
//       }
//     }
//   );
// };
