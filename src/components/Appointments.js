// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Appointments = () => {
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/appointments');
//         setAppointments(response.data);
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//       }
//     };
//     fetchAppointments();
//   }, []);

//   return (
//     <div>
//       <h2>Appointments</h2>
//       {appointments.length === 0 ? (
//         <p>No appointment found.</p>
//       ) : (
//         <ul>
//           {appointments.map((appointment) => (
//             <li key={appointment._id}>
//               <p>Name: {appointment.name}</p>
//               <p>Phone Number: {appointment.phoneNumber}</p>
//               <p>Doctor Name: {appointment.doctorName}</p>
//               <p>Gender: {appointment.gender}</p>
//               <p>Age: {appointment.age}</p>
//               <p>Date: {appointment.date}</p>
//               <p>Time: {appointment.time}</p>
//               <p>Status: {appointment.status}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Appointments;
