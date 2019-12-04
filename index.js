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
        if ( ! web.activate)
            continue
        
        try {
            let providerReviews = await providers[web.provider](web.url)
            await providerReviews.forEach( review => reviews.push(review) )
        } catch (ex) {
            console.log("Ha habido un error: " + ex.message);
        }
    
    }
    
    await fs.writeFile('./reviews.json', JSON.stringify(reviews, null, 2), (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
})();
