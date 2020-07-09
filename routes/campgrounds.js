let express = require("express");
let router = express.Router();
let Campground = require("../models/campground");
let middleware = require("../middleware");

router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", {
                campgrounds: allCampgrounds,
            });
        }
    });
});
router.post("/", middleware.isLoggedIn, function(req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user.id,
        username: req.user.username,
    };
    const newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author,
    };

    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec(function(err, foundCampground) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/show", { campground: foundCampground });
            }
        });
});
//Edit campgrounds
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(
    req,
    res
) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});
//Update Campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
        err,
        updatedcampground
    ) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//Destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;