
const Joi = require('@hapi/joi');

const movieSchema = Joi.object().keys({
    title: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2020),
    released: Joi.date().raw(),
    genre: Joi.string(),
    director: Joi.string(),
    actors: Joi.string(),
    plot: Joi.string(),
    ratings: Joi.array().items(Joi.object({
        source: Joi.string(),
        value: Joi.string()
    }))
});
const findMovieSchema = Joi.object().keys({
    title: Joi.string().required(),
    find: Joi.string().required(),
    replace: Joi.string().required(),
})

/* try {
    const value = await movieSchema.validateAsync({
        title: 'Hola 123',
        year: 2010,
        released: '04 Jan 2005',
        genre:
    })
}catch (err){

}*/

module.exports = {
    movieSchema,
    findMovieSchema
}