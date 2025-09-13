const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User.model")

exports.signup = async(req,res) => {
 
    try{
        const {name, email, password} = req.body; 
        
        const existingUser = await User.findOne({email}); 
        if (existingUser){ 
            return res.status(400).json({error: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name, 
            email, 
            password: hashedPassword,
        })
        await user.save();

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET, 
            {expiresIn: "1h"}
        )

        res.status(201).json({messgae: "Signup successful", token})
    } catch(err){
        console.error("Signup error:", err)
        res.status(500).json({error: "Server error"})
    }
}


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid passsword" });
    }

   
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error("Me route error:", err);
    res.status(500).json({ error: "Server error" });
  }
};