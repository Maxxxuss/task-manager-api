const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()



router.post('/tasks',auth, async (req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body, 
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
        
    } catch (e) { 
        res.status(400).send(e)  
    }
})

// Get / tasks?completet=true
// Get / tasks?limit=10&Skip=2
// Get / tasks?sortBy=createdAt:desc  //oder asc mgl 
router.get(('/tasks'), auth, async (req, res) => {
    // const tasks = new Task(req.body)

    const match = {}  
    const sort = {}

    if (req.query.complete) {
        match.complete = req.query.complete === 'true'    // kann nicht direkt miteinerader vergleichen werden, weil rückgabe wert (true / false) ein String und kein Boolean ist
    }
    
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort [parts[0]] = parts[1] === 'desc' ? -1 : 1 // 'desc' ? -1 : 1  pürft ob desc vorhanden, dann -1 sonst 1  
    }


    
    try {
        // zeigt alle Task an 
            // const tasks = await Task.find({})
        
        // 1. Möglichleit nur Task eines Users anzuzeigen
            // const tasks = await Task.find({ owner: req.user._id})

        // 2. Möglichleit nur Task eines Users anzuzeigen
              await req.user.populate({
                  path: 'tasks', 
                  match,
                  options: {
                    limit: parseInt(req.query.limit ), ///max anzahl an ergebnisse auf einer seite 
                    skip: parseInt(req.query.skip),    // Skip page mit maximaler anzeige 
                    sort//: {
                    //       createdAt: -1  // neuste zuerst 
                    //       //completed: -1 
                    //   }  
                  
                    }
                }).execPopulate()
             res.send(req.user.tasks)

        // res.send(tasks)
        
    } catch (e) {
        res.status(500).send(e)
        
    }
})


router.get('/tasks/:id', auth, async (req, res)=> {

    const _id = req.params.id
    try {
        // const task = await Task.findById(_id)   
        const task = await Task.findOne({_id, owner: req.user._id})   

        if (!task) {
                return res.status(404).send()
    } 
    res.send(task)
}catch (e) {
        res.status(500).send(e)
    }

})

router.patch ('/tasks/:id', auth, async(req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'complete']
    const isValidateOperations = updates.every((update)=> allowedUpdates.includes(update)) //{
    //     return allowedUpdates.includes(uldate)
    // })

    if (!isValidateOperations) {
        return res.status(400).send({error: 'Ungültigesss Update'})
         
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findById(req.params.id)
       
        // const tasks = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        
        if (!task) {
            return res.status(404).send()
           
        } 
        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()
        
        res.send(task)

    } catch (e) {
        res.status(400).send()

        
    } 
})

router.delete('/tasks/:id',auth, async (req, res)=> {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        // const task = await Task.findByIdAndDelete(req.params.id)
            
            if(!task) {
                return res.status(404).send()
            }

            res.send(task)
    } catch (e) {
        res.status(500).send()
        
    }
})


module.exports = router