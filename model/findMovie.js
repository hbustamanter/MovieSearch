const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const parentSchema = new Schema({
    title: String,
    find: String,
    replace: String,
});

const FindMovie = mongoose.model('findMovie', parentSchema);
module.exports  = FindMovie;