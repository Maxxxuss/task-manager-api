const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const  Task = require ('./task')

const userSchema = new mongoose.Schema({  // SChema zur nutzen von Middelware
    name: {
        type: String, 
        required: true, // name ist erforderlich
        trim: true   //entfernt Leerzeichen 

    }, 

    email: { 
        type: String,
        unique: true, // Login nur einmal mit eMail adresse
        require: true, 
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error ('eMail gemäß npm Validator.js ungültig ')
            }
        }

    },
    age: {
        type: Number, 
        default: 0, 
        validate(value) {
            if (value < 0 ) {
                throw new Error ('Alter muss postiv sein ')
            }
        }

    }, 
    password: {
        type: String, 
        require: true,
        minlength:7, 
        trim: true, 
        validate(value) {
            if (value.toLowerCase().includes('password') ) {
            throw new Error('Mindesten 6 Buchstaben erforderlich ')}
        } 
    },
    tokens: [{
        token: {
            type: String, 
            require: true
        }
    }], avatar: {
        type: Buffer
    }

}, {
    timestamps: true
})

userSchema.virtual('tasks', {   //virtuell, weil die Daten nicht in der Datenbankg geschrieben werden sondern Mogosse helfen Datenrelation herzustellen
    ref: 'Task',            //Task
    localField: '_id',      //User
    foreignField: 'owner'   //Task
     
})

// userSchema.methods.getPublicProfile = function () { // erste möglichkiet best. Nutzeradaten auszublenden
userSchema.methods.toJSON = function () {       // 2. möglichkeit
    const user = this       
    const userObject = user.toObject()

    delete userObject.password      //keine anzeige mehr von Paswort und tokens 
    delete userObject.tokens
    delete userObject.avatar 

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString() }, process.env.JWT_SECRET )

    user.tokens = user.tokens.concat ({token})
    await user.save()
    
    return token 

}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error ('kein Nutzer gefunden ')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error ('falsche PWD Eingabe ')
    }

    return user

}

userSchema.pre('save', async function (next){
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)

    }  

    next()
})

// User-task löschen, wenn nutzer gelöscht wird 

userSchema.pre('remove', async function(next){
    const user = this 
    await Task.deleteMany({owner: user._id})

    next()
})

const User = mongoose.model('User', userSchema)




module.exports = User 