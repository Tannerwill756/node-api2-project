const router = require("express").Router();
const db = require("../data/db.js");

//PUT update post by id
router.put("/:id", (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
      if (post != 0) {
        db.update(req.params.id, req.body).then((updPost) => {
          if (req.body.title && req.body.contents) {
            res.status(200).json(updPost);
          } else {
            res.status(400).json({
              errorMessage: "Please provide title and contents for the post.",
            });
          }
        });
      } else {
        res.status(404).json({
          message: "couldnt find the post with that id",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "The post information could not be modified.",
      });
    });
});

// DELETE a post
router.delete("/:id", (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
      if (post != 0) {
        db.remove(req.params.id)
          .then((delPost) => {
            res.status(200).json(delPost);
          })
          .catch((err) => {
            console.log("uh oh");
          });
      } else {
        res.status(404).json({
          message: "couldnt find the post with that id",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "The post could not be removed",
      });
    });
});

// POST a post
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

// POST COMMENT
router.post("/:id/comments", (req, res) => {
  db.findById(req.params.id).then((post) => {
    if (post != 0) {
      db.insertComment(req.body)
        .then((comment) => {
          if (req.body.text) {
            res.status(201).json(comment);
          } else {
            res.status(400).json({
              errorMessage: "Please provide text for the comment",
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            error:
              "There was an error while saving the comment to the database",
          });
        });
    } else {
      res.status(404).json({
        message: "couldnt find the post with that id",
      });
    }
  });
});

// GET post by id
router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
      if (post != 0) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with that specified ID does not exist.",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "The post information could not be retrieved.",
      });
    });
});

// GET COMMENTS
router.get("/:id/comments", (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
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
