const validators = require("../middleware/validator");
const User = require("../models/user.model");
const Categories=require("../models/category.model")

class AuthController {
    constructor() { }

    

    async register(req, res) {
        const { walletAddress, role, signature, message } = req.body;
        let signData = {
          walletAddress,
          message,
          signature,
        };
        let userData = {};
        if (!walletAddress) {
          return res.status(400).json({ message: "Wallet Address is required" });
        }
        if (!signature) {
          return res.status(400).json({ message: "Signature is required" });
        }
        if (!message) {
          return res.status(400).json({ message: "Message is required" });
        }
        if (!validators.isValidWalletAddress(walletAddress)) {
          return res.status(406).json({ message: "Invalid Wallet address" });
        }
        if (!validators.isValidSignature(signData)) {
          return res.status(406).json({ message: "Invalid signature" });
        }
    
        if (walletAddress) {
          userData = {
            ...userData,
            walletAddress,
          };
        }
        if (role) {
          userData = {
            ...userData,
            role,
          };
        }
    
        try {
          const _user = await User.findOne({
            walletAddress,
          });
    
          if (!_user) {
            let user = new User(userData);
            let savedUser = await user.save();
            return res.status(200).json({
              message: "User Registered Successfully",
              data: savedUser,
            });
          } else {
            return res.status(200).json({
              message: "User Logged In Successfully",
              data: _user,
            });
          }
        } catch (error) {
          console.log("error", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    
    async userCategory(req,res){
      const { walletAddress, balance } = req.body;
        
        let userData = {};
        
    
        if (walletAddress) {
          userData = {
           
            walletAddress,
            balance
          };
        }
        
    
        try {
          const _user = await User.findOne({
            walletAddress,
          });
    
          if (!_user) {
            let user = new User(userData);
            let savedUser = await user.save();
            return res.status(200).json({
              message: "User Data Successfully",
              data: savedUser,
            });
          } else {

            let user=await User.findOneAndUpdate(
              {
                walletAddress: walletAddress
              },
              {
                balance
              },{
                new: true
              }
              
            );
            // console.log("category result is---->",cat);
            return res.status(200).json({
              message: "user Balance Updated Successfully",
           
            });

            
          }
        } catch (error) {
          console.log("error", error);
          res.status(500).json({ message: "Internal Server Error" });
        }

    }

    async getUserCategory(req,res){
      // let walletAddress=req.body.walletAddress;
      console.log("here--->",req.params.id)
      try{
       let categoryId=req.params.id;
      
        console.log("category id is--->",req.params.id)
       const category = Categories.find({id:categoryId});
       console.log("category found is---->",category);

  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

    const filteredUsers = User.find({referralStakedBalance : category.price});

  res.json(filteredUsers);
      }catch(e){
        console.log("error is--->",e)
         return res.status(404).json({ error: 'error' });;
      }
    }
       
    
}

module.exports =  AuthController;