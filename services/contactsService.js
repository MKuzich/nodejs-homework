const { Contact } = require("../schemas/contactSchema");

const getAllContacts = async ({ page, limit, favorite }) => {
  const skip = (page - 1) * limit;
  const query = {};
  if (favorite) {
    query.favorite = true;
  }
  return Contact.find(query).skip(skip).limit(limit);
};

const getContactById = async (id) => {
  return Contact.findOne({ _id: id });
};

const addContact = async ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};

const updateContact = async (id, body) => {
  return Contact.findByIdAndUpdate({ _id: id }, body, { new: true });
};

const removeContact = async (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

const updateStatusContact = async (id, body) => {
  return Contact.findByIdAndUpdate({ _id: id }, body, { new: true });
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
