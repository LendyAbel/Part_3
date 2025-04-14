const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }
  // console.log(error);

  return (
    <div className={`notification ${error ? 'error' : 'good'}`}>{message}</div>
  )
}

export default Notification
