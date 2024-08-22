const User= require("../models/user")
const {check, validationResult}=require("express-validator")


//get contactID
exports.getContactById = (req, res, next, id) => {
      User.findById(id).exec((err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "No contact was found in DB"
          });
        }
        req.profile = user;
        next();
      })
    
   }
  //getContactByName
 exports.getContactByName=(req, res, next, contactname)=>{
  User.find({"name":contactname},(err,user)=>{
    if(err||!user){
      return res.status(400).json({
        error: "No name was found in DB"
      });
    } 
    else{
      req.profile=user;
      next();
    }
  })
 }



exports.getContact=(req,res)=>{
    return res.json(req.profile);
}

// ADD CONTACT
exports.addcontact = async (req, res) => {
  console.log('Request body:', req.body); // Log the incoming request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array()); // Log validation errors
      return res.status(400).json({ error: errors.array()[0].msg }); // Send the first validation error
  }

  const { name, phonenumber, email } = req.body;

  if (!phonenumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {

       const user = new User({
      name,
      phonenumber,
      email
      });

      // Save the user to the database
      const savedUser = await user.save();
      res.status(201).json({
          message: "Contact added successfully!",
          contact: {
              name: savedUser.name,
              phonenumber: savedUser.phonenumber,
              email: savedUser.email,
              id: savedUser._id
          }
      });
  } catch (err) {
      console.error("Error saving contact:", err);
      res.status(500).json({ error: "Error saving contact. Please try again later." });
  }
};


// Update contact controller
exports.updateContact = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { id } = req.params; // Contact ID from URL params
        const { name, phone, email } = req.body; // New data from the request body

        // Find the contact by ID and update it
        const updatedContact = await User.findByIdAndUpdate(id, {
            $set: {
                name: name || undefined,
                phonenumber: phone || undefined,
                email: email || undefined
            }
        }, { new: true, runValidators:true });

        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({
            message: 'Contact updated successfully',
            contact: updatedContact
        });
    } catch (err) {
        console.error('Error while updating contact:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// DELETE CONTACT
exports.deleteContact = (req, res) => {
  let contact = req.profile;
  contact.remove((err, deletedcontact) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product"
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedcontact
    });
  });
};
//GET ALL CONTACTS 10 PER PAGE
exports.getAllContacts=(req,res)=>{
 
    User.find()
    .limit(10)   // TAKES  10 CONTACT PER PAGE  
    .exec((err,users) => {
        if(err || !users){
            return res.status(400).json({
                error:"NO contacts found"
            });
        }
        res.json(users);
    });
};
//search by Name
exports.getByName=(req,res)=>{
  return res.json(req.profile);
}