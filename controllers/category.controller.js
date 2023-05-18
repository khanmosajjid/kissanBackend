const Category = require("../models/category.model");

class CategoryController {
  constructor() {}

  async addCategory(req, res) {
    const { name, price } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!price) {
      return res.status(400).json({ error: "Price is required" });
    }
    try {
      let _category = new Category({
        name,
        price,
      });
      let savedCategory = await _category.save();
        return res.status(200).json({
          message: "Category Created Successfully",
          data: savedCategory,
        });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateCategory(req, res) {
    if (!req.params.id) {
      return res.status(400).json({ error: "Category ID is required" });
    }
    let updatedData = {};
    const { name, price } = req.body;
    if (name) {
      updatedData = {
        ...updatedData,
        name,
      };
    }
    if (price) {
      updatedData = {
        ...updatedData,
        price,
      };
    }
    try {
      let cat=await Category.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        updatedData,{
          new: true
        }
        
      );
      // console.log("category result is---->",cat);
      return res.status(200).json({
        message: "Category Created Successfully",
     
      });
      // if(cat){
      //   return res.status(200).json({
      //     message: "Category Created Successfully",
       
      //   });
      // }else{
      //   res.status(500).json({ message: "Internal Server Error" });
      // }

    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getCategory(req, res){
    // if (!req.params.id) {
    //     return res.status(400).json({ error: "Category ID is required" });
    // }
    try {
      // console.log("here---->")
        let category = await Category.find();
        return res.status(200).json({
            message: "Category Fetched Successfully",
            data: category,
          });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

  }
}

module.exports = CategoryController;
