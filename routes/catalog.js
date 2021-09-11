var express = require("express");
var router = express.Router();

var dog_controller = require("../controllers/dogController");
var breed_controller = require("../controllers/breedController");
var breeder_controller = require("../controllers/breederController");
var location_controller = require("../controllers/locationController");

//DOG ROUTES

router.get("/", dog_controller.index);

router.get("/dog/create", dog_controller.dog_create_get);

router.post("/dog/create", dog_controller.dog_create_post);

router.get("/dog/:id/delete", dog_controller.dog_delete_get);

router.post("/dog/:id/delete", dog_controller.dog_delete_post);

router.get("/dog/:id/update", dog_controller.dog_update_get);

router.post("/dog/:id/update", dog_controller.dog_update_post);

router.get("/dog/:id", dog_controller.dog_detail);

router.get("/dogs", dog_controller.dog_list);

router.get("/dog/:id/adopt", dog_controller.dog_adopt_get);

router.get("/create", dog_controller.create_get);

// router.post("/dog/:id/adopt", dog_controller.dog_adopt_post);

// BREEDER ROUTES

router.get("/breeder/create", breeder_controller.breeder_create_get);

router.post("/breeder/create", breeder_controller.breeder_create_post);

router.get("/breeder/:id/delete", breeder_controller.breeder_delete_get);

router.post("/breeder/:id/delete", breeder_controller.breeder_delete_post);

router.get("/breeder/:id/update", breeder_controller.breeder_update_get);

router.post("/breeder/:id/update", breeder_controller.breeder_update_post);

router.get("/breeder/:id", breeder_controller.breeder_detail);

router.get("/breeders", breeder_controller.breeder_list);

// BREED ROUTES

router.get("/breed/create", breed_controller.breed_create_get);

router.post("/breed/create", breed_controller.breed_create_post);

router.get("/breed/:id/delete", breed_controller.breed_delete_get);

router.post("/breed/:id/delete", breed_controller.breed_delete_post);

router.get("/breed/:id/update", breed_controller.breed_update_get);

router.post("/breed/:id/update", breed_controller.breed_update_post);

router.get("/breed/:id", breed_controller.breed_detail);

router.get("/breeds", breed_controller.breed_list);

// LOCATION ROUTES

router.get("/location/create", location_controller.location_create_get);

router.post("/location/create", location_controller.location_create_post);

router.get("/location/:id/delete", location_controller.location_delete_get);

router.post("/location/:id/delete", location_controller.location_delete_post);

router.get("/location/:id/update", location_controller.location_update_get);

router.post("/location/:id/update", location_controller.location_update_post);

router.get("/location/:id", location_controller.location_detail);

router.get("/locations", location_controller.location_list);

module.exports = router;
