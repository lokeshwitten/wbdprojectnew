const { json } = require('express/lib/response');
const sequelize = require('sequelize')
const fs = require('fs')
const io = require('../util/socket')
const path = require('path')
const User = require('../models/user')
const Blog = require('../models/blog');
const { Socket } = require('socket.io');
const rootdir = path.dirname(process.mainModule.filename)
exports.createPosts = async(req, res, next) => {
    if (!req.file) {
        return res.status(401).json({ message: "File Missing.Please upload the file" })
    }
    const userId = req.body.userId
    console.log(userId)
    const filepath = req.file.path;
    const title = req.body.title
    const content = req.body.content
    const author = req.body.author
        //Create the nessecary blog in the database and update the url 
    user = await User.findByPk(userId)
    if (!user) {
        return res.status(500).json({ message: "User not found" })
    } else {
        try {
            blog = await user.createBlog({
                title: title,
                author: author,
                content: content,
                imageUrl: filepath
            })
            return io.getIO().on('connection', (socket) => {
                io.getIO().emit('test', 'Lokesh')
            })
        } catch (err) {
            return res.status(500).json({ message: "The post cant be created" })
        }

    }

}

exports.getPosts = (req, res, next) => {
    Blog.findAll().then(
        (result) => {
            res.status(200).json(result)


        }
    )

}
exports.getPost = (req, res, next) => {
        const postId = req.params.blogId
        console.log(postId)
            //Fetch the post with that id
        Blog.findByPk(postId).then(
            (post) => {
                if (!post) {
                    res.status(404).json({ message: "The post couldnt be fetched" })
                } else {
                    res.status(200).json({ message: "Post Fetched Succesfully", post: post })
                }
            }
        )
    }
    //Gets the particular Blog and deletes it in the database and 
    //also in the storage
exports.deleteBlog = (req, res, next) => {
    const blogId = req.params.blogId
    Blog.findByPk(blogId).then((blog) => {
        imagepath = blog.imageUrl
        fs.unlinkSync(path.join(rootdir, imagepath))
        blog.destroy().then((result) => { res.status(200).json({ message: "The post deleted Succesfully" }) }).catch(
            (err) => {
                res.status(500).json({ message: "Cant delete the post" })

            })
    })



}
exports.updateBlog = (req, res, next) => {
    const blogId = req.params.blogId
    const updatedTitle = req.body.title
    const updatedContent = req.body.content
    const imageUrl = req.file.path
    Blog.findByPk(blogId).then(
        (blog) => {
            if (!blog) {
                res.status(404).json({ message: "The Blog cant be found or the blog doesnt exist" })
            } else {
                blog.title = updatedTitle,
                    blog.content = updatedContent


                blog.save().then((result) => { res.status(200).json({ message: "Blog Updated Successfully" }) }).catch(
                    (err) => {
                        res.status(500).json({ message: "The blog cant be updated" })
                    }
                )
            }

        }
    )
}