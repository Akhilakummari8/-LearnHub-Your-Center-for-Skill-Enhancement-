import React, { useState, useEffect } from 'react'
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'
import axiosInstance from '../common/AxiosInstance'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



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

const RedDeleteButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  borderColor: theme.palette.error.main,
  transition: 'background 0.2s, color 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    borderColor: theme.palette.error.main,
    boxShadow: '0 0 0 4px rgba(211,47,47,0.15)', // highlight the whole button area
  },
}));

const HighlightedTableRow = styled(StyledTableRow)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  '& td, & th': {
    color: '#fff',
    fontWeight: 700,
    backgroundColor: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}));

const AllCourses = () => {
   const [allCourses, setAllCourses] = useState([])
   const [confirmOpen, setConfirmOpen] = useState(false);
   const [pendingDeleteId, setPendingDeleteId] = useState(null)

   const allCoursesList = async () => {
      try {
         const res = await axiosInstance.get('api/admin/getallcourses', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllCourses(res.data.data)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      allCoursesList()
   }, [])

   const deleteCourse = async (courseId) => {
      const confirmation = confirm('Are you sure you want to delete')
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`api/user/deletecourse/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message)
            allCoursesList()
         } else {
            alert("Failed to delete the course")
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }

   const handleDeleteClick = (courseId) => {
      setPendingDeleteId(courseId);
      setConfirmOpen(true);
   };

   const handleConfirmDelete = async () => {
      setConfirmOpen(false);
      if (!pendingDeleteId) return;
      try {
         const res = await axiosInstance.delete(`api/user/deletecourse/${pendingDeleteId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message)
            allCoursesList()
         } else {
            alert("Failed to delete the course")
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
      setPendingDeleteId(null);
   };

   const handleCancelDelete = () => {
      setConfirmOpen(false);
      setPendingDeleteId(null);
   };

   return (
      <>
         <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
               <TableHead>
                  <TableRow>
                     <StyledTableCell>Cousre ID</StyledTableCell>
                     <StyledTableCell align="center">Course Name</StyledTableCell>
                     <StyledTableCell align="left">Course Educator</StyledTableCell>
                     <StyledTableCell align="center">Course Category</StyledTableCell>
                     <StyledTableCell align="left">Course Price</StyledTableCell>
                     <StyledTableCell align="left">Course Sections</StyledTableCell>
                     <StyledTableCell align="left">Enrolled Students</StyledTableCell>
                     <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {
                     allCourses.length > 0 ? (
                        allCourses.map((Course) => {
                           const isDeleting = pendingDeleteId === Course._id;
                           const RowComponent = isDeleting ? HighlightedTableRow : StyledTableRow;
                           return (
                              <RowComponent key={Course._id}>
                                 <StyledTableCell component="th" scope="row">
                                    {Course._id}
                                 </StyledTableCell>
                                 <StyledTableCell align="center" component="th" scope="row">
                                    {Course.C_title}
                                 </StyledTableCell>
                                 <StyledTableCell align="center" component="th" scope="row">
                                    {Course.C_educator}
                                 </StyledTableCell>
                                 <StyledTableCell align="center" component="th" scope="row">
                                    {Course.C_categories}
                                 </StyledTableCell>
                                 <StyledTableCell align="center" component="th" scope="row">
                                    {Course.C_price}
                                 </StyledTableCell>
                                 <StyledTableCell align="center" component="th" scope="row">
                                    {Course.sections.length}
                                 </StyledTableCell>
                                 <StyledTableCell align="center" component="th" scope="row">
                                    {Course.enrolled}
                                 </StyledTableCell>
                                 <StyledTableCell align="center" component="th" scope="row">
                                    <RedDeleteButton onClick={() => handleDeleteClick(Course._id)} size='small' variant="outlined">Delete</RedDeleteButton>
                                 </StyledTableCell>
                              </RowComponent>
                           );
                        }))
                        :
                        (<p className='px-2'>No users found</p>)
                  }
               </TableBody>
            </Table>
         </TableContainer>
         <Dialog open={confirmOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
               <DialogContentText>
                  Are you sure you want to delete this course?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleCancelDelete} color="primary" variant="outlined">
                  Cancel
               </Button>
               <Button onClick={handleConfirmDelete} color="error" variant="contained">
                  OK
               </Button>
            </DialogActions>
         </Dialog>
      </>
   )
}

export default AllCourses
