const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const Task=require('./models/task')
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
const app=express()
const port=process.env.PORT || 3000
/*app.use((req,res,next)=>{
    if(req.method==='GET')
    {
       res.send('GET requests are disabled')
    }
    else{
    next()
    }
})*/
//parsing incoming json to an javascript object
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
// run the server on a port number
app.listen(port,()=>{
    console.log('Server is running on port '+port)
})

const main=async()=>{
    const user=await User.findById('60a270cf00ed003d2487733e')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
main()