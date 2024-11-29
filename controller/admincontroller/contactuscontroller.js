const helper = require('../../helper/helper');
const db = require('../../models');
const { Validator } = require('node-input-validator');

module.exports = {

    createcontactus: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                name: "required",
                email:'required',
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }
            const contactus = await db.contactus.create({
                name: req.body.name,
                email:req.body.email,
                phone_no:req.body.phone_no,
                message:req.body.message,
              
            });
            return res.status(201).json({ message: ' created successfully', contactus });
        } catch (error) {
           console.error("Error creating contactus", error);
            return helper.error(res, "Internal server error");
        }
    },
    getcontactus:async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
            const data = await db.contactus.findAll({});
            res.render("contactus/contactus.ejs", {
                title: "Contact Us",
                data,
                session: req.session.admin,
              });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error"); 
        }
    },
    deletecontact: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "contact ID is required" });
            }
            const contact = await db.contactus.findByPk(req.params.id);
            if (!contact) {
                return res.status(404).json({ success: false, message: "contact not found" });
            }
            await db.contactus.destroy({ where: { id: req.params.id } });
            console.log()

            return res.json({ success: true, message: "contact deleted successfully" });
        } catch (error) {
            console.error("Error deleting contact:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    contactview: async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
          const data = await db.contactus.findOne({
            where:{id:req.params.id}});
        
          res.render("contactus/contactview.ejs", {
            title: "Details",
            data,
            session: req.session.admin,
          });
        } catch (error) {
          console.error("Error view", error);
          res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    
}