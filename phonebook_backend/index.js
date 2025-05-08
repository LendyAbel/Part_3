require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

morgan.token('body', request => {
  if (!request.body) {
    return null
  }
  const body = JSON.stringify(request.body)
  return body
})

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      next(error)
    })
})

app.get('/info', (request, response) => {
  const date = new Date()

  const html = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
    `

  response.send(html)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(pers => pers.id === id)

  if (!person) {
    return response.status(404).end(`Person with id ${id} not found`)
  }

  response.json(person)
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end(`Person with id ${id} deleted`)
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body) {
    return response.status(400).json({ error: 'content missing' })
  }
  const newPersonExist = persons.find(pers => pers.name === body.name)
  if (newPersonExist) {
    return response.status(409).json({ error: 'Name must be unique' })
  }
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number are missing' })
  }

  console.log('body', body)

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(person => {
      console.log('Saved ', person)
      response.json(person)
    })
    .catch(error => {
      next(error)
    })
})

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
