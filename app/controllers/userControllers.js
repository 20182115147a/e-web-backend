import User from "../models/Users.js";
import jwt from 'jsonwebtoken'
class userController {
  async login(req, res, next) {
    const { username, password } = req.body;
    try {
      // Tìm người dùng trong database
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Tên đăng nhập không tồn tại" });
      }

      // So sánh mật khẩu
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không chính xác" });
      }

      // Tạo JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        'my secret key',
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
  async register(req,res,next) {
    const { username, password, email, role,address,phone,fullName } = req.body;
    const avatar = req.file ? req.file.path : "";
    try {
    
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: "Tên đăng nhập hoặc email đã tồn tại" });
      }
     
      // Tạo người dùng mới
      const user = new User({
        username,
        password,
        email,
        role,
        profile: {
          avatar: avatar || "",
          fullName,
          address,
          phone,
        },
      });
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        'my secret key',
        { expiresIn: "1h" }
      );
      await user.save(); 
      res.status(201).json({ message: "Đăng ký thành công", user, token });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
}
export default new userController();
