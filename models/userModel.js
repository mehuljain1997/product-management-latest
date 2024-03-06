import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    name: {type: String, required: true, trim: true},
    // tc: {type: Boolean, required: true },
    created_date: { type: Date, required: true},
    role: {type: String, required: true, trim: true}
})


const userModel = mongoose.model('users_details', userSchema)

export default userModel

