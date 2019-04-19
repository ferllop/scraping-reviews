'use strict'

module.exports = {
	puppeteer : {
    	"args": ["--lang=es-ES", "--no-sandbox", "--disable-setuid-sandbox"],
    	"headless": false,
		"dumpio" : true
	},
	webs : [
		{
			activate : false,
			url : 'https://www.google.es/search?q=dj+marian&oq=dj+marian&aqs=chrome..69i57j69i60j69i65j69i60l2j0.1654j0j4&sourceid=chrome&ie=UTF-8#lrd=0x12a482b981b3f765:0x7ca8c3c9b3eadc99,1',
			provider : 'google',
			ignore_reviews : {
				by_name : [
					'Javier Garcia Garcia', 
					'Iván Alonso', 
					'Laura Cubero', 
					'Marta Gimenez', 
					'Carmen Morillas', 
					'David López', 
					'Omar Salinas', 
					'Sonia Gallego'
				],
				by_minimum_rating : 4,
				by_minimum_characters_count_in_content : 10
			}
		},
		{
			activate : false,
			url : 'https://www.starofservice.es/profesional/dj/castelldefels/3462567/dj-marian#/',
			provider : 'star_of_service',
			ignore_reviews : {
				by_name : [
					'Lidia L.', 
					'Carmen M.', 
					'Deivid A.', 
					'Laura C.'
				],
				by_minimum_rating : 4,
				by_minimum_characters_count_in_content : 10
			}
		},
		{
			activate : true,
			url : 'https://www.bodas.net/musica/dj-marian--e27919/opiniones',
			provider : 'bodas',
			ignore_reviews : {
				by_name : [
					'Jane', 
					'Mireia', 
					'Ana Cristina', 
					'Eva Garcia', 
					'Carmen', 
					'Javier Garcia'
				],
				by_minimum_rating : 4,
				by_minimum_characters_count_in_content : 10
			}
		},
	]
}

