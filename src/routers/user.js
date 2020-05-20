const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()



router.post('/users', async (req, res) => {
    const user = new User (req.body)  //req.Body ... Zusammenführung des Users über den Daten-Post von Postmann mit User-Verification
    
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(e-400).send(e)
    }
   
})

router.post('/users/login', async (req, res) => {
    console.log(req.body)
    // console.log(res)
    // console.log(User.req.body)
    // console.log(res.body.password)
    
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // res.send({user: user.getPublicProfile(), token})  // 1. Möglichkeit, bestimmte Benutzerdaten nicht anzuzeigen 
        res.send({user, token})    // 2. Möglichkeit

    } catch (e) {
        res.status(400).send()
    }

})

router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token )=>{
            return token.token !== req.token
        })
        await req.user.save()

    } catch (e) {
        res.status(500).send()
        
    }
 
})

router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send()
        
    }
 
})

router.get('/users/me', auth, async (req, res) => {
    // router.get('/users/me', async (req, res) => {


    // // const users = new User(req.body)

    //zeigt alle Nutzer an: 
        // try{
        //     const users = await User.find({})
        //     res.send(users)

        // } catch(e) {
        //     res.status(500).send()
        // }
    // zeigt Token-Nutzer an 
    res.send(req.user)
})


// mit der zeit überflüssig geworden
    // router.get('/users/:id', async (req, res)=> {
    //     const _id = req.params.id
    //     try{
    //         const users = await User.findById (_id)
    //         if (!users) {
    //             return res.status(404).send()
    //         }
    //         res.send(users)
    //     } catch(e) {
    //         res.status(500).send()
    //     }

    // })

router.patch ('/users/me', auth, async(req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidateOperations = updates.every((update)=> allowedUpdates.includes(update)) //{
    //     return allowedUpdates.includes(uldate)
    // })

    if (!isValidateOperations) {
        return res.status(400).send({error: 'Ungültigesss Update'})
         
    }

    try {      
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        
        // Hashed Save des Passworts
            // const user = await User.findById(req.user.id)
            updates.forEach((update) => req.user [update] = req.body[update])
            await req.user.save()


        // if (!user) {
        //     return res.status(404).send()
        
        // } 
        
        res.send(req.user)

    } catch (e) {
        res.status(400).send()

        
    }
})


router.delete('/users/me',auth ,async (req, res)=> {    //auth besagt hier, dass eine Atentifizierung für das Löschen des Nutzers erforderlich ist 
    try {
        // const user = await User.findByIdAndDelete(req.params.id)  
        const user = await User.findByIdAndDelete(req.user._id) //Löschen des USers durch die mittelware

            
            // if(!user) {
            //     return res.status(404).send()
            // }

            await req.user.remove()

            res.send(user)
    } catch (e) {
        res.status(500).send()
        
    }
})

const upload =  multer({
    // dest:'avatar', // lokale SPiecherung 
    limits: {
        fileSize: 1000000
    }, 
    fileFilter(req, file, cb){
        // if (!file.originalname.endsWith('.pdf')) {
            if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) { // siehe regularexpressiones    ...$ bedeutet dass die bedingung (nach doc bzw docx zu suchen) am ende kommt 
            return cb(new Error('Datei muss eine jpg, png, jpeg datai sein'))
            }
            cb(undefined, true)
    }
 })



router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{  //'upload' muss auch genauso in postman unter fom-data als KEY eingetragen werden

        const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
        // req.user.avatar = req.file.buffer
        req.user.avatar = buffer



        await req.user.save()
        res.send()
    }, (error, req, res , next)=> {
        res.status(400).send({error: error.message})
         
    }) 
  
    router.delete('/users/me/avatar', auth,  async (req, res)=>{  //'upload' muss auch genauso in postman unter fom-data als KEY eingetragen werden
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res , next)=> {
    res.status(400).send({error: error.message})
     
}) 

router.get('/users/:id/avatar', async(req, res)=> {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)


    } catch (e) {
        res.status(404).send()
        
    }
})


module.exports = router