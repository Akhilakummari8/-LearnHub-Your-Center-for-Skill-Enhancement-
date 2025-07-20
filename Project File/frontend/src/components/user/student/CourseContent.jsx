import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Accordion, Modal } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';
import ReactPlayer from 'react-player';
import { UserContext } from '../../../App';
import NavBar from '../../common/NavBar';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const CourseContent = () => {
   const user = useContext(UserContext)
   const navigate = useNavigate();
   const playerRef = useRef(null);

   const { courseId, courseTitle } = useParams(); // Extract courseId from URL
   const [courseContent, setCourseContent] = useState([]);
   const [currentVideo, setCurrentVideo] = useState(null);
   const [playingSectionIndex, setPlayingSectionIndex] = useState(-1);
   const [currentSectionIndex, setCurrentSectionIndex] = useState(-1);
   const [completedSections, setCompletedSections] = useState([]);
   const [completedModule, setCompletedModule] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [certificate, setCertificate] = useState(null)
   // Extract sectionIds from completedModule
   const completedModuleIds = completedModule.map((item) => item.sectionId);

   const downloadPdfDocument = (rootElementId) => {
      const input = document.getElementById(rootElementId);
      html2canvas(input).then((canvas) => {
         const imgData = canvas.toDataURL('image/png');
         const pdf = new jsPDF();
         pdf.addImage(imgData, 'JPEG', -35, 10);
         pdf.save('download-certificate.pdf');
      });
   };


   const getCourseContent = async () => {
      try {
         const res = await axiosInstance.get(`/api/user/coursecontent/${courseId}`, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         });
         if (res.data.success) {
            setCourseContent(res.data.courseContent);
            console.log(res.data.completeModule)
            setCompletedModule(res.data.completeModule)
            // setCompletedModule(res.data.completeModule[0]?.progress);
            setCertificate(res.data.certficateData.updatedAt)
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getCourseContent();
   }, [courseId]);

   const playVideo = (videoPath, index) => {
      setCurrentVideo(videoPath);
      setPlayingSectionIndex(index);
      setCurrentSectionIndex(index);
   };

   const completeModule = async (sectionId) => {
      if (completedModule.length < courseContent.length) {
         // Mark the current section as completed
         if (playingSectionIndex !== -1 && !completedSections.includes(playingSectionIndex)) {
            setCompletedSections([...completedSections, playingSectionIndex]);

            // Send a request to the server to update the user's progress
            try {
               const res = await axiosInstance.post(`api/user/completemodule`, {
                  courseId,
                  sectionId: sectionId
               }, {
                  headers: {
                     Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
               });
               if (res.data.success) {
                  // Optimistically update completedModule state
                  setCompletedModule(prev => {
                     // Avoid duplicates
                     if (!prev.some(item => item.sectionId === sectionId)) {
                        return [...prev, { sectionId }];
                     }
                     return prev;
                  });
                  alert(res.data.message);
                  // Optionally, you can still call getCourseContent() to sync with backend
                  // getCourseContent();
               }
            } catch (error) {
               console.log(error);
            }
         }
      } else {
         // Show the modal
         setShowModal(true);
      }
   };

   return (
      <>
         <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
         >
            <NavBar />
         </motion.div>
         <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: 'flex', alignItems: 'center', marginTop: 16, marginLeft: 16 }}
         >
            <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} style={{ marginRight: 12 }}>
               ← Back
            </Button>
            <h1 className='my-3 text-center' style={{ flex: 1 }}>Welcome to the course: {courseTitle}</h1>
         </motion.div>

         <motion.div
            className='course-content'
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ 
               display: 'flex', 
               justifyContent: 'center', 
               alignItems: 'flex-start', 
               minHeight: '70vh', 
               gap: 40, 
               marginTop: 32, 
               flexWrap: 'wrap', // Responsive wrap
               width: '100%',
               boxSizing: 'border-box',
            }}
         >
            {/* Left: Accordion/Sections */}
            <motion.div
               className="course-section"
               initial={{ opacity: 0, x: -80 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.7, delay: 0.3 }}
               style={{ 
                  flex: '1 1 52%', 
                  maxWidth: 600, 
                  background: '#fff', 
                  borderRadius: 18, 
                  boxShadow: '0 4px 24px #29b6f655', 
                  padding: 24, 
                  minHeight: 320, 
                  maxHeight: '70vh', 
                  overflowY: 'auto', 
                  marginBottom: 24,
               }}
            >
               <Accordion defaultActiveKey="0" flush>
                  {[...courseContent].reverse().map((section, index) => {
                     // Debug: log section to see its structure
                     console.log('Section:', section);
                     const sectionId = courseContent.length - 1 - index;
                     const isSectionCompleted = !completedModuleIds.includes(sectionId);
                     // Support both string and object for S_content
                     let videoPath = null;
                     if (section.S_content) {
                       if (typeof section.S_content === 'string') {
                         videoPath = section.S_content;
                       } else if (typeof section.S_content === 'object' && section.S_content.path) {
                         videoPath = section.S_content.path;
                       }
                     }
                     const hasVideo = !!videoPath;
                     return (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                           <Accordion.Header>{section.S_title}</Accordion.Header>
                           <Accordion.Body>
                              {section.S_description}
                              {/* Show warning if video is missing */}
                              {!hasVideo && (
                                <div style={{
                                  color: '#b71c1c',
                                  background: '#ffebee',
                                  border: '1px solid #ffcdd2',
                                  borderRadius: 8,
                                  padding: '12px 16px',
                                  margin: '12px 0',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10
                                }}>
                                  <i className="bi bi-exclamation-triangle-fill" style={{fontSize: 22, color: '#d32f2f'}}></i>
                                  <span>No video found for this section. Please contact your instructor if you believe this is an error.</span>
                                </div>
                              )}
                              {hasVideo && (
                                <Button color='info' className='mx-2 play-btn' variant="text" size="small" onClick={() => playVideo(`http://localhost:5000/uploads/${videoPath}`, sectionId)}>
                                  Play Video
                                </Button>
                              )}
                              {hasVideo && isSectionCompleted && !completedSections.includes(sectionId) && (
                                <Button color='secondary' className='pause-btn' variant="text" size="small" onClick={() => completeModule(section._id)}>
                                  Completed
                                </Button>
                              )}
                           </Accordion.Body>
                        </Accordion.Item>
                     );
                  })}
                  {completedModule.length === courseContent.length && (
                     <Button className='my-2 download-cert-btn' onClick={() => setShowModal(true)}>Download Certificate</Button>
                  )}
               </Accordion>
            </motion.div>
            {/* Right: Video/Description */}
            <motion.div
               className="course-video"
               initial={{ opacity: 0, x: 80 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.7, delay: 0.4 }}
               style={{ 
                  flex: '0 0 48%', 
                  maxWidth: 520, 
                  background: '#fff', 
                  borderRadius: 18, 
                  boxShadow: '0 4px 24px #ffe08255', 
                  padding: 24, 
                  minHeight: 320, 
                  maxHeight: '70vh', 
                  overflowY: 'auto', 
                  display: currentVideo || courseContent.length ? 'block' : 'none',
                  marginBottom: 24,
               }}
            >
               {currentVideo ? (
                  <>
                  <ReactPlayer
                     ref={playerRef}
                     url={currentVideo}
                     width='100%'
                     height='320px'
                     controls
                     style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 18 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                     <Button variant="contained" color="primary" onClick={() => playerRef.current && playerRef.current.getInternalPlayer() && playerRef.current.getInternalPlayer().play && playerRef.current.getInternalPlayer().play()}>Play</Button>
                     <Button variant="contained" color="warning" onClick={() => playerRef.current && playerRef.current.getInternalPlayer() && playerRef.current.getInternalPlayer().pause && playerRef.current.getInternalPlayer().pause()}>Pause</Button>
                     <Button 
                        variant="contained" 
                        sx={{
                           backgroundColor: '#43a047 !important', // green
                           color: '#fff !important',
                           transition: 'all 0.2s',
                           '&:hover': {
                              backgroundColor: '#d32f2f !important', // red on hover
                              color: '#fff !important',
                              boxShadow: '0 0 8px 2px #d32f2f55',
                              transform: 'scale(1.07)',
                           }
                        }}
                        onClick={() => {
                           if (playerRef.current && playerRef.current.getInternalPlayer()) {
                              playerRef.current.seekTo(0);
                              playerRef.current.getInternalPlayer().pause && playerRef.current.getInternalPlayer().pause();
                           }
                        }}
                     >
                        Stop
                     </Button>
                  </div>
                  {/* Next/Previous Navigation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      disabled={currentSectionIndex <= 0}
                      onClick={() => {
                        if (currentSectionIndex > 0) {
                          const prevSection = courseContent[currentSectionIndex - 1];
                          let prevVideoPath = null;
                          if (prevSection && prevSection.S_content) {
                            if (typeof prevSection.S_content === 'string') {
                              prevVideoPath = prevSection.S_content;
                            } else if (typeof prevSection.S_content === 'object' && prevSection.S_content.path) {
                              prevVideoPath = prevSection.S_content.path;
                            }
                          }
                          if (prevVideoPath) {
                            playVideo(`http://localhost:5000/uploads/${prevVideoPath}`, currentSectionIndex - 1);
                          }
                        } else {
                          alert('You have reached the starting video.');
                        }
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={currentSectionIndex === -1 || currentSectionIndex >= courseContent.length - 1}
                      onClick={() => {
                        if (currentSectionIndex < courseContent.length - 1) {
                          const nextSection = courseContent[currentSectionIndex + 1];
                          let nextVideoPath = null;
                          if (nextSection && nextSection.S_content) {
                            if (typeof nextSection.S_content === 'string') {
                              nextVideoPath = nextSection.S_content;
                            } else if (typeof nextSection.S_content === 'object' && nextSection.S_content.path) {
                              nextVideoPath = nextSection.S_content.path;
                            }
                          }
                          if (nextVideoPath) {
                            playVideo(`http://localhost:5000/uploads/${nextVideoPath}`, currentSectionIndex + 1);
                          }
                        } else {
                          alert('You have reached the last video.');
                        }
                      }}
                    >
                      Next
                    </Button>
                  </div>
                  </>
               ) : (
                  <div style={{ textAlign: 'center', color: '#888', fontSize: 22, marginTop: 60 }}>
                     <i className="bi bi-play-circle" style={{fontSize: 48, color: '#ffb300'}}></i>
                     <div style={{marginTop: 12}}>Select a section and play the video</div>
                  </div>
               )}
            </motion.div>
         </motion.div>
         {/* Responsive style for mobile/tablet */}
         <style>{`
            @media (max-width: 900px) {
               .course-content { flex-direction: column !important; gap: 0 !important; }
               .course-section, .course-video { max-width: 100% !important; min-width: 0 !important; }
            }
            .stop-btn-hover-red:hover {
               background-color: #d32f2f !important;
               color: #fff !important;
            }
         `}</style>
         <Modal
            size="lg"
            show={showModal}
            onHide={() => setShowModal(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
         >
            <Modal.Header closeButton>
               <Modal.Title id="example-custom-modal-styling-title">
                  Completion Certificate
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
               >
                  Congratulations! You have completed all sections. Here is your certificate
                  <div id='certificate-download' className="certificate text-center">
                     <h1>Certificate of Completion</h1>
                     <div className="content">
                        <p>This is to certify that</p>
                        <h2>{user.userData.name}</h2>
                        <p>has successfully completed the course</p>
                        <h3>{courseTitle}</h3>
                        <p>on</p>
                        <p className="date">{new Date(certificate).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <Button className='download-cert-btn' onClick={() => downloadPdfDocument('certificate-download')} style={{ float: 'right', marginTop: 3 }}>Download Certificate</Button>
               </motion.div>
            </Modal.Body>
         </Modal>
      </>
   );
};

export default CourseContent;

