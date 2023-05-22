const mongoose = require("mongoose")

const AsignaturaSchema = new mongoose.Schema (
    {
        name: {type: String, required: true, unique: true, trim: true},
        teacher: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        alumn: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
        year: {type: Number, required: true, trim: true},
        nota: [{type: mongoose.Schema.Types.ObjectId, ref: "Nota"}]

    },
    {
        timestamps: true
    }
)

const Asignatura = mongoose.model("Asignatura", AsignaturaSchema)
module.exports = Asignatura