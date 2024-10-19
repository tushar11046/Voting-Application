const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    aadhar:{
        type:Number,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isvoted:{
        type:Boolean,
        required:true,
        default:false
    }
});

userSchema.pre('save',async function(next){
    const user = this;

    // Hash the password only if it has been modified or is new
    if(!user.isModified('password')) return next();

    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        const hashedPassword=await bcrypt.hash(user.password,salt);

        // Override the plain password with the hashed one
        user.password=hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword=async function(candidatePassword){
    try{
        //Use bcrypt to compare the provided password with the hashed password
        const isMatch=await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User=mongoose.model('User',userSchema);
module.exports=User;