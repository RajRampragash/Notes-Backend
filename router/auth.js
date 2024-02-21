import express from "express"
import bcrypt  from 'bcrypt'
import jwt from 'jsonwebtoken'
import {user} from "../models/user.js"
import fetchuser from "../middleware/fetchuser.js"

const JSWTSECRET = "SSSSh a Secret!!";
const router = express.Router();

router.post(
    "/auth/createUser",
  
  

  
    async (req, resp) => {
      const error = validationResult(req);
      // if there are  no errors and every entered data is correct as per the validation
      if (error.isEmpty()) {
        console.log(req.body.email);
  
        // check if another email also exist in the database
  
        const status = await user.find({
          email: req.body.email,
        });
  
        //  Checking if the status is empty means no duplicate email
        if (status.length == 0) {
          // # creating hash password
          let salt = bcrypt.genSaltSync(10);
          let hashPassword = await bcrypt.hash(req.body.password, salt);
          console.log(hashPassword);
          // Creating user and saving to the database
          const new_user = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
          });
  
          // creating token so that user will know that user is successfully created
          let data = {
            user: { id: new_user.id },
          };
  
          let token = jwt.sign(data, JSWTSECRET);
        
  
          resp.json({token:token, status:true});
          // updating the console
          console.log(new_user);
          console.log("New User Created Succcessfully");
        } else {
          console.log(status);
          resp.json({message : "Email already created", status:false});
        }
      } else {
        resp.json({message:error.errors[0].msg, status : false});
      }
    }
  );
  
  // authenticating user with user ID
  
  router.post("/auth/login", [], async (req, resp) => {
    // extracting email and password from body
    let { email, password } = req.body;
    // finding email from the database from the email provided by user
    const user = await user.findOne({
      email: email
    });
    // if email not found in the databse user will be undefined
    if (!user) {
      return resp.json({message : "Hi Incorrect Email",status:false});
    }
    // Comparing the password provided by the user to the hash password stored in the database
    let status = await bcrypt.compare(password, user.password); //error occured here gcpt told that hash password will always comes in the second argument
    console.log(status);
    // if password is incorrect the becrypt status is undefined so returning wrong password
    if (!status) {
      return resp.json({message: "Wrong Password", status:false});
    }
    console.log("You are Welcome Credentials are Correct");
    console.log(user.id); //error occured so put user[0].id since user is an array with dict inside
    // Creating an object of user id so that it can be tokenized and will bind with the notes that will be created by the user
    let data = {
      user: { id: user.id },
    };
    // generating the token using jswt secret
    let token = jwt.sign(data, JSWTSECRET);
    // sending response to the user
    resp.json({authToken:token , status:true});
  });
  
  // Route 3 getting user detail using  suthentication token since the user is already added so need to login again

  
  router.post("/api/auth/getuser", fetchuser, async (req, resp) => {
    try {
      // The authTokenUser  is taken from the middleware fetch user which will use the token to extract the user Id number
      const authTokenUser = req.user;
      console.log("User id : ");
      // id is inside userId
      console.log(authTokenUser.id);
  
      // Using authTokenUser.id to get the information of the userId
      const user = await user.findById(authTokenUser.id).select("-password");
      console.log(user);
  
      // if you don't found the user user will be an empty string
  
      if (!user) {
        // Handle the case when no user is found with the given ID
        return resp.json({ error: "User not found" , status: false});
      }
  
      // Send the user details as a response in json format
      resp.json(user);
  
      // in any case any error occured
    } catch (error) {
      // Handle any errors that occur during the operation
      console.error(error);
      resp.json({ error: "Internal Server Error", status:false });
    }
  });
  
  export const userRouter = router;
  