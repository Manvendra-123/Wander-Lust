const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

router.use(isLoggedIn)  

//Post Review Route
router.post("/", validateReview, wrapAsync( reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", isReviewOwner, wrapAsync(reviewController.destroyReview));

module.exports = router;