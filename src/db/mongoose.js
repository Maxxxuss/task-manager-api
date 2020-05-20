const mongoose = require ('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify:false, 
    useCreateIndex: true
})



// const me = new User({
//     name: 'HAckePeter',
//     email: 'mail.mail@mail.com',
//     password: 'ddd'
// })

// me.save().then((me) => {
//     console.log(me)
// }).catch((error)=> {
//     console.log(error)
// })

// überführt in Mogoose.js
    // const Task = mongoose.model('Taks',{    
    //     description: {
    //         type: String,
    //         required: true, 
    //         trim: true

    //     }, 
    //     complete: {
    //         type: Boolean,
    //         default: false


    //     }
    // })


// const task = new Task({
//     description: 'Learning irgendwas',
//     complete: false
// })

// task.save().then((task) => {
//     console.log(task)
// }).catch((error)=> {
//     console.log(error)
// })