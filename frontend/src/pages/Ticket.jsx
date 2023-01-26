import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getTicket, closeTicket} from '../features/tickets/ticketSlice'
import {getNotes, createNote, reset as notesReset} from '../features/notes/noteSlice'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'
import BackButton from '../components/BackButton'
import { useParams, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import Modal from'react-modal'
import { FaPlus } from 'react-icons/fa'


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '50%',
    minWidth:'300px',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root') //mounts to the root element


function Ticket() {

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [noteText, setNoteText] =useState('')

  const {isError, isSuccess, ticket, isPending, isLoading, message} =useSelector((state) => state.ticket)
  const {isError: notesError, isLoading: notesIsLoading, notes, message: notesMessage} =useSelector((state) => state.notes)

  const dispatch = useDispatch()
  const {ticketId} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if(isError || notesError) {
      toast.error(message || notesMessage )
    }

    dispatch(getTicket(ticketId))
    dispatch(getNotes(ticketId))
  },[isError, message,ticketId])

  // Open/Close Modal
  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  //Close Ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketId))
    toast.success('Ticket Closed')
    navigate('/tickets')
  }

  const onNoteSubmit = (e) => {
    e.preventDefault()
    dispatch(createNote({ticketId, noteText}))
    closeModal()
  }

  console.log('git committed')

  if(isLoading || notesIsLoading) {
    return <Spinner/>
  }

  if(isError) {
    return <h3>Something went wrong</h3>
  }

  return (
   <div className="ticket-page">
    <header className="ticket-header">
      <BackButton url='/tickets' /> 
      <h2>Ticket : {ticket._id}
        <span className={`status status-${ticket.status}`}>
          {ticket.status}
        </span>
      </h2>
      <h3>Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-gb')}</h3>
      <h3>Product: {ticket.product}</h3>
      <hr />
      <div className="ticket-desc">
        <h3>Description of issue</h3>
        <p>{ticket.description}</p>
      </div>
      <h2>Notes</h2>
    </header>

    {ticket.status !== 'closed' && (
      <button onClick={openModal} className="btn">
      <FaPlus />
      Add Note
      </button>
    )}

    <Modal isOpen={modalIsOpen} onRequestClose = {closeModal} style = {customStyles} contentLabel ='Add Note' >
      <h2>Add Note</h2>
      <button onClick ={closeModal} className="btn-close">X</button>
      <form onSubmit={onNoteSubmit}>
        <div className="form-group">
          <textarea name="noteText" id="noteText" className = 'form-control' value={noteText} onChange={(e) => setNoteText(e.target.value)} />
        </div>
        <div className="form-group">
          <button className="btn" type='submit'>Submit</button>
        </div>

        </form>
      </Modal>

    {notes.map((note) => (
      <NoteItem key={note._id} note = {note} />
    ))}


    {ticket.status !== 'closed' && (
      <button className='btn btn-block btn-danger' onClick={onTicketClose}> Close Ticket</button>
    )} 
   </div>

  )
}

export default Ticket