const router = require("express").Router();
const db = require("../data/db.js");

// POST title and contents
router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    db.insert(req.body)
      .then((post) => {
        console.log(req.body.title.length);

        res.status(201).json(post);
      })
      .catch((error) => {
        res.status(500).json({
          error: "There was an error while saving the post to the database.",
        });
      });
  }
});

// // POST COMMENT
// router.post("/:id/comments", (req, res) => {
//   db.insertComment(req.body)
//     .then((comment) => {
//       res.status(200).json(comment);
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: "There was an error while saving the comment to the database",
//       });
//     });
// });

// GET COMMENTS
router.get("/:id/comments", (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
      console.log(post.length);
      if (post != 0) {
        db.findPostComments(req.params.id)
          .then((comments) => {
            res.status(200).json(comments);
          })
          .catch((err) => {
            res.status(500).json({
              error: "The comments information could not be retrieved.",
            });
          });
      } else {
        res.status(404).json({
          error: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "issues retrieving data",
      });
    });
});

router.get("/", (req, res) => {
  db.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

module.exports = router;
