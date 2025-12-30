const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(asyncWrap(listingController.index)) //Index Route
  .post(
    //Create Rout ̰
    isLoggedIn,
    //Multer middleware 
    upload.single("listing[image]"), //multer process karega of file ko req.file mai save kar dega
    validateListing,
    asyncWrap(listingController.createListing)
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(asyncWrap(listingController.showListing)) //Show Route
  .patch(
    //Update Route
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    asyncWrap(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    asyncWrap(listingController.destroyListing) //Delete Route
  );

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrap(listingController.rednerEditForm)
);

module.exports = router;
