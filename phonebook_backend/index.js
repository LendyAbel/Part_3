require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.name)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
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

app.get('/', (request, response) => {
  response.send('/dist/index.html')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      next(error)
    })
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(persons => {
      const date = new Date()
      const html = `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
      `
      response.send(html)
    })
    .catch(error => {
      next(error)
    })
})

app.get('/api/persons/:id', (request, response,next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (!person) {
        return response.status(404).end(`Person with id ${id} not found`)
      }
      response.json(person)
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end(`Person with id ${id} deleted`)
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  const person = new Person({
    name,
    number,
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

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
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
