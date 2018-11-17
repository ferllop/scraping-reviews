'use strict'

const puppeteer = require('puppeteer'),
    fs = require('fs');

(async () => {
    let browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: false
    });

    const page = await browser.newPage()

    await page.goto('https://www.google.es/search?q=dj+marian&oq=dj+marian&aqs=chrome..69i57j69i60j69i65j69i60l2j0.1654j0j4&sourceid=chrome&ie=UTF-8#lrd=0x12a482b981b3f765:0x7ca8c3c9b3eadc99,1,,,')


    //Click en el link que abre la ventana modal con las reseñas
    // const reviewsLinkSelector = 'a[data-async-trigger="reviewDialog"]'
    // await page.waitForSelector(reviewsLinkSelector)
    // await page.waitFor(Math.floor(Math.random() * 2000))
    // page.click(reviewsLinkSelector)

    //Sacamos el total de reseñas que hay
    const reviewsQtySelector = '.Vfp4xe'
    await page.waitForSelector(reviewsQtySelector)
    const reviewsQtyText = await page.evaluate(reviewsQtySelector => {
        return reviewsQtyText = document.querySelector(reviewsQtySelector).innerText
    }, reviewsQtySelector)
    const totalReviewsQty = parseInt(reviewsQtyText.replace(' reseñas', ''))

    //Vamos a la ultima review que hay cargada
    //y comprobamos si hay las mismas que las que dice el total de reseñas.
    //Si no las hay, repetimos
    const reviewSelector = '.gws-localreviews__google-review'
    let loadedReviewsQty = []
    await page.waitFor(Math.floor(Math.random() * 2000));
    await page.keyboard.down('Shift')
    await page.keyboard.press('Tab')
    await page.keyboard.up('Shift')

    while (loadedReviewsQty < totalReviewsQty){
        await page.keyboard.press('End')
        await page.waitFor(Math.floor(Math.random() * 2000))
        loadedReviewsQty = await page.evaluate((selector)=> {
            return document.querySelectorAll(selector).length
        }, reviewSelector)
    }

    //Sacamos los datos de cada review y los metemos en un array de objetos.
    const minimumRating = 4
	const minimumCharInContent = 10
	const prohibitedNames = ['Javier Garcia Garcia', 'Iván Alonso', 'Laura Cubero', 'Marta Gimenez', 'Carmen Morillas', 'David López', 'Omar Salinas', 'Sonia Gallego']

    let reviews = await page.evaluate((selector, minRating, minChars, noNames) => {
        let allReviews = []
        document.querySelectorAll(selector).forEach( review => {
            let rating = review.querySelector('.EBe2gf').getAttribute('aria-label')
                .replace('Valoración de ', '')
                .replace(' de un máximo de 5,', '')
			let name = review.querySelector('.Y0uHMb').innerText;
            name = name.toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')
            let content
            let tempContent = review.querySelector('.Jtu6Td')

            if(tempContent.querySelector('.review-full-text')) {
                content = tempContent.querySelector('.review-full-text')

                content.querySelectorAll('span').length === 3
                ? content = content.querySelectorAll('span')[2].innerText
                : content = content.innerText

            } else if (tempContent.querySelectorAll('span').length === 4){
                content = tempContent.querySelectorAll('span')[3].innerText
            } else {
                content = tempContent.innerText
            }

			let reviewObj = {
				id : allReviews.length,
                source: 'Google',
				rating: rating,
				name: name,
				content: content,
			};


		    if ( /*reviewObj.rating >= minRating && */reviewObj.content.length >= minChars && !noNames.includes(reviewObj.name) )
				allReviews.push(reviewObj);
        })
        return allReviews
    }, reviewSelector, minimumRating, minimumCharInContent, prohibitedNames)

    await fs.writeFile('./google-reviews.json', JSON.stringify(reviews, null, 2), (err) => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    })


    await browser.close()
})();
