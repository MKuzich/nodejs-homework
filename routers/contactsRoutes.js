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
const ctrlWrapper = require("../helpers/ctrlWrapper");

const router = express.Router();

router.get("/", auth, ctrlWrapper(getContactsController));

router.get("/:id", auth, ctrlWrapper(getContactByIdController));

router.post(
  "/",
  auth,
  validateRequest(schemaCreate),
  ctrlWrapper(addContactController)
);

router.put(
  "/:id",
  auth,
  validateRequest(schemaCreate),
  ctrlWrapper(updateContactController)
);

router.delete("/:id", auth, ctrlWrapper(removeContactController));

router.patch(
  "/:id/favourite",
  validateRequest(schemaUpdate),
  ctrlWrapper(updateStatusContactController)
);

module.exports = router;
