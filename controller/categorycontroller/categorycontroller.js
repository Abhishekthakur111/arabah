const { where } = require('sequelize');
const helper = require('../../helper/helper');
const db = require('../../models');
const { Validator } = require('node-input-validator');

module.exports = {

    createcategory: async(req, res)=>{
        try {
            const v = new Validator(req.body, {
              name:  "required",
              
             
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
              return helper.error(res, errorsResponse);
            }
            if (req.files && req.files.image) {
              let images = await helper.fileUpload(req.files.image);
              req.body.image = images;
            }
            
            const newCategory = await db.category.create({
              name: req.body.name,
              image: req.body.image,
              
            });
            req.flash("success","Add category successfully");
            res.redirect("/categorylist");
      

          } catch (error) {
            console.error("Error creating category:", error);
            return helper.error(res, "Internal server error");
          }
    },
    Categorylist:async(req, res) =>{
        try {
            if (!req.session.admin) return res.redirect("/login");
            const data = await db.category.findAll();
            res.render("category/categorylist", {
              title: "Categories",
              data,
              session: req.session.admin,
            });
         } catch (error) {
           console.log(error);
           return helper.error(res, "Internal server error");
         }
    },
    status: async (req, res) => {
        try {
            const result = await db.category.update(
                { status: req.body.status },
                { where: { id: req.body.id } }
            );
            if (result[0] === 1) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: "Status change failed" });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }, 
    delete: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "Category ID is required" });
            }
            const category = await db.category.findByPk(req.params.id);
            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }
            await db.category.destroy({ where: { id: req.params.id } });

            return res.json({ success: true, message: "Category deleted successfully" });
        } catch (error) {
            console.error("Error deleting category:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    categoryview: async(req,res)=>{
      try {
        if (!req.session.admin) return res.redirect("/login");
        const data = await db.category.findOne({where:{id:req.params.id}});
        console.log(data,'/////////////////')
        res.render("category/categoryview", {
          title: "Details",
          data,
          session: req.session.admin,
        });
      } catch (error) {
        console.error("Error view", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    },
    addcategory:async(req,res)=>{
      try {
        if (!req.session.admin) return res.redirect("/login");
        res.render('category/addcategory',{
          session:req.session.admin,
          title:"Add Category",
        });
      } catch (error) {
        console.error("Error view", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    },
    editcat:async(req,res)=>{
      try {
        if (!req.session.admin) return res.redirect("/login");
        const category = await db.category.findOne({where:{id:req.params.id}});
        res.render('category/editcategory.ejs',{
          session:req.session.admin,
          title:"Edit Category",
          category
        });
      } catch (error) {
        console.error("Error view", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    },
    categoryedit: async (req, res) => {
      try {
          if (!req.session.admin) return res.redirect("/login");
          
          const category = await db.category.findOne({ where: { id: req.params.id } });
          if (!category) {
              return res.status(404).json({ success: false, message: "Category not found" });
          }
          if (req.files && req.files.image) {
              let images = await helper.fileUpload(req.files.image);
              req.body.image = images; 
          } 
          const data= await db.category.update({
              name: req.body.name,
              image: req.body.image,
          }, {
              where: { id: req.params.id }
          });
          req.flash("success", "Category updated successfully");
          res.redirect("/categorylist");
  
      } catch (error) {
          console.error("Error editing category:", error);
          return helper.error(res, "Internal server error");
      }
  }
  
   
  
    
}