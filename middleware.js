const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //req.session.redirectUrl is just a note you store for later use.
    req.flash("error", "You must be logged-in");
    return res.redirect("/users/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isReviewOwner = async(req, res, next) => {
  let { reviewId } = req.params;
  const review = await Review.findById(reviewId).populate("author");
  if( !review.author._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the owner of this review");
    return res.redirect("/listings");
  }
  next();
};


module.exports.isOwner = async(req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  if (!res.locals.currUser._id.equals(listing.owner._id)) { // res.locals.currUser._id || req.user._id
    req.flash("error", "You are not the owner of this listing");
    return res.redirect("/listings");
  }
  next();
};

//Validate Listing
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body); //Form text → req.body and not file data
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

//Validate Review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if(error) {
    console.log(error.details);
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  else {
    next();
  }
}
