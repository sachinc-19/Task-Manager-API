const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const router=new express.Router()


router.get('/users/me',auth,async(req,res)=>{

    res.send(req.user)
   /* User.find({
        name: 'Himanshu'
    }).then((users)=>{
       res.send(users)
    }).catch((e)=>{
       res.status(500).send(e)
    })*/
})
router.post('/users', async(req,res) => {
    //create a new user instance
   const user= new User(req.body)

   try{
    await user.save()
    const token=await user.generateAuthToken()
    res.status(201).send({user,token})
   }catch(e){
    res.status(400).send(e)
   }
   // if success store in database else show error
   /*user.save().then(()=>{
res.status(201).send(user)
   }).catch((e)=>{
        res.status(400).send(e)
   })*/
})
router.post('/users/login',async(req,res)=>{
    try{
          const user=await User.findByCredentials(req.body.email,req.body.password)
          const token=await user.generateAuthToken()
          res.send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})
router.post('/users/logout',auth,async(req,res)=>{
  try{
      req.user.tokens=req.user.tokens.filter((token)=>{
          return token.token!=req.token
      })
      await req.user.save()
      res.send()
  }catch(e){
      res.status(500).send(e)
  }
})
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch{
        res.status(500).send(e)
    }
})
router.patch('/users/:id',async(req,res)=>{
    const _id=req.params.id;
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidoperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidoperation)
    {
        res.status(404).send('invalid')
    }
    try{

        const user=await User.findById(_id)
        updates.forEach((update)=>user[update]=req.body[update])
        await user.save()
       // const user=await User.findByIdAndUpdate(_id,req.body,{new: true,runValidators: true})
        
        if(!user){
            return res.status(404).send()
        }
        res.status(201).send(user)
    }catch(e)
    {
        res.status(400).send(e)
    }
})
router.delete('/users/me',auth,async(req,res)=>{
    try{
        //const user=await findByIdAndDelete(req.user._id)
        //if(!user)
       // {
          //  res.status(404).send()
     //   }
     await req.user.remove()
       // res.status(201).send(user)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})
module.exports=router