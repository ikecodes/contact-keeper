const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/userModel');
const Contact = require('../models/contactModel');

router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
    res.json(contacts);
  } catch (error) {
    console.error(error.response.msg);
    res.status(500).send('Server Error');
  }
});

router.post('/', [auth, [check('name', 'Name is required').not().isEmail()]], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { name, email, phone, type } = req.body;
  try {
    const newContact = new Contact({
      name,
      email,
      phone,
      type,
      user: req.user.id,
    });
    const contact = await newContact.save();
    res.send(contact);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(updatedContact);
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.send('deleted');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
