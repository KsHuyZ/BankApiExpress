const User = require("../models/users.model");
const { generateOTPCode } = require("../utils/index");

const userCtrl = {
  checkUser: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        const otpCode = generateOTPCode();
        const newUser = new User({
          email,
          otp: {
            otpCode,
            created_at: new Date(),
          },
        });
        await newUser.save();
        return res
          .status(200)
          .json({ success: true, isVerified: false, otpCode });
      }
      if (!user.isVerified) {
        const otpCode = generateOTPCode();
        await User.findOneAndUpdate(
          { email },
          {
            otp: {
              otpCode,
              created_at: new Date(),
            },
          }
        );
        return res
          .status(200)
          .json({ success: true, isVerified: false, otpCode });
      }
      return res.status(200).json({ success: true, isVerified: true });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  createUser: async (req, res) => {
    const {
      email,
      password,
      name,
      avatar,
      role,
      position,
      gender,
      address,
      birthday,
      idDepartment,
    } = req.body;
    try {
      const existEmail = await User.findOne({ email: email });
      if (existEmail) {
        return res.status(400).json({ success: true, msg: "Has exits" });
      } else {
        const user = new User({
          email,
          name: name,
          password,
          avatar: avatar,
          role,
          gender,
          position,
          birthday,
          address,
          idDepartment,
        });
        await user.save();

        return res.status(200).json({ success: true, msg: "success" });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
  updateUser: async (req, res) => {
    const {
      email,
      password,
      name,
      avatar,
      role,
      position,
      gender,
      address,
      birthday,
      idDepartment,
    } = req.body;

    try {
      const user = await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          email,
          password,
          name,
          avatar,
          role,
          position,
          gender,
          address,
          birthday,
          idDepartment,
        }
      );

      return res.status(200).json({ success: true, msg: "success" });
    } catch (error) {
      console.log("error: ", error);
    }
  },
  signIn: async (req, res) => {
    const { email, password } = req.body;
    try {
      const existEmail = await User.findOne({ email: email });
      if (!existEmail) {
        return res.status(400).json({ success: false, msg: 1 });
      }
      const user = await User.findOne({ email, password });
      if (!user) {
        return res.status(400).json({ success: false, msg: 2 });
      }
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.log(error);
    }
  },
  allUser: async (req, res) => {
    try {
      const users = await User.find().populate("idDepartment");
      return res.status(200).json(users);
    } catch (error) {
      console.log("error: ", error);
    }
  },
  showUserById: async (req, res) => {
    try {
      const data = await User.findOne(
        { _id: req.params.id },
        "email name avatar role gender address position password birthday"
      )
        .populate("idDepartment")
        .exec();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  },
  searchByEmail: async (req, res) => {
    try {
      const data = await User.find(
        {
          email: { $regex: req.params.q },
        },
        "email name avatar role gender address"
      ).exec();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  },
  removeUser: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  },
  showUserBelongToDepartment: async (req, res) => {
    const q = req.params.departmentId;
    try {
      const data = await User.find({
        idDepartment: q,
      });

      if (data) {
        return res.status(200).json({
          success: true,
          data,
        });
      } else {
        return res.status(400).json({
          success: false,
          msg: "fails",
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
  showUserNotDepartment: async (req, res) => {
    try {
      const users = await User.find();
      if (users) {
        const data = users.filter((item) => !item.idDepartment);
        return res.status(200).json(data);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
  addUserDepartment: async (req, res) => {
    const idPerson = req.params.idPerson;
    const { idDepartment } = req.body;
    try {
      const updatedPost = await User.findOneAndUpdate(
        { _id: idPerson },
        {
          idDepartment,
        }
      );
      if (updatedPost) {
        res.status(200).json({ message: "Update successfully" });
      } else {
        console.log(updatedPost);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
  removeUserBelongToDepartment: async (req, res) => {
    const id = req.params.deleteId;
    try {
      const updatedData = await User.findOneAndUpdate(
        { _id: id },
        {
          idDepartment: null,
        }
      );
      if (updatedData) {
        res.status(200).json({ message: "Update successfully" });
      } else {
        console.log(updatedData);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
  searchEmailHasDepartment: async (req, res) => {
    const departmentId = req.params.departmentId;
    try {
      const data = await User.find(
        {
          email: { $regex: req.params.q },
          departmentId: departmentId,
        },
        "email name avatar role gender address position"
      ).exec();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  },
  searchEmailHasNotDepartment: async (req, res) => {
    try {
      try {
        const users = await User.find({ email: { $regex: req.params.q } });
        if (users) {
          const data = users.filter((item) => !item.idDepartment);
          return res.status(200).json(data);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
};

module.exports = userCtrl;
