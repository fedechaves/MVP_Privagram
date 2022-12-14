const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");


//Post Routes - simplified for now
router.get("/:albumid/:id", postsController.getPost);

router.post("/createPost/:albumid", upload.single("file"), postsController.createPost);

router.put("/likePost/:id", postsController.likePost);

router.delete("/deletePost/:albumid/:id", postsController.deletePost);

module.exports = router;
