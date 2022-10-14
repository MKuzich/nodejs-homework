const express = require("express");
const {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  removeContactController,
  updateStatusContactController,
} = require("../controller/contactsController");
const { validateRequest } = require("../middlewares/validateRequest");
const { schemaCreate, schemaUpdate } = require("../schemas/contactSchema");
const { auth } = require("../middlewares/authValidate");

const router = express.Router();

router.get("/", auth, getContactsController);

router.get("/:id", auth, getContactByIdController);

router.post("/", auth, validateRequest(schemaCreate), addContactController);

router.put(
  "/:id",
  auth,
  validateRequest(schemaCreate),
  updateContactController
);

router.delete("/:id", auth, removeContactController);

router.patch(
  "/:id/favourite",
  validateRequest(schemaUpdate),
  updateStatusContactController
);

module.exports = router;
