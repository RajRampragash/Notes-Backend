import express from "express"
import fetchuser from "../middleware/fetchuser.js"
import { Notes } from "../models/notes.js";
import { ObjectId } from "bson";


const router = express.Router();

router.post("/api/addingNotes", fetchuser, async (req, resp) => {

    try {
      // since fetchuser middleware is used the id in the auth token is present in the req.user.id
      let userId = req.user.id;
      console.log("Body is: ",req.body)
      // creating a note 
      const new_note = await Notes.create({
        user: userId,
        title: req.body.title,
        body: req.body.body,
        tag: req.body.tag,
      });
      resp.send(new_note);
   

    // in any case any error occured
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

// Updating the notes login required

router.put("/api/updatingnotes/:id", fetchuser, async (req, resp) => {
  //make sure to use /:id not :id
  try {
    // getting all the informatoin from the form
    let { title, body, tag } = req.body;
    let updatedNote = {
      user: req.user.id,
      title: title,
      body: body,
      tag: tag,
    };
    // getting the id of note that you wish to update from the parameters
    const id = req.params.id;
    // #checking if the user in the auth-token and the user which is updating the nodes are same or not

    // finding the user id from the provided url
    const userInfo = await Notes.findById(id);

    // checking the user id with the authntication id
    if (userInfo.user.toString() !== req.user.id) {
      // returning error in case of  descruptcy
      return resp.status(403).send("Hacking not allowed");
    }
    // updating the note as by the user
    try {
      let status = await Note.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedNote }
      );
      // handeling error
      if (!status) {
        return resp.status(400).send("No Note Available");
      }
      // if no error sending response to the client
      resp.send(updatedNote);
    } catch (error) {
      resp
        .status(400)
        .send(
          "Server Error occured unable to make connection with the database"
        );
      console.log(error);
    }

    // in any case any error occured
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});



// Dleting the notes  authtenticaton required
router.delete("/api/deletingnotes/:noteId", fetchuser, async (req, resp) => {
  try {
    const userId = req.user.id; // req.user is from the middleware fetchapi
    // find the notes detail in database from the id in the url
    const data = await Notes.findById(req.params.noteId);
    // compare the user id that is present inside the note with the user id in the authenticaton
    if (data.user.toString() !== userId) {
      return resp.status(404).send("Hackers Not allowed");
    }
    // if everything is ok than delete the note by the id
    const deleteStatus = await Notes.findByIdAndDelete(req.params.noteId);
    // const deleteStatus = await Note.deleteOne({_id: new ObjectId(id)} );


    if (!deleteStatus) {
      console.log(deleteStatus)
      return resp.status(400).send("No Node is Available with this id");
    }
    resp.send("Deleted Successfully");
  } catch (error) {
    resp.status(400).send("Internal Server Error");
    console.log(error)
  }
});

// Fetching  the notes login required
router.get("/api/fetchingNotes", fetchuser, async (req, resp) => {
  try {
    const userId = req.user.id; // req.user is from the middleware fetchapi

    const data = await Notes.find({
      user: userId,
    });

    resp.send(data);
  } catch (error) {
    console.log("Error Occured : ", error);
    resp.status(400).send("Internal Server Error");
  }
});


export const noteRouter = router;