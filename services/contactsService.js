const { Contact } = require("../schemas/contactSchema");

const getAllContacts = async ({ page, limit, favorite }) => {
  const skip = (page - 1) * limit;
  const query = {};
  if (favorite) {
    query.favorite = true;
  } else if (!favorite) {
    query.favorite = false;
  }
  const users = await Contact.find(query).skip(skip).limit(limit);
  return users;
};

const getContactById = async (id) => {
  const user = await Contact.findOne({ _id: id });
  return user;
};

const addContact = async ({ name, email, phone }) => {
  const user = await Contact.create({ name, email, phone });
  return user;
};

const updateContact = async (id, body) => {
  const user = await Contact.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });
  return user;
};

const removeContact = async (id) => {
  const user = await Contact.findByIdAndRemove({ _id: id });
  return user;
};

const updateStatusContact = async (id, body) => {
  const user = await Contact.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });
  return user;
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
