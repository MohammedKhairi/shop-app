const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userSchema=new Schema
({
    // "u_name","u_pass","date,u_state"
    u_name:{type:String,required:true},
    u_email:{type:String,required:true},
    u_pass:{type:String,required:true},
    u_date:{type:String,required:true},
    u_state:{type:String,required:true}
});
const categorySchema=new Schema
({
    // "c_name"
    c_name:{type:String,required:true},

});
const productSchema=new Schema
({
    //" p_name","p_price","p_cate","p_processor","p_camera_f","p_camera_b","p_date","p_rate,p_screen,p_color"
    p_name:{type:String,required:true},
    p_price:{type:String,required:true},
    p_cate:{type:Schema.Types.ObjectId,ref:'category'},
    p_processor:{type:String,required:true},
    p_camera_f:{type:String,required:true},
    p_camera_b:{type:Array,required:true},
    p_date:{type:Date,default:Date.now},
    p_rate:{type:String,required:true},
    p_screen:{type:String,required:true},
    p_color:{type:Array,required:true},
    p_disc:{type:String,required:true}

});
const favoriteSchema=new Schema
({
    //" user_id","product_id""
    user_id:{type:Schema.Types.ObjectId,ref:'users'},
    product_id:{type:Schema.Types.ObjectId,ref:'products'}
});
const cardSchema=new Schema
({
    //" user_id","product_id""
    user_id:{type:Schema.Types.ObjectId,ref:'users'},
    product_id:{type:Schema.Types.ObjectId,ref:'products'},
    order_n:{type:Schema.Types.Number,ref:'products'}
});
const commentsSchema=new Schema
({
    //" user_name","product_id"."comment"
    product_id:{type:Schema.Types.String,required:true},
    user_name:{type:Schema.Types.String,required:true},
    comment:{type:Schema.Types.String,required:true},
    date:{type:Schema.Types.Date,default:Date.now},
});
const Users=mongoose.model('users',userSchema,'users');
const Product=mongoose.model('products',productSchema,'products');
const Category=mongoose.model('category',categorySchema,'category');
const Favorite=mongoose.model('favorite',favoriteSchema,'favorite');
const Card=mongoose.model('card',cardSchema,'card');
const Comments=mongoose.model('comments',commentsSchema,'comments');

const mySchemas={
    'Users':Users,
    'Product':Product,
    'Category':Category,
    'Favorite':Favorite,
    'Card':Card,
    'Comments':Comments
};
module.exports=mySchemas;

