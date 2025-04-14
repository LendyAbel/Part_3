import React from 'react'

const AddContactForm = ({
    newName,
    newNumber,
    nameOnChange,
    numberOnChange,
    add,
  }) => {
    return (
      <>
        <h2>Add new contact</h2>
        <form onSubmit={add}>
          <div>
            name: <input value={newName} onChange={nameOnChange} />
          </div>
          <div>
            number: <input value={newNumber} onChange={numberOnChange} />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
      </>
    )
  }

export default AddContactForm