# scraping-reviews

This app scrapes the reviews on google and star of service and put it in a json file.
This json will be an array of objects with the next format:

{
  "id" : 1,   // A unique id for the review
  "source": "Star Of Service",   // The service from the review comes
  "rating": 5,   // The rating
  "name": "Jaimito",   // The name of the reviewer
  "content": "A very great performance and profesional"   // The text of the review
}

Feel free to add functions to scrape new services.

Use a cron in your server to run the app once a month for example.
