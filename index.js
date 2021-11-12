const Koa = require('koa');
const KoaRouter = require('koa-router');
const router = new KoaRouter();
const server = new Koa();
const json = require('koa-json')
const path = require('path');
const render = require('koa-ejs');
const views = require('koa-views');
const koaNunjucks = require('koa-nunjucks-2');
const nunj = require('nunjucks');
const { movieSchema } = require('./validations/joi_validation')
const { findMovieSchema } = require('./validations/joi_validation')
//Initializing Environment Variables and other middlewares
require('dotenv').config();
router.use(json())
const override = require('koa-methodoverride');
const parser = require('koa-bodyparser');

//Connecting DB  with Mongoose
const mongoose = require('mongoose');
const db = mongoose.connection;
const host = process.env.host;
const dbupdate = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(host, dbupdate);
db.on('connected', () => console.log('Connected to Mongo'));
db.on('disconnected', () => console.log('Mongo is Disconnected'));
db.on('open', () => console.log('Connection Made'));
db.on('error', (err) => console.log('Error, DB not connected'));

//Model Schema
const Movies = require('./model/movies.js');
const FindMovie = require('./model/findMovie.js');
const movieController = require('./controller/moviesController');
let title =  'ABC'
//Next character
function nextCharacter(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
    
}

function searchInput(input){
    console.log(title);
    title = input;
    console.log(title);
}

function asignTitle(event){
    title = event.target.value;
    console.log(title);
}

//Main Function
async function runChallenge(titleInput){
    ////Part 1: Get the user input and GET the API data to use the function findOne
    // this functin you need to pass the full title so it doesn't insert the document twice. 
    let response = await movieController.getApiData(titleInput);
    let responseMovie = await movieController.isTitleInDB(response.data.Title);
    let movieFound;
    let filter;
    if (responseMovie == false){ // If it is not in BD, i insert it in the BD
        
        await movieController.assignDataValue(response.data)
        console.log("Succesfully inserted on BD!");
        //Finally we get the information from the BD and this is the end of PART 1.
        filter = { title: response.data.Title} 
    }
    try{
        movieFound = await Movies.findOne(filter).orFail();
    }catch(error){

        console.log(error)
    }
    return movieFound;

}




//Get All Movies from DDBB
router.get('/', async (ctx, next) => {
    try {
        return Movies.find({}, async (error, results) => {
            await ctx.render('index', {
                posts: results
            })
        }).clone()
    }catch(error) {
         console.log(error)
    }
});
//Search Movie in BD 
router.post('/', async (ctx, next) => {
    try{
        const mov = await runChallenge(ctx.request.body.title);
        console.log(mov);
        ctx.body = mov;
    }catch(e){
        console.log(e);
    }
});

router.post('/search', async (ctx, next) => {
    try {
      await findMovieSchema.validateAsync(ctx.request.body).catch(reason => {
        throw new ErrorHandler(422, reason);

      });
      const findMov = new FindMovie();
      //Get the full Title of the Search in order to use findOne Function 
      let response = await movieController.getApiData(ctx.request.body.title);
      findMov.title  = response.data.Title
      findMov.find  =ctx.request.body.find
      findMov.replace  =ctx.request.body.replace
      const newStr = await movieController.findPhraseAndReplace(findMov);
      ctx.body = 'Plot Modificado: '+ newStr;
      return ctx.response.status(200).send();
    } catch (e) {
      next(e);
    }
  });


//Nunjucks
nunj.configure('./views', {autoescape: true});

//Router Middleware
server.use(override('_method'));
server.use(parser());
server.use(koaNunjucks({
    ext: 'njk',
    path: path.join(__dirname, 'views'),
    nunjucksConfig: {
      trimBlocks: true
    }
  }));
server.use(router.routes());   



//Listener on Port 3000
server.listen(3000, () => console.log("Server Started"));



