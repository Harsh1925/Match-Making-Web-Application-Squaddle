const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    matches: {
        type: Array
    },
    skill: {
        label: {
            type: Array,
            required: true
        },
        value: {
            type: Array,
            required: true

        }
    },
    university: {
        type: String,
        required: true
    },
    githublink: {
        type: String,
        required: true
    },
    linkedinlink: {
        type: String,
        required: true
    },
    YOE: {
        type: Number,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    project: {
        protitle: {
            type: Array,
            required: true
        },
        prodes: {
            type: Array,
            required: true
        }
    },
    posts: { type: Array, default: [] },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

const registerUserSchema = new mongoose.Schema({

    user_id: {
        type: String
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

const userChatSchema = new mongoose.Schema({

    from_userId: {
        type: String,
        required: true
    },
    to_userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamps: {
        type: Date
    }
}
)


const postSchema = mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: { type: Array, default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
},)

var PostMessage = mongoose.model('PostMessage', postSchema);

registerUserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {

        this.password = await bcrypt.hash(this.password, 12);

    }
    next();
})

userSchema.methods.generateToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token
    } catch (err) {
        console.log(err);
    }
}

registerUserSchema.methods.generateToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token
    } catch (err) {
        console.log(err);
    }
}

const User = mongoose.model("USER", userSchema, "users");
const registerUser = mongoose.model('Registered', registerUserSchema, 'users');
const Message = mongoose.model("Message", userChatSchema)

exports.registerUser = registerUser
exports.User = User
exports.Message = Message
exports.PostMessage = PostMessage
