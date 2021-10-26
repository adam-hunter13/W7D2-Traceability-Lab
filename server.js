const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')

let rollbar = new Rollbar({
    accessToken: '4c134f81c71f41c58be7a1bbebf2bd93',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()
app.use(express.json())

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully')
})

app.get('/css', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/styles.css'))
})


// try {
//     nonExistentFunction();
//   } catch (error) {
//     console.error(error);
//     rollbar.warning('non-existent function')
//     rollbar.critical('Critical Warning: Go home and rethink your life.')
//     // expected output: ReferenceError: nonExistentFunction is not defined
//     // Note - error messages will vary depending on browser
//   }


let movies =[]

app.post('/api/movie', (req, res) => {
    let {name} = req.body
    name = name.trim()

    const index = movies.findIndex(movieName => movieName === name)

    if(index === -1 && name !== ''){
        movies.push(name)
        rollbar.log('Movie added successfully', {author: 'Adam', type: 'manual entry'})
        res.status(200).send(movies)
    } else if(name === '') {
        rollbar.error('No movie title given')
        res.status(400).send('Must provide a movie title.')
    } else{
        rollbar.critical('Movie already exists.')
        res.status(400).send('that movie already exists')
    }
})

app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))