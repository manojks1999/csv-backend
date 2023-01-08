const express = require('express')
const app = express()
const csv = require('csvtojson')

var cors = require('cors');
app.use(cors())

const allBooksData = async () => {
    const jsonArray = await csv({delimiter: ';'}).fromFile(`${__dirname}/books.csv`)
    console.log(jsonArray)
    return jsonArray;
}

const allMagazinesData = async () => {
    const jsonArray = await csv({delimiter: ';'}).fromFile(`${__dirname}/magazines.csv`)
    console.log(jsonArray)
    return jsonArray;
}

const allBooksMagazinesData = async () => {
    const allBooks = await allBooksData();
    const allMagazines = await allMagazinesData();
    let sortedData = []
    await allBooks.forEach((element) => {
        sortedData.push(element);
    })
    await allMagazines.forEach((element) => {
        sortedData.push(element);
    })
    let sortedArray= sortedData.sort(function(a, b) {
        return a.title.localeCompare(b.title);
     });
     return sortedArray;
}

const findByISBN = async (category, isbn) => {
    console.log(category)
    if(category === 'books'){
        const allBooks = await allBooksData();
        const data = []
        await allBooks.forEach((element) => {
            if(element.isbn === isbn){
                data.push(element);
            }
        })
        return data;
    }else if(category === 'magazines'){
        const allMagazines = await allMagazinesData();
        const data = []
        await allMagazines.forEach((element) => {
            if(element.isbn === isbn){
                data.push(element);
            }
        })
        return data;
    }
}

const findByEmail= async (category, email) => {
    console.log(category)
    if(category === 'books'){
        const allBooks = await allBooksData();
        const data = []
        await allBooks.forEach((element) => {
            if(element.authors === email){
                data.push(element);
            }
        })
        return data;
    }else if(category === 'magazines'){
        const allMagazines = await allMagazinesData();
        const data = []
        await allMagazines.forEach((element) => {
            if(element.authors === email){
                data.push(element);
            }
        })
        return data;
    }
}















app.get('/',  async (req, res) => {
    res.send('hello world')
})


app.get('/allBooks', async (req, res) => {
    let data = await allBooksData();
    res.json({
        data: data
    })
})
  
app.get('/allMagazines',  async (req, res) => {
    let data = await allMagazinesData();
    res.json({
        data: data
    })
})

app.get('/findByISBN',  async (req, res) => {
    const category = (req.query.category).toString();
    const isbn = (req.query.isbn).toString();
    console.log(category, isbn)
    let data = await findByISBN(category, isbn);
    res.json({
        data: data
    })
})

app.get('/findByEmail',  async (req, res) => {
    const category = (req.query.category).toString();
    const email = (req.query.email).toString();
    console.log(category, email)
    let data = await findByEmail(category, email);
    res.json({
        data: data
    })
})

app.get('/sortedData',  async (req, res) => {
    let data = await allBooksMagazinesData();
    res.json({
        data: data
    })
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening at ${process.env.PORT}`)
})