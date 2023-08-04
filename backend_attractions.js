// Import axios library for making HTTP requests
const axios = require('axios');
const returnCoordList = require('./backend_fiptrial2_part2');

function findSmallBusinesses(apiKey, location, radius, businessType) {
    const endpointUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const params = {
        'key': apiKey,
        'location': location,
        'radius': radius,
        'type': businessType
    };
    
    return axios.get(endpointUrl, { params })
        .then(response => {
            const results = response.data;
            console.log('Status:', response.status);
            console.log('Response:', results);

            const businesses = [];
            if ('results' in results) {
                for (let i = 0; i < results['results'].length; i++) {
                    const result = results['results'][i];
                    const business = {
                        'name': result['name'],
                        'address': result['vicinity'],
                        'rating': result['rating'] || 'No rating',
                        'total_ratings': result['user_ratings_total'] || 'No ratings'
                    };
                    if (business['total_ratings'] !== 'No ratings') {
                        businesses.push(business);
                    }
                    if (i > 20) {
                        break;
                    }
                }
            }
            return businesses;
        })
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}

const apiKey = 'AIzaSyD5sz1Eov53UbNNQX1Imy86ulAWUF9s5nQ';
const location = '37.7749,-122.4194'; // take input from the frontend
const radius = 5000; // arbitrary. We can take input from the frontend.
const businessType = 'cafe'; // take input from the frontend

findSmallBusinesses(apiKey, location, radius, businessType)
    .then(businesses => {
        const sortedBusinesses = businesses.sort((a, b) => a.total_ratings - b.total_ratings);
        for (let i = 0; i < sortedBusinesses.length; i++) {
            const business = sortedBusinesses[i];
            console.log(`Name: ${business.name}, Address: ${business.address}, Rating: ${business.rating}, Total_Ratings: ${business.total_ratings}`);
            if (i > 1) {
                break;
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
