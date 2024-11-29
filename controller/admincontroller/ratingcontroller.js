const helper = require('../../helper/helper');
const db = require('../../models');

db.rating.belongsTo(db.users,{
    foreignKey:"user_id",
    as:"data"
  });
  db.rating.belongsTo(db.products,{
    foreignKey:"product_id",
    as:"productss"
  });

module.exports = {
    createrating: async (req, res) => {
        try {
            const { user_id, product_id, rating , review} = req.body;
            const existingRating = await db.rating.findOne({
                where: {
                    user_id: user_id,
                    product_id: product_id,
                },
            });

            if (existingRating) {
                return res.status(400).json({ message: 'User has already rated this product' });
            }
            const data = await db.rating.create({
                user_id: user_id,
                product_id: product_id,
                rating: rating,
                review: review, 
            });

            return res.status(201).json({ message: 'Rating created successfully', data });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error");
        }
    },
    ratinglist:async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
            const data = await db.rating.findAll({
                include:[{model: db.users, as:'data'},
                    {model:db.products, as:'productss'}
                ]
            });
            res.render("rating/ratinglist.ejs", {
                title: "Rating",
                data,
                session: req.session.admin,
            });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error");
        }
    },
    ratingview:async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
            const data = await db.rating.findOne({
                include:[{model: db.users, as:'data'},
                    {model:db.products, as:'productss'}
                ],
                where:{id:req.params.id}});
          
            res.render("rating/ratingview.ejs", {
                title: "View",
                data,
                session: req.session.admin,
            });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error");
        }
    },
    ratingdelete: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "rating ID is required" });
            }
            const service = await db.rating.findByPk(req.params.id);
            if (!service) {
                return res.status(404).json({ success: false, message: "ratings not found" });
            }
            await db.rating.destroy({ where: { id: req.params.id } });

            return res.json({ success: true, message: "ratings deleted successfully" });
        } catch (error) {
            console.error("Error deleting ratings:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
};
