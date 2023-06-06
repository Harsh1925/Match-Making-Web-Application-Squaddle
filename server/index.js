const express = require("express")
const app = express();
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const dotevn = require("dotenv")
const mongoose = require("mongoose")
var cookies = require("cookie-parser");
mongoose.set('strictQuery', true);

dotevn.config({ path: "./config.env" });
require("./db/conn");

app.use(cors())
app.use(express.json());
app.use(cookies());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));


const { User, registerUser, Message, PostMessage } = require("./model/userSchema");
const PORT = process.env.PORT

// Sign up to the Database
app.post('/signup', async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(422).send({ error: "plz fill all details" })
    }

    const generatedUserId = uuidv4()
    const user_id = generatedUserId

    if (!email || !password) {
        return res.status(422).send({ error: "plz fill all the the details" })
    }

    try {

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(409).send('User already exists. Please login')
        }

        const user = new registerUser({ user_id, email, password })
        await user.save()

        const token = await user.generateToken();

        res.status(201).json({ token, userId: generatedUserId });
        console.log("data Stored successfully")

    } catch (err) {
        console.log(err)
    }
})

// Log in to the Database
app.post('/login', async (req, res) => {

    const { email, password } = req.body

    if (!email || !password || password === null) {
        return res.status(400).json({ error: "Fill all details" })
    }

    try {

        const user = await User.findOne({ email })

        if (user) {

            const correctPassword = await bcrypt.compare(password, user.password)

            if (user && correctPassword) {
                const token = jwt.sign(user.toJSON(), email, {
                    expiresIn: 60 * 24
                })

                res.status(201).json({ token, userId: user.user_id })
            }
            else if (!correctPassword) {

                res.status(400).json("Invalid Password")
            }
        }

        else if (!user) {
            console.log("yollo")
            res.status(400).json("Invalid User")
        }


    } catch (err) {
        console.log(err)
    }
})

// Get individual user
app.get('/user', async (req, res) => {

    const userId = req.query.userId

    try {

        const query = { user_id: userId }
        const user = await User.findOne(query)
        res.send(user)

    } catch (err) {
        console.log(err)
    }
})

// Update User with a match
app.put('/addmatch', async (req, res) => {
    const { userId, matchedUserId } = req.body

    try {

        const query = { user_id: userId }
        const updateDocument = {
            $push: { matches: { user_id: matchedUserId } }
        }
        const user = await User.updateOne(query, updateDocument)
        res.send(user)
    } catch (err) {
        console.log(err)
    }
})

// Get all Users by userIds in the Database
app.get('/users', async (req, res) => {

    const userIds = JSON.parse(req.query.userIds)

    try {

        const pipeline =
            [
                {
                    '$match': {
                        'user_id': {
                            '$in': userIds
                        }
                    }
                }
            ]

        const foundUsers = await User.aggregate(pipeline)
        res.json(foundUsers)

    } catch (err) {
        console.log(err)
    }
})


// Get all the Gendered Users in the Database
app.get('/field-users', async (req, res) => {

    const field = req.query.field

    try {
        const query = { field: "" }
        const foundUsers = await User.find()
        res.json(foundUsers)

    } catch (err) {
        console.log(err)
    }
})



// Update a User in the Database
app.put('/user', async (req, res) => {

    const formData = req.body.formData

    try {

        const query = { user_id: formData.user_id }

        const updateDocument = {
            $set: {
                name: formData.name,
                email: formData.email,
                number: formData.phone_number,
                work: formData.work,
                password: formData.password,
                url: formData.url,
                matches: formData.matches,
                field: formData.field,
                skill: formData.skill
            },
        }

        const insertedUser = await User.findOneAndUpdate(query, updateDocument);

        res.status(200).json(insertedUser)

    } catch (err) {
        console.log(err)
    }
})
// ADD a additional UserData in the Database
app.put('/userdata', async (req, res) => {

    const { userData, inputList } = req.body

    try {

        const query = { user_id: userData.user_id }

        const updateDocument = {
            $set: {
                university: userData.university,
                githublink: userData.githublink,
                linkedinlink: userData.linkedinlink,
                YOE: userData.YOE,
                bio: userData.bio,
                project: inputList,
            },
        }


        const insertedUser = await User.findOneAndUpdate(query, updateDocument);

        res.status(200).json(insertedUser)

    } catch (err) {
        console.log(err)
    }
})

// Update UserData in the Database
app.put('/edituser', async (req, res) => {

    const { editUser, inputList } = req.body

    try {

        const query = { user_id: editUser.user_id }

        const updateDocument = {
            $set: {
                name: editUser.name,
                email: editUser.email,
                number: editUser.phone_number,
                work: editUser.work,
                url: editUser.url,
                field: editUser.field,
                skill: editUser.skill,
                university: editUser.university,
                githublink: editUser.githublink,
                linkedinlink: editUser.linkedinlink,
                YOE: editUser.YOE,
                bio: editUser.bio,
                project: inputList,
            },
        }


        const insertedUser = await User.findOneAndUpdate(query, updateDocument);

        res.status(200).json(insertedUser)

    } catch (err) {
        console.log(err)
    }
})

// Get Messages by from_userId and to_userId
app.get('/messages', async (req, res) => {
    const { userId, correspondingUserId } = req.query

    try {

        const query = {
            from_userId: userId, to_userId: correspondingUserId
        }
        const foundMessages = await Message.find(query)
        res.send(foundMessages)
    } catch (err) {
        console.log(err)
    }
})

// Add a Message to our Database
app.post('/message', async (req, res) => {

    const message = req.body.message

    try {
        const insertedMessage = await Message.create(message)
        res.send(insertedMessage)
    } catch (err) {
        console.log(err)
    }
})


//Get all post
app.get("/posts", async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
})

app.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});



//create new post
app.post("/posts", async (req, res) => {
    const { title, message, selectedFile, creator, tags, user_id } = req.body;

    const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();

        const query = { user_id: user_id }

        const post_id = newPostMessage._id


        const updateDocument = {
            $push: {
                posts: post_id,
            },
        }

        const insertedUser = await User.findOneAndUpdate(query, updateDocument);

        res.status(201).json(newPostMessage);



    } catch (error) {
        res.status(409).json({ message: error.message });
    }

});


app.patch('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
});


app.get('/posts/search', async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
)

app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
})


app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
});


app.patch('/posts/:id/likePost', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id == userId);

    if (index === -1) {
        post.likes.push(userId);
    } else {
        post.likes = post.likes.filter((id) => id != userId);
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
});



app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})


