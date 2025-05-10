const mongoose = require('mongoose')

// console.log('argumentos',process.argv)

const proccesArgIsValid = process.argv.length === 3 || process.argv.length === 5

if (!proccesArgIsValid) {
  console.log(
    'Provide corrects arguments:<password> to check all or <password> <name> <number> to add'
  )
  process.exit()
}

const password = encodeURIComponent(process.argv[2])
const url = `mongodb+srv://fullstack:${password}@cluster0.yzrgbtx.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number: number,
  })

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to the phonebook`)
    mongoose.connection.close()
  })
}
