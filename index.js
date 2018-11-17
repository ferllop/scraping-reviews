'use strict'

const
    fs = require('fs'),
    google = require('./google'),
    starOfService = require('./star-of-service');

(async () => {
    let reviews = []

    let googleReviews = await google('https://www.google.es/search?q=dj+marian&oq=dj+marian&aqs=chrome..69i57j69i60j69i65j69i60l2j0.1654j0j4&sourceid=chrome&ie=UTF-8#lrd=0x12a482b981b3f765:0x7ca8c3c9b3eadc99,1,,,')
    googleReviews.forEach(review => reviews.push(review))

    let starOfServiceReviews = await starOfService('https://www.starofservice.es/profesional/dj/castelldefels/3462567/dj-marian#/')
    starOfServiceReviews.forEach(review => reviews.push(review))

    await fs.writeFile('./reviews.json', JSON.stringify(reviews, null, 2), (err) => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    })



})();
