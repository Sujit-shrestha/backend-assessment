const express = require("express");
const app = express();
const port = 3000;
//const data = require("./blogs-json.json");
const fs = require("fs");
app.use(express.json());

var reader = (req, res, next) => {
  fs.readFile("./blogs-json.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).send("Cannot read file.");
    } else {
      req.data = data;
      next();
    }
  });
};

app.get("/", (req, res) => {
  res.send(
    `<H1> Intuji Backend Assessments for Internship</H1><h2>Candidate: Sujit Shrestha</h2><h4>APIs written using node.js 's express. "blogs-json.json" is used to store blogs as static file.</h4>`
  );
});

//Get all blogs
app.get("/blogs", reader, (req, res) => {
  res.json(JSON.parse(req.data));
});

//Get blogs by Id
app.get("/blogs/:Id", reader, (req, res) => {
  if (req.data) {
    req.data = JSON.parse(req.data);
    const blog = req.data.blogs.find((b) => b.Id == req.params.Id);
    if (blog) {
      res.send(blog);
    } else {
      res.status(404).json({ message: "Blog requested not found" });
    }
  } else {
    res.status(404).json({ message: "Cannot read file." });
  }
});

app.post("/blogs/add", reader, (req, res) => {
  let fileToAdd = req.body;
  let data = JSON.parse(req.data);
  let lastId = data.blogs.reduce((preBlog, nextBlog) => {
    return (maxId = preBlog.Id > nextBlog.Id ? preBlog.Id : nextBlog.Id);
  });

  fileToAdd.Id = lastId + 1;
  data.blogs.push(fileToAdd);

  data = JSON.stringify(data, null, 2);
  fs.writeFile("./blogs-json.json", data, (err) => {
    if (err) {
      console.log(err);
      res.json({ message: "Cannot write into file" });
    } else {
      res.json({ "File Added": fileToAdd });
    }
  });
});
app.put("/blogs/update/:Id", reader, (req, res) => {
  let data = JSON.parse(req.data);
  let index = data.blogs.findIndex((b) => b.Id == req.params.Id);
  if (index == -1) {
    res.json({ message: "Cannot find the course to update." });
  } else {
    let fileToUpdate = req.body;

    fileToUpdate.Id = Number(req.params.Id);
    data.blogs[index] = fileToUpdate;

    data = JSON.stringify(data, null, 2);
    fs.writeFile("./blogs-json.json", data, (err) => {
      if (err) {
        console.log(err);
        res.json({ message: "Cannot write into file" });
      } else {
        res.json({ "File Added": fileToUpdate });
      }
    });
  }
});

// app.put("/blogs/update/:Id", (req, res) => {
//   let BlogID = req.params.Id;
//   console.log(BlogID);
//   fs.readFile("./blogs-json.json", "utf-8", (err, data) => {
//     if (err) {
//       res.json({ message: "Error reading file" });
//     } else {
//       let updatedFile = JSON.parse(data);
//       let requiredBlogIndex = updatedFile.blogs.findIndex(
//         (v) => v.Id == BlogID
//       );
//       if (requiredBlogIndex == -1) {
//         res.status(404).json({ message: "Blog Id not found" });
//       } else {
//         req.body.Id = BlogID;
//         updatedFile.blogs[requiredBlogIndex] = req.body;
//         updatedFile = JSON.stringify(updatedFile, null, 2);
//         fs.writeFile("./blogs-json.json", updatedFile, (err) => {
//           if (err) {
//             console.log(err);
//             res.status(400).json({ message: "Cannot write to file" });
//           } else {
//             res.json({ message: "Blog updated Successfully" });
//           }
//         });
//       }
//     }
//   });
// });

app.listen(port, () => {
  console.log("Listening on port 3000 ");
});
