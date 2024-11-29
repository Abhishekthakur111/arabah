var express = require('express');
var router = express.Router();
const auth = require('../controller/apicontroller/auth');
const admin = require('../controller/admincontroller/admincontroller');
const category = require('../controller/categorycontroller/categorycontroller');
const product = require('../controller/admincontroller/productcpntroller');
const cms  = require('../controller/admincontroller/cmscontroller');
const contactus = require('../controller/admincontroller/contactuscontroller');
const banner = require('../controller/admincontroller/bannercontroller');
const comment = require('../controller/admincontroller/commentcontroller');
const rating = require('../controller/admincontroller/ratingcontroller');




/* GET home page. */
router.post('/create', auth.createUser );
router.post('/get', auth.get);

// router to render 
router.get('/dashboard', admin.dashboard);
router.get('/login', admin.login);

//router to login dashboard
router.post('/loginpost',admin.loginpost);

// router for profile
router.get('/profile', admin.profile);
router.post('/profileupdate',admin.edit_profile);
router.get('/password', admin.password);
router.post('/updatepassword',admin.updatepassword);
router.get('/logout', admin.logout);

// router for userlist
router.get('/userlist', admin.user_list);
router.get('/view/:id', admin.view);
router.post('/delete/:id',admin.user_delete);
router.post('/status', admin.user_status);
router.post('/images', admin.images);

// router for category
router.post('/category', category.createcategory );
router.get('/categorylist',category.Categorylist);
router.post('/statuschange', category.status);
router.post('/deletes/:id',category.delete);
router.get('/categoryview/:id',category.categoryview);
router.get('/addcategory',category.addcategory);
router.get('/editcategory/:id',category.editcat);
router.post('/editcategory/:id', category.categoryedit);

// routes for products
router.post('/product', product.createproduct);
router.get('/productlist', product.getproduct);
router.post('/productstatus', product.status);
router.post('/deleted/:id', product.delete);
router.get('/productview/:id', product.productview);
router.get('/productadd',product.productadd);
router.get('/productedit/:id',product.producteditview);
router.post('/productedit/:id',product.productedit);
router.get('/product/review/:id', product.productreview);

//routes for banner
router.post('/createbanner', banner.createbanner);
router.get('/banners', banner.bannerlist);
router.post('/deletebanner/:id', banner.bannerdelete);
// router.get('/bannerview/:id', banner.bannerview);
router.get('/banneredit/:id', banner.editban);
router.post('/banneredits/:id', banner.banneredit);
router.get('/addbanner',banner.addbanner);

//router for cms
router.get('/privacy', cms.privacy);
router.post('/privacy', cms.privacy_update);
router.get('/aboutus', cms.aboutus);
router.post('/aboutus', cms.aboutusupdate);
router.get('/term',cms.term);
router.post('/term', cms.terms);

// router for contactus
router.post('/createcontactus',contactus.createcontactus);
router.get('/contactus',contactus.getcontactus);
router.post('/deletecontact/:id',contactus.deletecontact);
router.get('/viewcontact/:id',contactus.contactview);

// router for comments
router.post('/createcomment', comment.createcomments);
router.get('/commentlist', comment.commentget);
router.get('/commentview/:id', comment.commentview);
router.post('/commentdelete/:id', comment.commentdelete);


//router for rating
router.post('/createrating', rating.createrating);
router.get('/ratinglist', rating.ratinglist);
router.get('/ratingview/:id', rating.ratingview);
router.post('/ratingdelete/:id', rating.ratingdelete);

//otp
router.get('/otp', admin.otpPage);
router.post('/verifyotp', admin.verifyOtp);
router.get('/passcode', admin.passcode);
router.post('/verifypasscode',admin.verifypasscode);



module.exports = router;
