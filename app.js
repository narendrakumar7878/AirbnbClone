if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
//console.log(process.env.secret); 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
//const Listing = require("./models/listing.js");
//const wrapAsync = require("./utils/wrapAsync.js");
//const { error } = require("console");
// const { listingSchema, reviewSchema } = require("./schema.js");
//const Review = require("./models/review.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

const URL_MONGO = 'mongodb://127.0.0.1:27017/wonderlusts';
main().then(() => {
    console.log("connect DB");
})
    .catch((err) => {
        console.log(err)
    });
async function main() {
    await mongoose.connect(URL_MONGO);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/", (req, res) => {
//     res.send("I am a root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User ({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser, "helloword");
//     res.send(registeredUser);
// });

//routes and reviews
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    //res.status(statusCode).send(message);
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});













// app.get("/testListings", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "This is a beautiful villa in the middle of the city, with a great view and a nice pool",
//         price: 1000,
//         location: "india",
//         country: "india"
//     });
//     await sampleListing.save();
//     console.log("saved");
//     res.send("saved");
// });