const express = require('express')
require ('./db/mongoose')   // Aufbau der Verbindung zu MongoDB-Datenbak 
// const User = require('./models/user') //Vorgabe/Validation des Users
// const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require ('./routers/task')
// const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
// const port = process.env.PORT || 3000
const port = process.env.PORT



app.use((req, res, next) => {           //middelware
    console.log(req.methode, res.path)
    next()
})
 


app.use(express.json()) // erhalten Daten von Postmann
app.use(userRouter)
app.use(taskRouter)




// Vereinfachte Schreibweise {
 {

    // app.post('/users', (req, res) => {
    //     const user = new User (req.body)  //req.Body ... Zusammenführung des Users über den Daten-Post von Postmann mit User-Verification

    //     user.save().then(()=> {
    //         res.status(201).send(user)

    //     }).catch((e)=>{
    //         res.status(e-400)
    //         res.send(e) 
    //     })

    //     // console.log(req.body)   // erhalten von Use Daten vom Postmann
    //     // res.send('testing')
    // })


    // app.get('/users', (req, res)=> {
    //     User.find({}).then((users)=>{           //User.find({}) -> listet alle DB einträge in Users auf 
    //         res.send(users)
    //     }).catch((e)=> {
    //         res.status(500).send()
    //     })
    // })

    // app.get('/users/:id', (req, res)=> {
    //     const _id = req.params.id

    //     User.findById(_id).then((user)=>{
    //         if (!user) {
    //             return res.status(404).send()
    //         }
    //         res.send(user)

    //     }).catch((e)=>{
    //         res.status(500).send

    //     })
    // })

    // app.post('/tasks', (req, res) => {
    //     const task = new Task (req.body)  

    //     task.save().then(()=> {
    //         res.status(201).send(task)

    //     }).catch((e)=>{
    //         res.status(e-400).send(e) 

    //     })

    // })

    // app.get('/tasks', (req, res)=> {
    //     Task.find({}).then((tasks)=>{           //User.find({}) -> listet alle DB einträge in Users auf 
    //         res.send(tasks)
    //     }).catch((e)=> {
    //         res.status(500).send()
    //     })
    // })

    // app.get('/tasks/:id', (req, res)=> {
    //     const _id = req.params.id

    //     Task.findById(_id).then((task)=>{
    //         if (!task) {
    //             return res.status(404).send()
    //         }
    //         res.send(task)

    //     }).catch((e)=>{
    //         res.status(500).send

    //     })
    // })
}
// Ändern der SChreibweise in async Schreibweise 
{
    // app.post('/users', async (req, res) => {
    //     const user = new User (req.body)  //req.Body ... Zusammenführung des Users über den Daten-Post von Postmann mit User-Verification
        
    //     try {
    //         await user.save()
    //         res.status(200).send(user)
    //     } catch(e) {
    //         res.status(e-400).send(e)
    //     }
    
    // })

    // ....
}

// Passwrter verschlüseln 

const myFunction = async () => {
    const token = jwt.sign({_id:'aaab22'}, 'meinPWDTest', {expiresIn:'7 day'})
    // console.log(token)

    const data = jwt.verify(token, 'meinPWDTest' )
    console.log(data)
    

//     const password = 'hackePeter'
//     const hashedPassword = await bcrypt.hash(password, 8 )

//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare('hackePeter', hashedPassword)
//     console.log(isMatch)
}

myFunction()



app.listen(port, ()=>{
    console.log ('Verbindung hergetellt mit Port '+port)
})


 
// Verbindung zwischen Task und User VIRTUELLE herstellen
    //  const Task = require('./models/task')
    //  const User = require('./models/user')

    //  const main = async () => {
    //     //  Herauslesen des TAsk OWners 
    //         //  const task = await Task.findById('5ec17d12eb75751bb89d59a8')
    //         //  await task.populate('owner').execPopulate()   //übergibt den USer, der den Task erstellt hat ... Löschen dieser Zeile übergibt an task.owner dem Task 
    //         //  console.log(task.owner)

    //         const user = await User.findById('5ec179ae282a4d20e8a97ab8')   //Id des Owners im TAsk
    //         await user.populate('tasks').execPopulate()
    //         console.log(user.tasks)
    //  }

    //  main()

// File Upload mit Multer 
    // const multer = require('multer')
    // const upload = multer({
    //     dest: 'images',  //wohin die daten geladen werden
    //     limits: {
    //         fileSize:1000000
    //     }, 
    //     fileFilter(req, file, cb){
    //         // if (!file.originalname.endsWith('.pdf')) {
    //             if (!file.originalname.match(/\.(doc|docx)$/)) { // siehe regularexpressiones    ...$ bedeutet dass die bedingung (nach doc bzw docx zu suchen) am ende kommt 
    //             return cb(new Error('Datei muss eine Word datai sein'))
    //         }

    //         cb(undefined, true)


    //         // cb(new Error('Datei muss eine PDF datai sein'))
    //         // cb(undefined, true)
    //         // cb (undefined, false )

    //     }
    // })

    
    // app.post('/upload', upload.single('upload'), (req, res)=>{  //'upload' muss auch genauso in postman unter fom-data als KEY eingetragen werden
    //     res.send()
    // }, (error, req, res , next)=> {
    //     res.status(400).send({error: error.message})
         
    // }) 