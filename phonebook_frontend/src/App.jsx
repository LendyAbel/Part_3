import { useState, useEffect } from 'react'
import contacts from './services/contacts'

import Filter from './components/Filter'
import AddContactForm from './components/AddContactForm'
import ShowNumbers from './components/ShowNumbers'
import Notification from './components/Notification'

const isNumberRepeated = (newPerson, olderPerson) =>
  newPerson.number === olderPerson.number

const App = () => {
  // console.log('-------------------------')
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [[message, error], setMessage] = useState([null, false])

  useEffect(() => {
    contacts.getAllContacts().then(contacts => {
      setPersons(contacts)
    })
  }, [])

  const resetFrom = () => {
    setNewName('')
    setNewNumber('')
  }
  const setMessageTo = (message, error) => {
    setMessage([message, error])
    setTimeout(() => {
      setMessage([null, false])
    }, 5000)
  }

  const replaceContact = newPerson => {
    contacts
      .replaceContact(newPerson)
      .then(updatePerson => {
        setPersons(
          persons.map(p => (p.id != updatePerson.id ? p : updatePerson))
        )
        resetFrom()
        setMessageTo(
          `${updatePerson.name} number changed to ${updatePerson.number}`,
          false
        )
      })
      .catch(error => {
        setMessageTo(
          `Information of ${newPerson.name} has already been removed from server`,
          true
        )
        setPersons(persons.filter(p => p.id != newPerson.id))
      })
  }

  const addNewContact = newPerson => {
    contacts.addContact(newPerson).then(newPerson => {
      setPersons(persons.concat(newPerson))
      resetFrom()
      setMessageTo(`Added ${newPerson.name}`, false)
    })
  }

  const add = e => {
    e.preventDefault()
    if (!newName || !newNumber) return alert('Name or Number is empty')

    let newPerson = { name: newName, number: newNumber }
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      newPerson.id = existingPerson.id
      if (newPerson.number === existingPerson.number) {
        return alert(`${newName} with number ${newNumber} is already added`)
      }
      if (
        window.confirm(
          `${newName} is already added with number ${existingPerson.number}. Replace old number?`
        )
      ) {
        replaceContact(newPerson)
      }
      return
    }
    addNewContact(newPerson)
  }

  const deleteContact = e => {
    if (e.target.tagName !== 'BUTTON') return

    const deletedContactId = e.target.id
    const personToDelete = persons.find(person => person.id === e.target.id)
    // console.log(e.target.id)
    // console.log(personToDelete)

    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      contacts
        .deleteContact(deletedContactId)
        .then(() => {
          // console.log("ok");
          setPersons(persons.filter(person => person.id != deletedContactId))
          setMessageTo(`Deleted ${personToDelete.name}`, false)
        })
        .catch(error => {
          setPersons(persons.filter(p => p.id != personToDelete.id))
        })
    }
  }

  //OnChange Handlers
  const nameOnChange = e => {
    setNewName(e.target.value)
  }
  const numberOnChange = e => {
    setNewNumber(e.target.value)
  }
  const filterOnChange = e => {
    setFilterText(e.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} error={error} />
      <Filter filterText={filterText} filterOnChange={filterOnChange} />
      <AddContactForm
        newName={newName}
        newNumber={newNumber}
        nameOnChange={nameOnChange}
        numberOnChange={numberOnChange}
        add={add}
      />
      <ShowNumbers
        persons={persons}
        filterText={filterText}
        deleteContact={deleteContact}
      />
    </div>
  )
}

export default App
