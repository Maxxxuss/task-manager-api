// CRUD: Create Read Update Delete

const {MongoClient, ObjectID} = require('mongodb') //vereinfachte Schreibweise für:
        // const mongodb = require('mongodb')
        // const MongoClient = mongodb.MongoClient
        // const ObjectID = mongodb.ObjectID

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager' 

// const id = new ObjectID()
// console.log(id.id.length)
//     // console.log(id.getTimestamp())
// console.log(id.toHexString().length)


MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
    if (error){
        return console.log('Keine Verbindung zur Mongo DB')
    } 
    console.log('verbindung hergestellt mit Mongo DB')

    const db = client.db(databaseName)
    // CREATE, schreiben von Daten
        // db.collection('users').insertOne({
        //     // _id: id, 
        //     name:'Klaus', 
        //     alter: 88
        // }, (error, result)=>{
        //     if (error) {
        //     return console.log('User konnte nicht hinzugefügt werden')
        // }
        // console.log(result.ops)  // für api siehe Monod-Webseite -> (MongoClient) Collection-> Methods -> insertOne  

        // })

        // db.collection('users').insertMany([
        //     {
        //         name:'Hacke', 
        //         age:34
        //     }, {
        //         name:'Ute', 
        //         age:33
        //     }
        // ], (error, result)=> {
        //     if (error)  {
        //         return console.log('Nutzer konnten nicht hinzugefügt werden')
        //     }
        //     console.log(result.ops)   
          // })

        // db.collection('task').insertMany([
        //     {
        //         description: 'Clean',  
        //         complete: true
        //     }, {
        //         description: 'erneut prüfen',
        //         complete:false
        //     }
        // ], (error, result) => {
        //     if (error) {
        //         return console.log('Daten hinzugefügt')
        //     }
        //     console.log (result.ops)
        // })

    // Read
        // db.collection('users').findOne({name:'Hacke'}, (error, user) => {   // Suche ncah Object ID über ... _id: new ObjectID("5eb925539dae701b90b1a7ab")
        //     if (error) {
        //         return console.log('Suche konnte nicht durchgeführt werden')
        //     }
        //     console.log(user)
        // })

        // db.collection('users').find({alter:27}).toArray((error, users)=>{   //rückgabe ist ein Corser 
        //     console.log(users)

        // })

        //     db.collection('users').find({alter:27}).count((error, count)=>{
        //         console.log(count)
        // }) 

    // Update
        // // const updatePromise = db.collection('users').updateOne({  //ausführliche PRomiseSchreibweise 
        //    db.collection('users').updateOne({  //Vereinfachte Promise-Schreibweise 

        //     _id: new ObjectID ("5eb8fb8651434e3954e59a4c")
        // }, {
        //     $set:{
        //         name:'Fred'},
        //      $inc: {
        //         alter: 1      // zaählt age um 1 hoch
        //         }
        //     })
        //     .then((result) => {     //Vereinfachte Promise-Schreibweise 

        // // updatePromise.then((result) => {      //ausführliche PRomiseSchreibweise
        //     console.log(result)
        // }).catch((error)=> {
        //     console.log(error)
        // })

    // delete
        db.collection('users').deleteMany({
            age: 1
        }).then( (result) => {
            console.log(result)
        }).catch((error)=>{
            console.log(error);
            
        })

        db.collection('users').deleteOne({
            alter:88
        }).then( (result) => {
            console.log(result)
        }).catch((error)=>{
            console.log(error);
            
        })
        
})