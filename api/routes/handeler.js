const express=require('express');
const router=express.Router();
const Schema=require('../models/Schemas.js');
// =========[Home Routwer]============
const limit=4;

router.get('/homepages',async(req,res)=>{
    const product=Schema.Product;
    const count_p=(await product.find({}).count())
    // const count_p=(await product.find({}).limit(limit*1).skip((page-1)*limit).count())
        if(count_p)
        {
            res.end(JSON.stringify(count_p));
        }
        else
        {
            res.end();
        }
});
router.get('/home',async(req,res)=>{
    const product=Schema.Product;
    const page=parseInt(req.query.page);
    ///console.log("p"+page)
    await product.find({}).limit(limit*1).skip((page-1)*limit).populate('p_cate').exec((err,productdata)=>{
        if(err)throw err;
        if(productdata)
        {
            res.end(JSON.stringify(productdata));
            //console.log('home access ok');
        }
        else
        {
            res.end();
        }
    })
});
router.get('/categorypages/:id',async(req,res)=>{
    if(!req.params.id||req.params.id=="")
    {
        res.end();
    }
    const product=Schema.Product;
    const count_cate=(await product.find({p_cate:req.params.id}).populate('p_cate').count())
    //const count_c=(await product.find({}).limit(limit*1).skip((page-1)*limit).count())
        if(count_cate)
        {
            res.end(JSON.stringify(count_cate));
        }
        else
        {
            res.end();
        }
});
router.get('/getcategoryid/:id',async(req,res)=>{

    const category=Schema.Category;
    const name=req.params.id.toLowerCase();
    const c_id=(await category.findOne({"c_name":name}))
        if(c_id)
        {
            res.end(JSON.stringify(c_id));
        }
        else
        {
            res.end();
        }
});
router.get('/getproduct/:name',async(req,res)=>{
    const name=req.params.name;
    //console.log("name"+name)
    const product=Schema.Product;
    const p_count= await product.findOne({"p_name":name}).count();
    if(p_count>0)
    {
        const p_data= await product.findOne({"p_name":name}).populate('p_cate').exec((err,productdata)=>{
            if(err)throw err;
            if(productdata)
            {
                res.end(JSON.stringify(productdata));
            }
            else
            {
                res.end(JSON.stringify({state:false}));
            }
        })
    }
    else
    {
        res.end(JSON.stringify({state:false}));
    }
    

});
router.get('/categoryhome/:id',async(req,res)=>{
    if(!req.params.id||req.params.id=="")
    {
        res.end();
    }
   // console.log("id::"+req.params.id)
    const product=Schema.Product;
    const page=parseInt(req.query.page);
    ///console.log("p"+page)
    await product.find({p_cate:req.params.id}).limit(limit*1).skip((page-1)*limit).populate('p_cate').exec((err,productdata)=>{
        if(err)throw err;
        if(productdata)
        {
            res.end(JSON.stringify(productdata));
            //console.log('home access ok');
        }
        else
        {
            res.end();
        }
    })
});
router.get('/category',async(req,res)=>{
    const category=Schema.Category;
    await category.find({}).exec((err,categorydata)=>{
        if(err)throw err;
        if(categorydata)
        {
           // console.log(categorydata);

            res.end(JSON.stringify(categorydata));
        }
        else
        {
            res.end();
        }
    })
});
router.get('/category_count/:name',async(req,res)=>{
    if(!req.params.name||req.params.name=="")
    {
        res.end();
    }
    console.log("name::"+req.params.name)
    //const category=Schema.Category;
    // await category.findOne().populate(req.params.name).count().exec((err,category_c)=>{
    //     if(err)throw err;
    //     if(category_c)
    //     {
    //         console.log("data"+category_c);
    //         res.end(JSON.stringify(category_c));
    //     }
    //     else
    //     {
    //         res.end();
    //     }
    // })
});
router.get('/search/:name',async(req,res)=>{
    const product=Schema.Product;
    if(!req.params.name||req.params.name=="")
    {
        res.end();
    }


    var regex=new RegExp(req.params.name,'i')
   const data_s= await product.find({p_name:regex}).populate('p_cate').exec()
  
        if(data_s)
        {
            res.end(JSON.stringify(data_s));
            //console.log('home access ok');
        }
        else
        {
            res.end();
        }
   
});
/////////[Sigup]///////////
router.post('/addUser',async(req,res)=>{
    if(Object.keys(req.body).length ===4)
    {
        const user=Schema.Users;
        const u_count= await user.findOne({u_email:req.body.email}).count();
        const backMessage={message:"",state:""};

        //console.log("count"+u_count);
        if(u_count>=1)
        {
            backMessage.message="You are Signup with this Email pless Login";
            backMessage.state="ok";
            res.end(JSON.stringify(backMessage));
        }
        else
        {
             const user=
            {
                u_name:req.body.username,
                u_email:req.body.email,
                u_pass:req.body.password,
                u_date:req.body.date,
                u_state:"0"
            };
            const newUser=  new Schema.Users(user);
                await newUser.save((err,newUserResult)=>{
                    if(err)
                    {
                        backMessage.message="something happend pless try agen";
                        backMessage.state="error";
                        res.end(JSON.stringify(backMessage));
                    }
                    else
                    {
                        backMessage.message="Signup sucess Plese Login";
                        backMessage.state="good";
                        res.end(JSON.stringify(backMessage));
                    }
        
                });  
        }
    }
    else
    {
        console.log("keys errors");
    }
   
    
});
/////////[Login]///////////
router.post('/getUser',async(req,res)=>{

        const user=Schema.Users;
        const user_info= await user.findOne({u_email:req.body.uemail,u_pass:req.body.upass}).exec();
        ///console.log(user_info);
        if(user_info)
        {
            res.end(JSON.stringify(user_info));
           
        }
        else
        {
            const backMessage={message:"",state:true};
            backMessage.message="Your Email Or Password Incorrect";
            res.end(JSON.stringify(backMessage));
        }
   
});
/////////[User Profile]///////////
router.get('/userprofile/:id',async(req,res)=>{
    const user_id=req.params.id;
    const user=Schema.Users;
    const user_info= await user.findOne({_id:user_id}).exec();
    ///console.log(user_info);
    if(user_info)
    {
        res.end(JSON.stringify(user_info));
    }
    else
    {
        const backMessage={message:"",state:true};
        backMessage.message="Your Email Or Password Incorrect";
        res.end(JSON.stringify(backMessage));
    }

});
/////////[Update Profile]///////////
router.post('/update_profile/:id',async(req,res)=>{
    const user_id=req.params.id;
   // console.log("id="+user_id)
   // console.log("data="+Object.keys(req.body).length)
    if(Object.keys(req.body).length ===6&&user_id)
    {
        //console.log(req.body)
        const user=Schema.Users;
        const user_date=
        {
            u_name:req.body.u_name,
            u_email:req.body.u_email,
            u_pass:req.body.u_pass,
            u_date:req.body.u_date,
        };
    const backMessage={message:"",state:true};
        await user.updateOne({u_state:'0'},user_date,{_id:user_id}).exec((err,ndb)=>{
            if(err)
            {
                console.log(err)
                backMessage.message="something happend pless try agen";
                backMessage.state=false;
                res.end(JSON.stringify(backMessage));
            }
            else
            {
                console.log(ndb)
                backMessage.message="Update you profile";
                backMessage.state=true;
                res.end(JSON.stringify(backMessage));
            }

        });  
        
    }
    else
    {
        console.log("keys errors");
    }
   
    
});
/////////[Get Favorite Product for user]///////////
router.get('/get_favorite/:id',async(req,res)=>{
    const id=req.params.id;
   // console.log("name"+id)
    const favorite=Schema.Favorite;
    await favorite.find({user_id:id}).populate('product_id').exec((err,favoritedata)=>{
        if(err)throw err;
        if(favoritedata)
        {
           // console.log(favoritedata)
            res.end(JSON.stringify(favoritedata));
        }
        else
        {
            res.end();
        }
    })

});
/////////[Add Favorite Product for user]///////////
router.post('/add_favorite',async(req,res)=>{
    if(Object.keys(req.body).length ===2)
    {
        const favor=Schema.Favorite;
        const favor_info= await favor.findOne(
            {
                user_id:req.body.user_id,
                product_id:req.body.product_id
            }
            ).count();
        const backMessage={message:"",state:""};
        ///console.log(user_info);
        if(favor_info>=1)
        {
            backMessage.message="The Product allready found in Favorite List";
            backMessage.state="error";
            res.end(JSON.stringify(backMessage));
        }
        else
        {

            const newFavorite=  new Schema.Favorite(req.body);
                await newFavorite.save((err,nnewFavoriteResult)=>{
                    if(err)
                    {
                        backMessage.message="something happend pless try again";
                        backMessage.state="error";
                        res.end(JSON.stringify(backMessage));
                    }
                    else
                    {
                        backMessage.message="The Product is add to Favorite List";
                        backMessage.state="ok";
                        res.end(JSON.stringify(backMessage));
                    }
        
                });  
        }
    }
    else
    {
        console.log("keys errors");
    }
   
    
});
/////////[Delete Favorite Product for user]///////////
router.delete('/delete_favorite/:id',async(req,res)=>{
    const id=req.params.id;
    //console.log(id)
    const favorite=Schema.Favorite;
    let back_message={}
   const favoritedata= await favorite.deleteMany({_id:id}).exec()
        if(favoritedata)
        {
           // console.log(favoritedata)
           back_message={
               state:"good",
               message:"The Product is Delete From List Sucess",
           };
            res.end(JSON.stringify(back_message));
        }
        else
        {
            back_message={
                state:"error",
                message:"Some Think Happend Pless try delete agine",
            };
             res.end(JSON.stringify(back_message));
        }
});
/////////[Get Card  for user]///////////
router.get('/get_card/:id',async(req,res)=>{
    const id=req.params.id;
   // console.log("name"+id)
    const card=Schema.Card;
    const card_info=await card.find({user_id:id}).populate('product_id').exec()
        if(card_info)
        {
           // console.log(favoritedata)
            res.end(JSON.stringify(card_info));
        }

});
/////////[Add Favorite Product for user]///////////
router.post('/add_card',async(req,res)=>{
    if(Object.keys(req.body).length ===3)
    {
        const card=Schema.Card;
        const card_info= await card.findOne(
            {
                user_id:req.body.user_id,
                product_id:req.body.product_id
            }
            ).count();
        const backMessage={message:"",state:""};
        ///console.log(user_info);
        if(card_info>=1)
        {
            backMessage.message="The Product allready found in Card List";
            backMessage.state="error";
            res.end(JSON.stringify(backMessage));
        }
        else
        {
            const newCard=  new Schema.Card(req.body);
                await newCard.save((err,newcardd)=>{
                    if(err)
                    {
                        backMessage.message="something happend pless try again";
                        backMessage.state="error";
                        res.end(JSON.stringify(backMessage));
                    }
                    else
                    {
                        backMessage.message="The Product is add to Card List";
                        backMessage.state="ok";
                        res.end(JSON.stringify(backMessage));
                    }
        
                });  
        }
    }
    else
    {
        console.log("keys errors");
    }
   
    
});
/////////[Delete Favorite Product for user]///////////
router.delete('/delete_card/:id',async(req,res)=>{
    const id=req.params.id;
   /// console.log(id)
    const card=Schema.Card;
    let back_message={}
   const carddata= await card.deleteMany({_id:id}).exec()
        if(carddata)
        {
           // console.log(favoritedata)
           back_message={
                state:"good",
               message:"The Product is Delete From List Sucess",
           };
            res.end(JSON.stringify(back_message));
        }
        else
        {
            back_message={
                state:"error",
                message:"Some Think Happend Pless try delete agine",
            };
             res.end(JSON.stringify(back_message));
        }
});
/////////[add Comment]///////////
router.post('/add_comment/:id',async(req,res)=>{
    if(Object.keys(req.body).length ===2)
    {
       /// console.log(req.body);
        const id=req.params.id;
        const backMessage={message:"",state:""};
             const comment_body=
            {
                user_name:req.body.username,
                comment:req.body.comment,
                product_id:id,
            };
            const newComment=  new Schema.Comments(comment_body);
                await newComment.save((err,newCommentResult)=>{
                    if(err)
                    {
                        backMessage.message="something happend pless try agen";
                        backMessage.state="error";
                        res.end(JSON.stringify(backMessage));
                    }
                    else
                    {
                        backMessage.message="Comment is add Success";
                        backMessage.state="good";
                        res.end(JSON.stringify(backMessage));
                    }
        
                });
    }
    else
    {
        console.log("keys errors");
    }
   
    
});
/////////[get comments]///////////
router.get('/get_comments/:id',async(req,res)=>{
    const id=req.params.id.toLocaleLowerCase();
    
    console.log("name"+id)
    const comment=Schema.Comments;
    const card_info=await comment.find({product_id:id}).exec()
        if(card_info)
        {
            //console.log(card_info)
            res.end(JSON.stringify(card_info));
        }

});
/////////[Update Card Order Value]///////////
router.post('/update_card/:id',async(req,res)=>{
    const id=req.params.id;
    if(Object.keys(req.body).length ===1&&id)
    {
        //console.log(req.body)
        const card=Schema.Card;
        const card_dats=
        {
            order_n:req.body.order_num,
        };
        const backMessage={message:"",state:""};
        const b_data=await card.updateOne({_id:id},card_dats,{_id:id}).exec()
            if(!b_data)
            {
                backMessage.message="something happend pless try agen";
                backMessage.state="error";
                res.end(JSON.stringify(backMessage));
            }
            else
            {
                backMessage.message="Update you Card";
                backMessage.state="good";
                res.end(JSON.stringify(backMessage));
            }
        
    }
    else
    {
        console.log("keys errors");
    }
   
    
});
module.exports = router;