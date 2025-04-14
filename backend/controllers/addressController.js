import Address from "../models/Address.js"


//    /api/address/add
export const addAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone
    } = req.body;

    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User not authorized' });
    }

    await Address.create({
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
      userId
    });

    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

  


//     /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User not authorized' });
    }

    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
