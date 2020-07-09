let Campground = require("../models/campground");
let Comment = require("../models/comment");
let middlewareObj = {};
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You dont have permission to do that");
        res.redirect("back");
    }
};
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "campground not found");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be loggged in to do that");
        res.redirect("back");
    }
};
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");
};

module.exports = middlewareObj;