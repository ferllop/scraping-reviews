'use strict'

const 
    puppeteer = require('puppeteer'),
    config = require('./.env')

const bodas = async (url) => 
{
    let browser = await puppeteer.launch(config.puppeteer);
    const page = await browser.newPage()

    await page.goto(url)
    
    //Sacamos el total de páginas que hay
    const reviewsQtySelector = '.storefront-header-stars'
    await page.waitForSelector(reviewsQtySelector)
    const reviewsQtyText = await page.evaluate(reviewsQtySelector => 
        {
            return reviewsQtyText = document.querySelector(reviewsQtySelector).innerText
        }, reviewsQtySelector)

    const totalReviewsQty = parseInt(reviewsQtyText.replace(' opiniones', ''))
    const pages = Math.ceil(totalReviewsQty / 10)
    
    //Vamos a la ultima review que hay cargada
    //y comprobamos si hay las mismas que las que dice el total de reseñas.
    //Si no las hay, repetimos
    const reviewSelector = '.storefrontItemReview'
    
    //Sacamos los datos de cada review y los metemos en un array de objetos.
    const minimumRating = config.webs[0].ignore_reviews.by_minimum_rating
    const minimumCharInContent = config.webs[0].ignore_reviews.by_minimum_characters_count_in_content
    const prohibitedNames = config.webs[0].ignore_reviews.by_name

    let fullReviews = []
    let scrape = async (actualPage = 1) => {
        let reviews = await page.evaluate((reviewSelector, minimumRating, minimumCharInContent, prohibitedNames) => 
        {
            console.log(reviewSelector, minimumRating, minimumCharInContent, prohibitedNames)
            let allReviews = []
            document.querySelectorAll(reviewSelector).forEach( review => 
            {
                let rating = review.querySelector('.review__ratio').innerText
                
                //let nameToDelete = review.querySelector('.storefrontItemReview__date').innerText
                
                let name = review.querySelector('.storefrontItemReview__name').innerText
                //.replace(nameToDelete, '')
                name = name.toLowerCase()
                    .split(' ')
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ')

                let content = review.querySelector('.storefrontItemReview__description').innerText
                
                let reviewObj = {
                    id : 'todo',
                    source: 'Bodas.net',
                    rating: Math.floor(parseInt(rating)),
                    name: name,
                    content: content,
                };
                
                if ( reviewObj.rating >= minimumRating && reviewObj.content.length >= minimumCharInContent && !prohibitedNames.includes(reviewObj.name) )
                    allReviews.push(reviewObj);
            })
            console.log(allReviews)
            return allReviews
        }, reviewSelector, minimumRating, minimumCharInContent, prohibitedNames)

        fullReviews.push(reviews)
        
        if (pages>actualPage) {
            const nextPage = actualPage+1
            await page.goto(url + '--' + nextPage)
            await scrape(nextPage)
        }
        
    }
    await scrape()
    // await browser.close()

    return fullReviews
}

module.exports = bodas

