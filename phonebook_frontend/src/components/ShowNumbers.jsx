import React from 'react'

const ShowNumbers = ({ persons, filterText, deleteContact }) => {
  const personsToShow = filterText
    ? persons.filter(person =>
        person.name.toUpperCase().includes(filterText.toUpperCase())
      )
    : persons

  return (
    <div>
      <h2>Numbers</h2>
      <div onClick={deleteContact}>
        {personsToShow.map(person => (
          <p key={person.id}>
            {person.name} {person.number} <button id={person.id}>delete</button>
          </p>
        ))}
      </div>
    </div>
  )
}

export default ShowNumbers
