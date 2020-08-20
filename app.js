//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(express.static("public"));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

const articleShema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleShema);
///// targeting to all articles /////
app.route("/articles")
.get(function(req, res) {
  Article.find({}, function(err, results) {
    if (!err) {
      res.send(results);
    } else {
      res.send(err)
    };

  });
})
.post(function(req, res) {


  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if (!err) {
      res.send("add new article.");
    } else {
      res.send(err);
    }
  });
})
.delete(function(req, res) {
  Article.deleteMany({}, function(err) {
    if (!err) {
      res.send("deleted all");
    } else {
      res.send(err);
    }
  });
});
////// targeting to specific article/////////
app.route("/articles/:route")
.get(function(req,res){
Article.findOne({title: req.params.route}, function(err, results) {
  if (results) {
    res.send(results);
  } else {
    res.send("nothing found")
  };

})})
.put(function(req,res){
  Article.updateOne(
    {title: req.params.route},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("successfully updated article")
      }
    }

  );
})
.patch(function(req,res){
  Article.updateOne(
    {title: req.params.route},
    {$set:  req.body},
    function(err){
      if(!err){
        res.send("Succes update")
      }
    }
  )
})
.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.route},
    function(err){
      if(!err){
        res.send("deleted article")
      }
    }
  )
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
