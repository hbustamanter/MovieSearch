const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childSchema = new Schema({
    source: String,
    value: String,
});

const parentSchema = new Schema({
    title: String,
    year: Number,
    released: Date,
    genre: String,
    director: String,
    actors: String,
    plot: String,
    ratings: [childSchema]

});

const Movies = mongoose.model('blogposts', parentSchema);
module.exports  = Movies;