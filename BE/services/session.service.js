import * as SessionRepository from '../repositories/session.repository.js';

export const joinSession = async (userId, invitationCode) => {
  const session = await SessionRepository.findSessionByCode(invitationCode);

  if (!session) {
    const error = new Error('Session with that invitation code does not exist.');
    error.statusCode = 404;
    error.code = 'SESSION_NOT_FOUND';
    throw error;
  }

  if (session.status !== 'pending') {
    const error = new Error('This session is not available to join.');
    error.statusCode = 403;
    error.code = 'SESSION_NOT_PENDING';
    throw error;
  }

  // Update session and return key info
  const updatedSession = await SessionRepository.updateSessionUser(session.session_id, userId, 'active');

  return {
    session_id: updatedSession.session_id,
    textbook_id: updatedSession.textbook_id,
  };
};
