import React from 'react'

const Filter = ({ filterText, filterOnChange }) => {
    // console.log("Filter Props: ", props)
    return (
      <div>
        filter shown with <input value={filterText} onChange={filterOnChange} />
      </div>
    )
  }

export default Filter