const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../apps/api/src/assets/data/movies.json');
const outputWithoutDuration = path.join(__dirname, '../apps/api/src/assets/data/movies-without-duration.json');

try {
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    const withDuration = data.filter(movie => movie.durationMinutes !== null && movie.durationMinutes !== undefined);
    const withoutDuration = data.filter(movie => movie.durationMinutes === null || movie.durationMinutes === undefined);

    console.log(`Total movies: ${data.length}`);
    console.log(`Movies with duration: ${withDuration.length}`);
    console.log(`Movies without duration: ${withoutDuration.length}`);

    fs.writeFileSync(outputWithoutDuration, JSON.stringify(withoutDuration, null, 4), 'utf8');
    // fs.writeFileSync(inputFile, JSON.stringify(withDuration, null, 4), 'utf8');

    console.log('Successfully extracted movies to movies-without-duration.json');
} catch (error) {
    console.error('Error processing movies:', error);
}
