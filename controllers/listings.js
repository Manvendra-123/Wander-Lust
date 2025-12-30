const Listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({ path: "reviews", populate: { path: "author" } });
  console.log(listing);
  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs"); //wrt Views folder
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;  // req.file -> image data
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing); //req.body.listing -> only text data
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "Successfully Created a New Listing!");
  res.redirect("/listings");
};

module.exports.rednerEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings"); //res.redirect() CANNOT send data (thats why flash is used)
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body.listing);

  if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  await listing.save();
  }
  

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings"); //res.redirect() CANNOT send data (thats why flash is used)
};
