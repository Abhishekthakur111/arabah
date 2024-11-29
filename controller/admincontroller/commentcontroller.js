const helper = require('../../helper/helper');
const db = require('../../models');
const { Validator } = require('node-input-validator'); 

db.comments.belongsTo(db.users,{
    foreignKey:"user_id",
    as:"data"
  });
  db.comments.belongsTo(db.products,{
    foreignKey:"product_id",
    as:"productss"
  });

module.exports = {
    createcomments: async (req, res) => {
        const v = new Validator(req.body, {
            user_id: 'required|integer',     
            product_id: 'required|integer',  
            comment: 'required|string|maxLength:500' 
        });
        let errorsResponse = await v.check();
        if (!errorsResponse) {
            return helper.error(res, v.errors); 
        }

        try {
            const data = await db.comments.create({
                user_id: req.body.user_id,
                product_id: req.body.product_id,
                comment: req.body.comment,
            });
            return res.status(200).json({ message: 'true', data });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error");
        }
    },
    commentget: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");
    
            const data = await db.comments.findAll({
                include: [
                    { model: db.users, as: 'data' },
                    { model: db.products, as: 'productss' }
                ]
            });
    
            res.render("comment/commentlist.ejs", {
                title: "Comments",
                data,
                session: req.session.admin,
            });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error");
        }
    },
    commentview: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");
    
            const data = await db.comments.findOne({
                include: [
                    { model: db.users, as: 'data' },
                    { model: db.products, as: 'productss' }
                ],
                where:{id:req.params.id}});
            
    
            res.render("comment/commentview.ejs", {
                title: "View",
                data,
                session: req.session.admin,
            });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error");
        }
    },
    commentdelete: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "comment ID is required" });
            }
            const service = await db.comments.findByPk(req.params.id);
            if (!service) {
                return res.status(404).json({ success: false, message: "comments not found" });
            }
            await db.comments.destroy({ where: { id: req.params.id } });

            return res.json({ success: true, message: "comments deleted successfully" });
        } catch (error) {
            console.error("Error deleting comments:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    
};
