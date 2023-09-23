//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash")
const mongoose = require("mongoose")
const homeStartingContent = "Click on the compose button to write/add your new Journal Entries.";
const aboutContent = `

Hi, I'm Aditya, the solo creator of this daily journal webpage. I'm a passionate web developer who loves creating useful and engaging platforms for people to use on a daily basis.

I started this website because I believe that journaling is a powerful tool for self-reflection and growth. It can help you to track your progress over time, identify patterns in your behavior, and learn from your experiences.

I also believe that journaling can be a fun and creative outlet. It's a chance to express yourself freely and without judgment. You can write about anything you want, from your deepest thoughts and feelings to the mundane details of your everyday life.

I hope that this website will help you to make journaling a regular part of your routine. I've included a variety of features to make it easy and enjoyable to write in your journal, such as:

A simple and intuitive interface
The ability to add images, videos, and other media to your entries
A variety of privacy settings
The ability to export your entries to other formats
I'm always looking for ways to improve this website, so please feel free to share your feedback and suggestions.

`;
const contactContent = `
We'd love to hear from you! Whether you have questions, suggestions, or just want to say hello, here's how you can get in touch with us:

Phone: +91 9902963167

Email: adithyab0727@gmail.com

Location:
Bangalore, Karnataka, India

Connect with Us on Social Media:

https://www.facebook.com/adithyabalagopal05
https://twitter.com/Adithya62944311
www.linkedin.com/in/adithya-b-67506b1b3

Business Hours:
Monday - Friday: 9:00 AM - 6:00 PM (IST)
Saturday: 10:00 AM - 4:00 PM (IST)
Sunday: Closed
`;

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/blogDB",{useNewUrlParser:true})
.then(() => {
  console.log("Connected!")
})
.catch((err) => {
  console.log(err)
})

const composeSchema = new mongoose.Schema({
  title: String,
  content:String
})

const Comp = mongoose.model("Comp",composeSchema);

app.get("/",function(req,res){
  Comp.find({})
  .then(posts => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })
  .catch(err => {
    // Handle any errors that occurred during the database query
    console.error(err);
    res.status(500).send("Internal Server Error");
  });
})

app.get("/compose",function(req,res){
  res.render('compose')
})

app.post("/compose",function(req,res){
  
  
  const newpost = new Comp({
    title:req.body.textbox,
    content:req.body.postBody
  })
  newpost.save()
  res.redirect('/');
  
})





app.get("/posts/:postId",async function(req,res){
  const requestedPostId = req.params.postId;
  try {
    const post = await Comp.findOne({ _id: requestedPostId });
    res.render("post", {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    // Handle any errors that occurred during the database query
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
  
    
  
})

app.get("/about",function(req,res){
  res.render('about',{aboutContent:aboutContent})
})

app.get("/contact",function(req,res){
  res.render('contact',{contactContent:contactContent})
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
