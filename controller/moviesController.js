
const path = require('path');
const render = require('koa-ejs');
const views = require('koa-views');
const nunj = require('nunjucks');
const override = require('koa-methodoverride');
const parser = require('koa-bodyparser');
const https = require('https');
const Movies = require('../model/movies.js');
const axios = require('axios');
//Initializing Environment Variables
require('dotenv').config();
const mongoose = require('mongoose');

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

//Functions to export to index.js 
module.exports = {
    //Method to get the data from the API using title as parameter and store it in DB if it isn't on te DB.
    getApiData: async function (title){
        const apiUrl = process.env.api_root + title
        return await axios.get(apiUrl)
        .catch(error => {
            console.log(error);
        });
    },

    isTitleInDB: async function (titleParm){
        const filter = { title: titleParm };
        try{
            const movieFound = await Movies.findOne(filter).orFail();
            return movieFound;
        }catch(error){
            return false;
        }       
    },

    assignDataValue: async function (data){
        const upData = new Movies();
        upData.title = data.Title;
        upData.year = data.Year;
        upData.released = data.Released;
        upData.genre = data.Genre;
        upData.director = data.Director;
        upData.actors = data.Actors;
        upData.plot = data.Plot;
        upData.ratings = data.Ratings;
        await upData.save();

    },

    findPhraseAndReplace: async function (obj){ //Object is consider to have 3 parameters: Title, Phrase to find, Phrase to replace
        try {
            //Find the Movie
            const filter = { title: obj.title };
            const movieFound = await Movies.findOne(filter).orFail();
            //Replace string 
            const str = movieFound.plot;
            const newStr = replaceAll(str, obj.find, obj.replace);// String.prototype.replaceAll is not longer supported in node js, i created a function
            const update = { plot: newStr };

            // 'doc' is the document before update was applied
            let doc = await Movies.findOneAndUpdate(filter, update);

            // 'doc' is the document after update was applied
            doc = await Movies.findOne(filter);

            //return new string
            return doc.plot;
        }catch (e){
            console.log
        }
    },

    

}




