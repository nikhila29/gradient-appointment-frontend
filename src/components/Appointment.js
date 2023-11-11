import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'

const Appointment = () => {

  const initialFormData = {
    name: '',
    phoneNumber: '',
    doctorName: '',
    gender: '',
    age: '',
    date: '',
    time: '',
    status: 'Consult', // Default status
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({}); //validation errors
  const [appointments, setAppointments] = useState([]); //all appointments
  const [editingAppointmentId, setEditingAppointmentId] = useState(null); //for update
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // for delete confirmation
  const [deleteSuccess, setDeleteSuccess] = useState(false); // delete successfully message

  const validateForm = () => {
    const errors = {};

    // Name validation (Alphabetic characters only)
    if (!/^[a-zA-Z ]+$/.test(formData.name)) {
      errors.name = 'Name should only contain alphabetic characters';
    }

    // Phone number validation (10-digit numbers only)
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number should be a 10-digit number';
    }

    // Doctor name validation (Starts with "Dr. " and alphabetic characters and spaces)
    if (!/^Dr\. [a-zA-Z ]+$/.test(formData.doctorName)) {
      errors.doctorName =
        'Doctor name should start with "Dr." and contain only alphabetic characters and spaces';
    }

    // Gender validation (Not blank)
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    // Age validation (Numbers only, less than or equal to 100)
    if (!/^\d+$/.test(formData.age) || Number(formData.age) > 100) {
      errors.age = 'Age should be a number less than or equal to 100';
    }

    // Date validation (Not blank)
    if (!formData.date) {
      errors.date = 'Date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
  
    if (isValid) {
      try {
        console.log('Submitting appointment:', formData); // Check if the formData is correct
        await axios.post('http://localhost:5000/appointment', formData);
        console.log('Appointment submitted successfully');
        setAppointments([...appointments, formData]);
        setFormData(initialFormData); // Clear form after submission
      } catch (error) {
        console.error('Error creating appointment:', error);
      }
    }
};
  
const fetchAppointments = async () => {
  try {
    const response = await axios.get('http://localhost:5000/appointments');
    setAppointments(response.data);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};

useEffect(() => {
  fetchAppointments();
}, []);

console.log(appointments)

const formatDateString = (dateString) => {
  // Convert the date string to a JavaScript Date object
  const date = new Date(dateString);

  // Format the date as a string without the time part
  return date.toLocaleDateString();
};

const getStatusButtonClassName = (status) => {
  if (status === 'Consult') {
    return 'greenButton';
  } else {
    return 'blueButton';
  }
};

//update the form

const handleEdit = (appointmentId) => {
  setEditingAppointmentId(appointmentId);
  const appointment = appointments.find((appointment) => appointment._id === appointmentId);
  setFormData(appointment);
};

const handleCloseEdit = () => {
  setEditingAppointmentId(null);
  setFormData(initialFormData);
};

const handleUpdateAppointment = async () => {
  try {
    await axios.patch(`http://localhost:5000/appointments/${editingAppointmentId}`, formData);
    console.log('Appointment updated successfully');
    setEditingAppointmentId(null);
    setFormData(initialFormData);
    fetchAppointments();
  } catch (error) {
    console.error('Error updating appointment:', error);
  }
};


//Delete card
const handleDelete = async (appointmentId) => {
  setDeleteConfirmation(true);
  setDeleteSuccess(false);
  const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
  setDeleteConfirmation(false);

  if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:5000/appointments/${appointmentId}`);
      console.log('Appointment deleted successfully');
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      setDeleteSuccess(true);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  }
};

useEffect(() => {
  if (deleteSuccess) {
    // Show "Delete successful" message for 3 seconds, then hide it
    const timer = setTimeout(() => {
      setDeleteSuccess(false);
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [deleteSuccess]);

const renderEditModal = () => {
  return (
    <div className='modal'>
      
      <div className='header'>
        <h2 className='header-name'>Welcome to Gradious Doctor Appointment Booking</h2>
      </div>
      <form onSubmit={handleUpdateAppointment} className='form'>
        <label className='label'>
          <input
            type="text"
            name="name"
            placeholder='Patient Name *'
            className='input'
            value={formData.name}
            onChange={handleChange}
            required
          />
          {formErrors.name && <p>{formErrors.name}</p>}
        </label>
        <label className='label'>
          <input
            type="text"
            name="phoneNumber"
            placeholder='Phone Number *'
            className='input'
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {formErrors.phoneNumber && <p>{formErrors.phoneNumber}</p>}
        </label>
        <label className='label'>
          <input
            type="text"
            name="doctorName"
            placeholder='Doctor Name *'
            className='input'
            value={formData.doctorName}
            onChange={handleChange}
            required
          />
          {formErrors.doctorName && <p>{formErrors.doctorName}</p>}
        </label>
        <label className='label'>
          <select
            name="gender"
            className='input'
            value={formData.gender}
            onChange={handleChange}
            style={{height:"50px"}}
            required
          >
            <option value="">Select Gender *</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {formErrors.gender && <p>{formErrors.gender}</p>}
        </label>
        <label className='label'>
          <input
            type="number"
            name="age"
            placeholder='Age*'
            className='input'
            value={formData.age}
            onChange={handleChange}
            required
          />
          {formErrors.age && <p>{formErrors.age}</p>}
        </label>
        <label className='label'>
          <input
            type="date"
            name="date"
            className='input'
            value={formData.date}
            onChange={handleChange}
            required
          />
          {formErrors.date && <p>{formErrors.date}</p>}
        </label>
        <label className='label'>
          <input
            type="time"
            name="time"
            className='input'
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>
        <label className='label'>
          <select
            name="status"
            className='input'
            style={{height:"50px"}}
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Consult">Consult</option>
            <option value="Revisit">Revisit</option>
          </select>
        </label>
        <div className='modal-buttons'>
          <button type='submit' className='book-appointment'>Update Appointment</button>
          <button type='button' onClick={handleCloseEdit} className='cancel'>Cancel</button>
        </div>
      </form>
    </div>
  );
};

  return (
    <div className='main'>
      <div className='header'>
        <h2 className='header-name'>Welcome to Gradious Doctor Appointment Booking</h2>
      </div>
     

      <form onSubmit={handleSubmit} className='form'>
        <label className='label'>
          <input
            type="text"
            name="name"
            placeholder='Patient Name *'
            className='input'
            value={formData.name}
            onChange={handleChange}
            required
          />
          {formErrors.name && <p>{formErrors.name}</p>}
        </label>
        <label className='label'>
          <input
            type="text"
            name="phoneNumber"
            placeholder='Phone Number *'
            className='input'
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {formErrors.phoneNumber && <p>{formErrors.phoneNumber}</p>}
        </label>
        <label className='label'>
          <input
            type="text"
            name="doctorName"
            placeholder='Doctor Name *'
            className='input'
            value={formData.doctorName}
            onChange={handleChange}
            required
          />
          {formErrors.doctorName && <p>{formErrors.doctorName}</p>}
        </label>
        <label className='label'>
          <select
            name="gender"
            className='input'
            value={formData.gender}
            onChange={handleChange}
            style={{height:"50px"}}
            required
          >
            <option value="">Select Gender *</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {formErrors.gender && <p>{formErrors.gender}</p>}
        </label>
        <label className='label'>
          <input
            type="number"
            name="age"
            placeholder='Age*'
            className='input'
            value={formData.age}
            onChange={handleChange}
            required
          />
          {formErrors.age && <p>{formErrors.age}</p>}
        </label>
        <label className='label'>
          <input
            type="date"
            name="date"
            className='input'
            value={formData.date}
            onChange={handleChange}
            required
          />
          {formErrors.date && <p>{formErrors.date}</p>}
        </label>
        <label className='label'>
          <input
            type="time"
            name="time"
            className='input'
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>
        <label className='label'>
          <select
            name="status"
            className='input'
            style={{height:"50px"}}
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Consult">Consult</option>
            <option value="Revisit">Revisit</option>
          </select>
        </label>
        <button type="submit" className='book-appointment'>Book Appointment</button>
      </form>

      
      <div className='table-data'>
        {/* <h2>Appointments</h2> */}
        {appointments.length === 0 ? (
          <p>No appointment found.</p>
        ) : (
          <div>
            <div className='table-header'>  
              <div>Patient</div>
              <div>Status</div>
              <div>Appointment</div>
              <div>Phone</div>
              <div>Doctor</div>
              <div>Actions</div>  
            </div>
              {appointments.map((appointment) => (
                <div>
                  <div className='card'>
                    <div>
                      <div className='patient-name'>{appointment.name}</div>
                      <div>{appointment.age + 'yrs'}, {appointment.gender}</div>
                    </div> 
                    <div className='status'>
                      <button className={getStatusButtonClassName(appointment.status)}>
                        {appointment.status}
                      </button>
                    </div>
                    <div style={{display:"grid"}}>
                      <div>{appointment.time}</div>
                      <div>{formatDateString(appointment.date)}</div>
                    </div>
                    <div style={{display:"grid"}}>
                      <span>{appointment.phoneNumber}</span>
                      <span className='contact'>Contact</span>
                    </div>
                    <div className='doctor-name'>{appointment.doctorName}</div>
                    <div className='action'>
                      <button onClick={() => handleEdit(appointment._id)} className='edit'>Edit</button>
                      <button onClick={() => handleDelete(appointment._id)} className='delete'>Delete</button>
                    </div>
                   
                  </div>
                    {editingAppointmentId === appointment._id && renderEditModal()}
                </div>
                
              ))}
              
          </div>
        )}
      </div>

      {deleteConfirmation && <p>Confirming delete...</p>}
      {deleteSuccess && <p className='delete-msg'>Appointment deleted successfully!</p>}

    </div>
  );
};

export default Appointment;
