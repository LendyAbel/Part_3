import axios from 'axios'
const baseUrl = '/api/persons'

const getAllContacts = () => {
  const request = axios.get(baseUrl)

  //   console.log(request.then(response => response.data))

  return request.then(response => response.data)
}

const addContact = newPerson => {
  const request = axios.post(baseUrl, newPerson)
  return request.then(response => response.data)
}

const deleteContact = id => {
  // console.log(`delete contact with id ${id}`)

  return axios.delete(`${baseUrl}/${id}`)
}

const replaceContact = replacePerson => {

  // console.log('replacePerson: ', replacePerson)

  const request = axios.put(`${baseUrl}/${replacePerson.id}`, replacePerson)

  // console.log(request)

  return request.then(response => response.data)
}

export default { getAllContacts, addContact, deleteContact, replaceContact }
