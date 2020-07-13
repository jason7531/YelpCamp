let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let methodOverride = require("method-override");
let Comment = require("./models/comment");
let Campground = require("./models/campground");
let seedDB = require("./seeds");
let passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user");
const PORT = process.env.PORT || 3000;

let commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index");
let flash = require("connect-flash");

const campground = require("./models/campground");
// seedDB();
app.use(methodOverride("_method"));
app.use(flash());
app.use(
    require("express-session")({
        secret: "Jason is a good developer",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
mongoose
    .connect(
        "<mongo atlas generated URL>", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }
    )
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("ERROR: ", err.message);
    });
//adding current user to every template
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(PORT, function() {
    console.log("YelpCamp Server Started");
});
