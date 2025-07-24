const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const cors = require('cors')

const app = express()
const dbPath = path.join(__dirname, 'goodreads.db')

app.use(express.json())
app.use(cors())
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

app.post('/api/heading/', async (request, response) => {
  const deleteQuery = `
  DELETE FROM dynamicheading
  WHERE heading_id = ${1};`
  const dbResponseDelete = await db.run(deleteQuery)

  const {heading} = request.body
  const insertQuery = `
  INSERT INTO dynamicheading(heading_id, heading)
  VALUES('${1}', '${heading}')`
  const dbResponsePost = await db.run(insertQuery)
  response.send('success')
})

app.get('/api/heading/', async (request, response) => {
  const getQuery = `
  SELECT * FROM dynamicheading;`
  const dbResponse = await db.all(getQuery)
  response.send(dbResponse)
})
