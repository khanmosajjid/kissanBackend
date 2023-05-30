const validators = require("../middleware/validator");
const User = require("../models/user.model");
const Categories=require("../models/category.model")

User.createIndexes([
  { key: { walletAddress: 1 }, options: { unique: true } }
]);

class AuthController {
    constructor() { 

      
    }

    

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
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet Address is required" });
      }
        // console.log("balance is----->",balance);
        let userData = {
          walletAddress:walletAddress,
          referralStakedBalance:balance
          
        };
        
    
       
        
    
        try {
         
          const _user = await User.findOne({
            walletAddress,
          });

          // console.log("user found is--->",_user);
    
          if (!_user) {
            try{
            
              let user = new User(userData);
              let savedUser = await user.save();
             
              return res.status(200).json({
                message: "User Data Successfully",
                data: savedUser,
              });
            }catch(e){
             console.log("error in new user catch---->",e)
            }
           
          } else {
             if(balance>0){
              let user=await User.findOneAndUpdate(
                {
                  walletAddress: walletAddress
                },
                {
                  referralStakedBalance:balance
                },{
                  new: true
                }
                
              );
             }
          
            // console.log("user found  result is---->",user);
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
         return res.status(404).json({ error: 'error' });
      }
    }


    async getUsersByCategory(req, res){
      try {

        let category =await Categories.find({});
        const categoryRange = [
          { min: category[0]?.price, max: category[1]?.price, name: category[0]?.name },
          { min: category[1]?.price, max: category[2]?.price, name: category[1]?.name },
          { min: category[2]?.price, max: category[3]?.price, name: category[2]?.name },
          { min: category[3]?.price, max: 10000000000000, name: category[3]?.name }
        ];
        
        const pipeline = [
          {
            $addFields: {
              category: {
                $let: {
                  vars: {
                    matchedRange: {
                      $filter: {
                        input: categoryRange,
                        as: "range",
                        cond: {
                          $and: [
                            { $gte: ["$referralStakedBalance", "$$range.min"] },
                            { $lt: ["$referralStakedBalance", "$$range.max"] }
                          ]
                        }
                      }
                    }
                  },
                  in: { $arrayElemAt: ["$$matchedRange", 0] }
                }
              }
            }
          },
          {
            $match: {
              category: { $exists: true }
            }
          },
          {
            $project: {
              _id: 1,
              walletAddress: 1,
              role: 1,
              referralStakedBalance: 1,
              categoryName: "$category.name"
            }
          },{
            $sort:{
              referralStakedBalance: 1
            }
          }
        ];
        
        const userList = await User.aggregate(pipeline);
        
        
       return res.status(200).json({userList})
      } catch (error) {
        console.log("error in getUserByCategory", error);
        return res.status(500).json("Internal Server Error")
      }
    }

    
}

module.exports =  AuthController;