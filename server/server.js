import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./schemas/userSchema.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import Posts from "./schemas/postSchema.js";
import dotenv from "dotenv";
import VerifyToken from "./middleware/verifytoken.js";
import SavedPosts from "./schemas/savedpostsSchema.js";
dotenv.config({ path: "./.env" });

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const PORT = process.env.PORT || 6000;

const URI =
  "mongodb+srv://Winner:c2f38KCU2a1GhUPy@reme.vjgka3z.mongodb.net/Reme?retryWrites=true&w=majority&appName=Reme";

connect();
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

async function connect() {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
}
//all the users in the database
app.get("/users/:userName", async (req, res) => {
  try {
    const { userName } = req.params;
    const regex = new RegExp(userName, "i"); //gets the users by any letter in the username, it is also not case sensitive
    const users = await User.find(
      { userName: regex },
      { password: false, email: false }
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: "Users not found" });
  }
});

app.post("/logout", async (req, res) => {
  try {
    return res.status(200).cookie("token", "").json("Not Logged In");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//home endpoint
app.get("/home", (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Login To Access" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, info) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      return res.status(200).json(info);
    });
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// user profile endpoint
app.get("/profile/:userName", async (req, res) => {
  try {
    const { userName } = req.params;
    let user = await User.findOne({ userName })
    if (!user) {
      return res.status(404).json({ mesage: "No User Found" });
    }
    const post = await Posts.find({author: userName}) //getting the posts of the user
    user.posts = post;
    await user.save();
    const updatedUser = await User.findOne({userName: userName}).populate('posts');
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

//post request to register new users
app.post("/sign-up", async (req, res) => {
  try {
    const { firstName, lastName, age, userName, email, password, bio } = req.body;

    //find existing users by email
    const existingUser = await User.findOne({
      email: email,
      userName: userName,
    });
    if (existingUser) {
      //if user already exists no account will be created
      return res.status(400).send("User Already Exists");
    }

    const newUser = new User({
      firstName,
      lastName,
      age,
      userName,
      email,
      password,
      bio,
    });
    await newUser.save(); //save the meta data of existing users
    return res.status(201).send("Created User");
  } catch (error) {
    return res.status(404).send(error);
  }
});

//post request to log in existing users
app.post("/sign-in", async (req, res) => {
  try {
    const { userName } = req.body;
    //find existing users by email and password that is saved in the database
    const existingUser = await User.findOne({ userName: userName });
    if (existingUser) {
      //if user already exists no account will be created
      jwt.sign(
        { userName },
        process.env.ACCESS_TOKEN_SECRET,
        {},
        (err, token) => {
          if (err) {
            return res.status(400).json({ message: "Error found" });
          }
          return res
            .status(200)
            .cookie("token", token, { path: "/", httpOnly: false })
            .json(existingUser);
        }
      );

      //sending the token and user data to the client if already registered
    } else {
      return res.status(404).json({ message: "Not Registered" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.put("/:userName/follow", async (req, res) => {
  const { token } = req.cookies;
  const userToFollow = req.params.userName;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, async (err, info) => {
    if (err) {
      return res.json({ message: "Failed to authenticate token" });
    }
    try {
      const userTryingToFollow = await User.findOne({
        userName: info.userName,
      });

      if (userToFollow === userTryingToFollow) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }

      const userToBeFollowed = await User.findOneAndUpdate(
        { userName: userToFollow },
        { $push: { followers: info.userName } }, // add the username of the user to the followers array
        { new: true } // Return the updated document
      );

      if (userTryingToFollow.following.includes(userToFollow)) {
        return res.status(200).json(userToBeFollowed);
      }

      const userToBeFollowing = await User.findOneAndUpdate(
        { userName: info.userName },
        { $push: { following: userToFollow } }, // add the username of the user to the followers array
        { new: true } // Return the updated document
      );

      if (!userToBeFollowed) {
        return res.status(400).json({ message: "User to follow not found" });
      }

      if (!userToBeFollowing) {
        return res.status(400).json({ message: "User following not found" });
      }

      return res.status(200).json({ message: "Followed successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
});

app.put("/:userName/unfollow", async (req, res) => {
  const { token } = req.cookies;
  const userToUnfollow = req.params.userName;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, async (err, info) => {
    if (err) {
      return res.json({ message: "Failed to authenticate token" });
    }
    try {
      const userTryingToUnfollow = await User.findOne({
        userName: info.userName,
      });

      if (userToUnfollow === userTryingToUnfollow) {
        return res
          .status(400)
          .json({ message: "You cannot unfollow yourself" });
      }

      const userToBeUnfollowed = await User.findOneAndUpdate(
        { userName: userToUnfollow },
        { $pull: { followers: info.userName } }, // add the username of the user to the followers array
        { new: true } // Return the updated document
      );

      if (userTryingToUnfollow.following.includes(userToUnfollow)) {
        return res.status(200).json(userToBeUnfollowed);
      }
      const userToBeUnfollowing = await User.findOneAndUpdate(
        { userName: info.userName },
        { $pull: { following: userToUnfollow } }, // add the username of the user to the followers array
        { new: true } // Return the updated document
      );

      if (!userToBeUnfollowed) {
        return res.status(400).json({ message: "User to unfollow not found" });
      }

      if (!userToBeUnfollowing) {
        return res.status(400).json({ message: "User unfollowing not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error is ", error });
    }
  });
});

app.put("/:userName/edit", upload.single("profilePicture"), async (req, res) => {
    try {
      const { token } = req.cookies;
      const { firstName, lastName, bio } = req.body;
      if (!token) {
        return res.status(400).json({ message: "No token found" });
      }
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        {},
        async (err, info) => {
          try {
            if (err) {
              return res.status(400).json({ message: err });
            }

            let updateData = { firstName, lastName, bio };

            // Check if profile picture is uploaded
            if (req.file) {
              updateData.profilePicture = {
                //converting the buffer to base64 image
                data: `data:${
                  req.file.mimetype
                };base64,${req.file.buffer.toString("base64")}`,
                contentType: req.file.mimetype,
              };
            }

            //update the information with or without profile picture
            const user = await User.findOneAndUpdate(
              { userName: info.userName },
              updateData,
              { new: true }
            );

            return res.status(200).json(user);
          } catch (error) {
            return res.status(400).json({ error: error.mesage });
          }
        }
      );
    } catch (error) {
      return res.status(500).json({ error: err.mesage });
    }
  }
);

app.post("/post", upload.single("photo"), async (req, res) => {
  try {
    //const { userName } = req.params;
    const { token } = req.cookies;
    const { title, description } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      {},
      async (err, info) => {
        if (err) throw new Error("error found");

        try {
          const newPost = new Posts({
            author: info.userName,
            title: title,
            description: description,
            photo: {
              data: `data:${
                req.file.mimetype
              };base64,${req.file.buffer.toString("base64")}`,
              contentType: req.file.mimetype,
            },
            authorUrl: `profile/${info.userName}`,
          });
          await newPost.save();
          return res.status(201).json(newPost);
        } catch (error) {
          return res.status(400).json({ message: error });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/:userName/posts", async (req, res) => {
  try {
    const { userName } = req.params;

    try {
      const posts = await Posts.find({ author: userName });
      if (!posts) {
        return res.status(404).json({ message: "No Posts Found" });
      }
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/feed", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ message: "No token found" });
    }
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      {},
      async (err, info) => {
        if (err) throw new Error("error found");

        try {
          const user = await User.findOne({ userName: info.userName });
          if (!user) {
            return res.status(404).json({ message: "No user found" });
          }

          //arraay of followed users
          const followingUsers = user.following;

          //finding the user posts and followed users posts by the username
          const posts = await Posts.find({
            $or: [
              { author: info.userName },
              { author: { $in: followingUsers } },
            ],
          }).sort({ createdAt: -1 });

          return res.status(200).json(posts);
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/heart/:id", VerifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Posts.findById({ _id: id });
    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }
    if (post.hearts.includes(req.username)) {
      return res.status(200).json({ message: "You already like this post" });
    }
    const updatedPost = await Posts.findByIdAndUpdate(
      { _id: id },
      { $push: { hearts: req.username } },
      { new: true }
    );
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ mesage: error.message });
  }
});

app.put("/unheart/:id", VerifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Posts.findById({ _id: id });
    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }
    if (!post.hearts.includes(req.username)) {
      return res
        .status(200)
        .json({ message: "You already disliked this post" });
    }
    const updatedPost = await Posts.findByIdAndUpdate(
      { _id: id },
      { $pull: { hearts: req.username } },
      { new: true }
    );
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ mesage: error.message });
  }
});

app.put("/editpost/:id", upload.single('photo'), VerifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description } = req.body
    let updatedData = { title: title, description: description }
    if(req.file){
    updatedData.photo = {
        data: `data:${req.file.mimetype};base64,${(req.file.buffer).toString('base64')}`,
        contentType: req.file.mimetype
    }
}
    const updatedPost = await Posts.findByIdAndUpdate({_id: id}, updatedData, {new: true})
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/*
app.post('/savepost', VerifyToken, async(req, res)=> {
    try {
        const {_id, author, title, hearts, photo, description} = req.body;
        const saved = await SavedPosts.findOne({author: author});
        if(saved){
            return res.status(400).json({message: 'Post already saved'});
        }
        const savedPost = new SavedPosts({author, title, hearts, photo, description});
        await savedPost.save()
        return res.status(201).json(savedPost);
    }
       catch (error) {
        return res.status(400).json({message: error.message});
    }
})

app.get('/savedposts', VerifyToken, async(req, res)=> {
    try {
        const savedPosts = await SavedPosts.find({});
        return res.status(200).json(savedPosts);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})
*/
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
