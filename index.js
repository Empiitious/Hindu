import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));


let posts = [];

app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts } );
});

app.post("/", (req, res) => {
  const newPost = {
    title: req.body.title,
    content: req.body.content
  };
  if(posts.length ===0) 
  posts.push(newPost);
  if(posts.length > 0) 
  if(posts[posts.length - 1].title !== newPost.title)
  posts.push(newPost);
  res.render("index.ejs", { posts: posts });
});

app.get('/:title', (req, res) => {
  const postTitle = decodeURIComponent(req.params.title);
  const post = posts.find(p => p.title === postTitle);
  if (post) {
    res.render('post.ejs', { post: post });
  } else {
    res.status(404).send('Post not found');
  }
});

app.post("/create", (req, res) => {
  res.render("create.ejs");
});

app.post("/delete/:title", async (req, res) => {
  const title = req.params.title;
  console.log("Deleting post with title:", title);
  posts = posts.filter(item => item.title !== title);
  console.log("Logging posts:", posts);
  res.redirect("/");
});

app.get("/edit/:title", (req, res) => {
  const title = decodeURIComponent(req.params.title);
  const post = posts.find(p => p.title === title);

  if (post) {
    res.render("edit.ejs", { post: post });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/edit/:title", (req, res) => {
  const oldTitle = decodeURIComponent(req.params.title);
  const postIndex = posts.findIndex(p => p.title === oldTitle);

  if (postIndex !== -1) {
    posts[postIndex] = {
      title: req.body.title,
      content: req.body.content
    };

    res.redirect(`/${encodeURIComponent(posts[postIndex].title)}`);
  } else {
    res.status(404).send("Post not found");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
