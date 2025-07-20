import React, { useEffect, useState } from 'react'
import axiosInstance from '../../common/AxiosInstance';
import { Link } from 'react-router-dom';
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
   },
   // hide last border
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));
const UnenrollButton = styled(Button)({
   marginLeft: 8,
   borderColor: '#66bb6a',
   color: '#fff',
   background: '#66bb6a',
   fontWeight: 600,
   transition: 'background 0.2s, color 0.2s, border-color 0.2s',
   '&:hover': {
      background: '#ff5252',
      color: '#fff',
      borderColor: '#ff5252',
   },
});
const EnrolledCourses = () => {
   const [allEnrolledCourese, setAllEnrolledCourses] = useState([])
   const [showUnenrollModal, setShowUnenrollModal] = useState(false);
   const [pendingUnenrollId, setPendingUnenrollId] = useState(null);

   const allCourses = async () => {
      try {
         const res = await axiosInstance.get('api/user/getallcoursesuser', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllEnrolledCourses(res.data.data)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      }
   }

   const unenrollCourse = async (courseId) => {
      try {
         const res = await axiosInstance.delete(`api/user/enrolledcourse/${courseId}`, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            data: { userId: JSON.parse(localStorage.getItem("user"))._id }
         });
         if (res.data.success) {
            setAllEnrolledCourses(prev => prev.filter(c => c._id !== courseId));
            setShowUnenrollModal(false);
            setPendingUnenrollId(null);
         } else {
            alert(res.data.message || 'Failed to unenroll.');
         }
      } catch (error) {
         console.error('Unenroll error:', error?.response || error);
         alert('An error occurred while unenrolling.');
      }
   };

   useEffect(() => {
      allCourses()
   }, [])
   return (
      <>
         {/* Unenroll confirmation modal */}
         {showUnenrollModal && (
            <div style={{
               position: 'fixed',
               top: 0, left: 0, right: 0, bottom: 0,
               background: 'rgba(0,0,0,0.18)',
               zIndex: 9999,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}>
               <div style={{
                  background: '#fff',
                  border: '2px solid #ff5252',
                  color: '#222',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderRadius: '16px',
                  padding: '32px 40px',
                  boxShadow: '0 4px 24px #ffe08299',
                  minWidth: 340,
                  textAlign: 'center',
                  position: 'relative',
                  maxWidth: 400,
               }}>
                  <span style={{fontSize: 28, marginRight: 10}}><i className="bi bi-x-octagon-fill" style={{color:'#ff5252'}}></i></span>
                  <div style={{marginBottom: 18, marginTop: 8}}>
                     Are you sure you want to unenroll from this course?
                  </div>
                  <div style={{marginTop: 12, display: 'flex', justifyContent: 'center', gap: 18}}>
                     <Button variant="danger" style={{fontWeight:600, minWidth:90, borderRadius:8, background:'#ff5252', border:'none'}} onClick={() => unenrollCourse(pendingUnenrollId)}>OK</Button>
                     <Button variant="secondary" style={{fontWeight:600, minWidth:90, borderRadius:8}} onClick={()=>setShowUnenrollModal(false)}>Cancel</Button>
                  </div>
                  <button onClick={() => setShowUnenrollModal(false)} style={{
                     position: 'absolute',
                     top: 8,
                     right: 12,
                     background: 'none',
                     border: 'none',
                     fontSize: 22,
                     color: '#ff5252',
                     cursor: 'pointer',
                  }} aria-label="Close popup">
                     ×
                  </button>
               </div>
            </div>
         )}
         <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
               <TableHead>
                  <TableRow>
                     <StyledTableCell>Course ID</StyledTableCell>
                     <StyledTableCell align="left">Course Name</StyledTableCell>
                     <StyledTableCell align="left">Cousre Educator</StyledTableCell>
                     <StyledTableCell align="left">Course Category</StyledTableCell>
                     <StyledTableCell align="left">Action</StyledTableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {
                     allEnrolledCourese?.length > 0 ? (
                        allEnrolledCourese?.map((course) => (
                           <StyledTableRow key={course._id}>
                              <StyledTableCell component="th" scope="row">
                                 {course._id}
                              </StyledTableCell>
                              <StyledTableCell component="th" scope="row">
                                 {course.C_title}
                              </StyledTableCell>
                              <StyledTableCell component="th" scope="row">
                                 {course.C_educator}
                              </StyledTableCell>
                              <StyledTableCell component="th" scope="row">
                                 {course.C_categories}
                              </StyledTableCell>
                              <StyledTableCell component="th" scope="row">
                                 <Link to={`/courseSection/${course._id}/${course.C_title}`}><Button size='small' variant="contained" color="primary">Go To</Button></Link>
                                 <UnenrollButton size='small' variant="outlined" onClick={() => { setPendingUnenrollId(course._id); setShowUnenrollModal(true); }}>
                                    Unenroll
                                 </UnenrollButton>
                              </StyledTableCell>
                           </StyledTableRow>
                        )))
                        :
                        (<StyledTableRow>
                           <StyledTableCell colSpan={5} align="center">
                              yet to be enrolled courses
                           </StyledTableCell>
                        </StyledTableRow>)
                  }
               </TableBody>
            </Table>
         </TableContainer>
      </>
   )
}

export default EnrolledCourses
