import * as AnnotationService from '../services/annotation.service.js';

export default (io, socket) => {
  const joinSession = ({ session_id, user_id }) => {
    if (!session_id || !user_id) {
      console.error('Invalid data for join_session', { session_id, user_id });
      return;
    }
    socket.join(session_id);
    console.log(`User ${user_id} with socket ${socket.id} joined session room: ${session_id}`);
    socket.to(session_id).emit('user_joined', { userId: user_id });
  };

  const handlePageChange = ({ session_id, page_number }) => {
     if (!session_id || page_number === undefined) {
      console.error('Invalid data for teacher_page_change', { session_id, page_number });
      return;
    }
    io.to(session_id).emit('page_changed', { page_number });
    console.log(`Teacher changed page to ${page_number} in session ${session_id}`);
  };

  const handleNewAnnotation = async ({ session_id, annotationData }) => {
    if (!session_id || !annotationData) {
       console.error('Invalid data for add_annotation_realtime', { session_id, annotationData });
       return;
    }
    try {
      const newAnnotation = await AnnotationService.createAnnotation(annotationData.user_id, annotationData);
      io.to(session_id).emit('new_annotation', { annotationData: newAnnotation });
       console.log(`New annotation added in session ${session_id}`);
    } catch (error) {
      console.error('Error saving real-time annotation:', error);
      socket.emit('annotation_error', { message: 'Could not save annotation.' });
    }
  };

  const handleDisconnect = () => {
    console.log(`Socket ${socket.id} disconnected.`);
  };


  socket.on('join_session', joinSession);
  socket.on('teacher_page_change', handlePageChange);
  socket.on('add_annotation_realtime', handleNewAnnotation);
  socket.on('disconnect', handleDisconnect);
};
