import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [addMessage, setAddMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }
  useEffect(hook, [])

  const shownPersons = newFilter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()  
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.find(({name}) => name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const url = `http://localhost:3001/api/persons/${person.id}`
        const changedPerson = { ...person, number: newNumber}

        axios.put(url, changedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== person.id ? p : response.data))
            setAddMessage(`Added ${newName}`)
            setTimeout(() => {
              setAddMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
        
      }
    }
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
        
        
      setAddMessage(`Added ${newName}`)
      setTimeout(() => {
        setAddMessage(null)
      }, 5000)
    }  
    
    setNewName('')
    setNewNumber('')
    
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      const url = `http://localhost:3001/api/persons/${person.id}`
    
      axios.delete(url)
        .then( () => {
          setPersons(persons.filter((p) => p.id != person.id))
        })
    }
    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <AddNotification message={addMessage} />
      <ErrorNorification message={errorMessage} />

      <Filter newFilter = {newFilter} handleFilterChange = {handleFilterChange} />
      
      <h3>Add new person</h3>
      <NewPerson 
      newName = {newName} handleNameChange = {handleNameChange}
      newNumber = {newNumber} handleNumberChange = {handleNumberChange} 
      addPerson = {addPerson}/>
      
      <h3>Numbers</h3>
      <Persons shownPersons = {shownPersons} deletePerson = {deletePerson} persons = {persons}/>
    </div>
  )

}

const AddNotification = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className='successfulAdd'>
      {message}
    </div>
  )
}

const ErrorNorification = ({message}) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Persons = (props) => {
  return (
    <div>
      {props.shownPersons.map(person => 
        <p key = {person.name}> {person.name} {person.number} <button onClick={() => props.deletePerson(person)}>delete</button></p>
      )}
    </div>
  )
}

const NewPerson = (props) => {
  return (
    <div>
      <form onSubmit={props.addPerson}>
        <div>
          name: <input 
          value={props.newName}
          onChange={props.handleNameChange}
          />
        </div>
        <div>
          <div>number: <input
          value={props.newNumber}
          onChange={props.handleNumberChange}
          />
          </div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input
      value={props.newFilter}
      onChange={props.handleFilterChange}
      />
    </div>
    
  )
  
}



export default App