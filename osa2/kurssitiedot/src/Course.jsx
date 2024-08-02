import App from './App'

const Course = ({course}) => {

    const Header = () => {
      return (
        <>
          <h1>{course.name}</h1>
        </>
      ) 
    }
  
    const Content = () => {
      return (
        <>
          {course.parts.map(part => 
            <Part name = {part.name} exercises = {part.exercises} key = {part.id}/>
          )}
        </>
    )
    }
  
    const Part = (props) => {
      return (
        <>
          <p>{props.name} {props.exercises}</p>
        </>
      )
    }
  
    const Total = () => {
      const result = course.parts.map(part => part.exercises)
  
      return (
        <>
          <p>Total of {result.reduce((a, b) => a + b)} exercises</p>
        </>
      )
    }
  
    return (
      <>
        <Header course = {App.course} />
        <Content course = {App.course} />
        <Total course = {App.course} />
      </>
    )
  }

export default Course