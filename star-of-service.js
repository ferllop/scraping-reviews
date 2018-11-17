'use strict'

const puppeteer = require('puppeteer'),
    puppeteerConfig = require('./config.json')

const starOfService = async (url) => {
    let browser = await puppeteer.launch(puppeteerConfig);
    const page = await browser.newPage()

    await page.goto(url)

    //Vamos a la ultima review que hay cargada
    //y comprobamos si hay las mismas que las que dice el total de reseñas.
    //Si no las hay, repetimos
    const reviewSelector = '.profile-reviews__item'


    //Sacamos los datos de cada review y los metemos en un array de objetos.
    const minimumRating = 4
    const minimumCharInContent = 10

    const prohibitedNames = ['Lidia L.', 'Carmen M.', 'Deivid A.', 'Laura C.']

    let reviews = await page.evaluate((selector, minRating, minChars, noNames) => {
        let allReviews = []
        document.querySelectorAll(selector).forEach( review => {
            let rating = review.querySelector('.rating-stars').title

            let name = review.querySelector('.profile-reviews__title').innerText;
            name = name.toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')

            let content = review.querySelector('.profile-reviews__text__content').innerText.replace(/[\r\n]/g, '').trim()

            let reviewObj = {
                id : allReviews.length,
                source: 'Star Of Service',
                rating: Math.floor(rating),
                name: name,
                content: content,
            };


            if ( reviewObj.rating >= minRating && reviewObj.content.length >= minChars && !noNames.includes(reviewObj.name) )
                allReviews.push(reviewObj);
        })
        return allReviews
    }, reviewSelector, minimumRating, minimumCharInContent, prohibitedNames)

    await browser.close()

    return reviews
}

module.exports = starOfService
