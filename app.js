var bodyParser=require('body-parser'),
    methodOverride=require('method-override'),
    expressSanitizer=require('express-sanitizer'),
    mongoose=require('mongoose'),
    express=require("express"),
    app=express();
mongoose.connect("mongodb://localhost:27017/restapp",{useNewUrlParser:true,useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose COnfig
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Test Blog",
//     image:"https://images.unsplash.com/photo-1583133183696-7e960832aa11?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
//     body:"This is a Lava Mountain!!"
// })

//RESTFUL ROUTES
app.get("/",(req,res)=>{
    res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log("Error!!!");
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new",(req,res)=>{
    res.render("new");
})
//CREATE ROUTE
app.post("/blogs",(req,res)=>{
    //create and redirect to the index
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });
});
//EDIT ROUTE
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
});
//Delete
app.delete("/blogs/:id",function(req,res){
    //destroy and redirect
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs"); 
        }
    });
});

app.listen(2000,()=>{
    console.log("Server is Running !!!");
});
