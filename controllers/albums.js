const cloudinary = require("../middleware/cloudinary");
const Album = require("../models/Album");
const Post = require("../models/Post");
const { getAlbumPostsIterative } = require("../middleware/post");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const albums = await Album.find({ user: req.user.id });
      res.render("profile.ejs", { albums: albums, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const albums = await Album.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { albums: albums });
    } catch (err) {
      console.log(err);
    }
  },
  getAlbum: async (req, res) => {
    try {
      const albums = await Album.findById(req.params.id);
      const posts = await Post.find({album: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("postsFeed.ejs", { albums: albums, user: req.user, posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  createAlbum: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Album.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        user: req.user.id,
      });
      console.log("Album has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(req)
      console.log(err);
    }
  },

  deleteAlbum: async (req, res) => {
    try {
      // Find album by id
      let album = await Album.findById({ _id: req.params.id });
      let post = await Post.find({ album: req.params.id })
      // console.log(album)
      // console.log(post)
      
      // Delete image from cloudinary
      for(let i = 0; i < post.length ; i++){
        await cloudinary.uploader.destroy(post[i].cloudinaryId);
      }
      await cloudinary.uploader.destroy(album.cloudinaryId);

      for(let i = 0; i < post.length ; i++){
        await Post.remove(post[i]);
      }
      await Album.remove({ _id: req.params.id });

      console.log("Deleted Album");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};