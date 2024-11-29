const db = require('../../models');
const helper = require('../../helper/helper');
const { Validator } = require('node-input-validator');

module.exports = {
    createbanner: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                title: 'required',
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }
            let imagePath;
            if (req.files && req.files.image) {
                imagePath = await helper.fileUpload(req.files.image);
            }
            const data = await db.banner.create({
                title: req.body.title,
                image: imagePath, 
            });
            req.flash("success", "Banner added successfully");
            res.redirect("/banners");
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error");
        }
    },
    bannerlist: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");
            const data = await db.banner.findAll({});
            res.render("banner/banner.ejs", {
                title: "Banners",
                data,
                session: req.session.admin,
            });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error");
        }
    },
    bannerdelete: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "Banner ID is required" });
            }
            const banner = await db.banner.findByPk(req.params.id);
            if (!banner) {
                return res.status(404).json({ success: false, message: "Banner not found" });
            }
            await db.banner.destroy({ where: { id: req.params.id } });
            return res.json({ success: true, message: "Banner deleted successfully" });
        } catch (error) {
            console.error("Error deleting banner:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    // bannerview: async (req, res) => {
    //     try {
    //         if (!req.session.admin) return res.redirect("/login");
    //         const data = await db.banner.findOne({ where: { id: req.params.id } });
    //         res.render("banner/bannerview.ejs", {
    //             title: "Detail",
    //             data,
    //             session: req.session.admin,
    //         });
    //     } catch (error) {
    //         console.error("Error viewing banner:", error);
    //         res.status(500).json({ success: false, message: "Internal server error" });
    //     }
    // },
    editban: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");
            const data = await db.banner.findOne({ where: { id: req.params.id } });
            res.render('banner/banneredit.ejs', {
                session: req.session.admin,
                title: "Edit Banner",
                data,
            });
        } catch (error) {
            console.error("Error viewing banner:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    banneredit: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");

            const banner = await db.banner.findOne({ where: { id: req.params.id } });
            if (!banner) {
                return res.status(404).json({ success: false, message: "Banner not found" });
            }
            const updatedFields = {
                ...(req.body.title && { title: req.body.title }), 
                ...(req.files && req.files.image && { image: await helper.fileUpload(req.files.image) }) 
            };
            await db.banner.update(updatedFields, { where: { id: req.params.id } });
            req.flash("success", "Banner updated successfully");
            res.redirect("/banners");
        } catch (error) {
            console.error("Error editing banner:", error);
            return helper.error(res, "Internal server error");
        }
    },
    addbanner:async(req,res)=>{
      try {
        if (!req.session.admin) return res.redirect("/login");
        res.render('banner/banneradd.ejs',{
          session:req.session.admin,
          title:"Add Banner",
        });
      } catch (error) {
        console.error("Error view", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    },
};
