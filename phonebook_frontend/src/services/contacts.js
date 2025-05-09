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
  return axios.delete(`${baseUrl}/${id}`)
}

const replaceContact = replacePerson => {
  const request = axios.put(`${baseUrl}/${replacePerson.id}`, replacePerson)
  return request.then(response => response.data)
}

export default { getAllContacts, addContact, deleteContact, replaceContact }
