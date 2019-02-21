'use strict'

const
    fs = require('fs'),
    config = require('./.env'),
    providers = {
        google : require('./google'),
        star_of_service : require('./star-of-service')
    };

(async () => {
    let reviews = []
    
    for (const web of config.webs) {
        if ( ! web.activate) continue

        let providerReviews = await providers[web.provider](web.url)
    
        await providerReviews.forEach( review => reviews.push(review) )
    }
    // let googleReviews = await google(config.webs[0].url)
    // googleReviews.forEach(review => reviews.push(review))

    // let starOfServiceReviews = await star_of_service(config.webs[1].url)
    // starOfServiceReviews.forEach(review => reviews.push(review))
    
    await fs.writeFile('./reviews.json', JSON.stringify(reviews, null, 2), (err) => {
        if (err) {
        console.error(err)
        return
        }
    })
})();
