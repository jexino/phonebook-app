const express = require("express");
const router = express.Router();
const {check, validationResult}=require("express-validator");
const User = require('../models/user'); // Adjust the path as needed


const {                                              //getting from controllers
  addcontact,
  getContactById,
   getContact,
   updateContact,
   getAllContacts,
   deleteContact,
   getContactByName,
   getByName
     } = require("../controllers/user");



//PARAMETER
router.param("contactId",getContactById);
router.param("contactName",getContactByName);

//add contact
router.post("/addcontact",[
    check("name").isLength({min:3}).withMessage("name minimum of 3 characters"),
    check("phonenumber").isLength({min: 10, max: 15}).withMessage("please enter valid phone number"),
    check("email").isEmail().withMessage("Enter valid email")
],  addcontact)


//get Contact
router.get("/getcontact/:contactId",getContact)

// Update contact route
router.get('/updatecontact/:id', async (req, res) => {
  try {
      const contact = await User.findById(req.params.id);
      if (!contact) {
          return res.status(404).json({ error: 'Contact not found' });
      }
      res.render('updateContact', { contact });
  } catch (err) {
      console.error('Error fetching contact:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/updatecontact/:id', [
  check('name').optional().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  check('phonenumber').optional().isLength({ min: 10, max: 15 }).withMessage('Please enter a valid phone number'),
  check('email').optional().isEmail().withMessage('Please enter a valid email address')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {
      const { id } = req.params;
      const { name, phonenumber, email } = req.body;

      const updatedContact = await User.findByIdAndUpdate(id, {
          $set: {
              name: name || undefined,
              phonenumber: phonenumber || undefined,
              email: email || undefined
          }
      }, { new: true });

      if (!updatedContact) {
          return res.status(404).json({ error: 'Contact not found' });
      }

      res.redirect('/'); // Redirect to the homepage or wherever you want
  } catch (err) {
      console.error('Error updating contact:', err);
      res.status(500).send("Error updating contact");
  }
});

//getAllContatcs
router.get("/allContacts",getAllContacts);

//DeleteContact
router.delete("/deleteContact/:contactId",deleteContact)

//searchContact
router.get("/search/:contactName",getByName)
module.exports = router;
