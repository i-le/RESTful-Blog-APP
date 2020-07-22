const { timeStamp } = require('console');

const bodyParser = require('body-parser'),
mongoose = require('mongoose'),
express = require('express'),
methodOverride = require('method-override'),
app = express();

mongoose.connect("mongodb://localhost:27017/blogapp", { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})
.then(() => console.log('connected to db!'))
.catch(error => console.log(error.message))
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(methodOverride("_method"))


let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

let Blog = mongoose.model("Blog", blogSchema)

app.get("/", (req, res) => {
    res.redirect("/blogs")
})

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        res.render("index", {blogs: blogs})
    })
})

app.get("/blogs/new", (req, res) => {
    res.render("new")
})

app.post("/blogs", (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        res.redirect("/blogs")
    })
})

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        res.render("show", {blog: foundBlog})
    })
})

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        res.render("edit", {blog: foundBlog})
    })
    
})

app.put("/blogs/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, foundBlog) => {
        res.redirect("/blogs/" + req.params.id)
    })
})

app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err) => {
        res.redirect("/blogs")
    })
})

app.listen(27017)