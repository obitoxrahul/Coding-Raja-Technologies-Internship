const express=require('express');
const router=express.Router();
const Post=require('../models/Post');


/**
 * GET
 * HOME
 */
//Routes
router.get('',async(req,res)=>{
    try {
        const locals={
            title:"Blog",
            description:"A Simple Blog Website."
        }

        let perPage=5; //Number of posts to show per page
        let page=req.query.page || 1; //The current page number

        const data=await Post.aggregate([{ $sort : { createdAt: -1} },{ $skip : (perPage*page)-perPage}, { $limit : perPage }])
        const count = await Post.countDocuments({});
        const nextPage=parseInt(page)+1;
        const hasNextPage=nextPage <= Math.ceil(count /perPage);

        res.render('index',{
            locals,
            data,
            current:page,
            nextPage:hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
        
    } catch (error) {
        console.log("Error in getting the posts: ", error);
    }
});

/**
 * GET
 * POST :id
 */

router.get('/post/:id',async(req,res)=>{

    try {
        let slug=req.params.id;

        const data= await Post.findById({ _id:slug });

        const locals={
            title:data.title,
            description:"A Simple Blog Website."
        }
        res.render('post', { 
            locals,
            data,
            currentRoute: `/post/${slug}`
        });
        
    } catch (error) {
        console.log("Error in getting the posts: ", error);
    }
});

/**
 * POST
 * POST :searchTerm
 */
router.post('/search',async(req,res)=>{
    try {
        const locals={
            title:"Search",
            description:"A Simple Blog Website."
        }

        let searchTerm=req.body.searchTerm;
        const searchNoSpecialChar=searchTerm.replace(/[^a-zA-Z0-9]/g,"");
        const data= await Post.find({
            $or : [
                {title: {$regex: new RegExp(searchNoSpecialChar,'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar,'i')}}
            ]
        });

        res.render("search", {
            data,
            locals,
            currentRoute: '/'
        });
        
    } catch (error) {
        console.log("Error in getting the posts: ", error);
    }
});

router.get('/about',(req,res)=>{
    res.render('about',{
        currentRoute: '/about'
    });
});
router.get('/contact',(req,res)=>{
    res.render('contact',{
        currentRoute: '/contact'
    });
});

module.exports=router;