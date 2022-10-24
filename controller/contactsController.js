const {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../services/contactsService");
const { createError } = require("../helpers/errors");

const getContactsController = async (req, res, next) => {
  const data = await getAllContacts(req.query);
  res.json({
    status: "success",
    code: 200,
    data: {
      contacts: data,
    },
  });
};

const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const data = await getContactById(id);
  if (data) {
    res.json({
      status: "success",
      code: 200,
      data: {
        contact: data,
      },
    });
  } else {
    next(createError(404, `Not found contact id: ${id}`));
  }
};

const addContactController = async (req, res, next) => {
  const { body } = req;
  try {
    const data = await addContact(body);
    res.json({
      status: "success",
      code: 200,
      data: {
        contact: data,
      },
    });
  } catch (err) {
    if (err.message.includes("duplicate")) {
      next(
        createError(
          400,
          `its duplicate contact: ${body.name}, ${body.email}, ${body.phone}`
        )
      );
    } else {
      next(err);
    }
  }
};

const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const data = await updateContact(id, body);
  if (data) {
    res.json({
      status: "success",
      code: 200,
      data: {
        contact: data,
      },
    });
  } else {
    next(createError(404, `Not found contact id: ${id}`));
  }
};

const removeContactController = async (req, res, next) => {
  const { id } = req.params;
  const data = await removeContact(id);
  if (data) {
    res.json({
      status: "success",
      code: 200,
      data: {
        contact: data,
      },
    });
  } else {
    next(createError(404, `Not found contact id: ${id}`));
  }
};

const updateStatusContactController = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  if (!body) {
    next(createError(404, `Missing field favorite`));
    return;
  }
  const data = await updateStatusContact(id, body);
  if (data) {
    res.json({
      status: "success",
      code: 200,
      data: {
        contact: data,
      },
    });
  } else {
    next(createError(404, `Not found contact id: ${id}`));
  }
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  removeContactController,
  updateStatusContactController,
};
