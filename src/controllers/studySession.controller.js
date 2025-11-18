import {
  createStudySession as createStudySessionService,
  getAllStudySessions as getAllStudySessionsService,
  getStudySessionById as getStudySessionByIdService,
  updateStudySession as updateStudySessionService,
  deleteStudySession as deleteStudySessionService,
  joinStudySession as joinStudySessionService,
  leaveStudySession as leaveStudySessionService,
  getStudySessionParticipants as getStudySessionParticipantsService
} from '../services/studySession.service.js'

async function createStudySession(req, res, next) {
  try {
    const creatorId = req.userData.id
    const sessionData = req.body

    const studySession = await createStudySessionService(creatorId, sessionData)
    res.status(201).send({
      status: 'success',
      message: 'Study session created successfully',
      data: studySession
    })
  } catch (error) {
    next(error)
  }
}

async function getAllStudySessions(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const filters = {
      status: req.query.status,
      studyType: req.query.studyType
    }
    const userId = req.userData.id

    const result = await getAllStudySessionsService(page, limit, filters, userId)
    res.status(200).send({
      status: 'success',
      message: 'Study sessions retrieved successfully',
      data: result.sessions,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

async function getStudySessionById(req, res, next) {
  try {
    const { sessionId } = req.params
    const userId = req.userData.id

    const studySession = await getStudySessionByIdService(sessionId, userId)
    res.status(200).send({
      status: 'success',
      message: 'Study session retrieved successfully',
      data: studySession
    })
  } catch (error) {
    next(error)
  }
}

async function updateStudySession(req, res, next) {
  try {
    const { sessionId } = req.params
    const creatorId = req.userData.id
    const updateData = req.body

    const studySession = await updateStudySessionService(
      sessionId,
      creatorId,
      updateData
    )
    res.status(200).send({
      status: 'success',
      message: 'Study session updated successfully',
      data: studySession
    })
  } catch (error) {
    next(error)
  }
}

async function deleteStudySession(req, res, next) {
  try {
    const { sessionId } = req.params
    const creatorId = req.userData.id

    const result = await deleteStudySessionService(sessionId, creatorId)
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

async function joinStudySession(req, res, next) {
  try {
    const { sessionId } = req.params
    const userId = req.userData.id

    const studySession = await joinStudySessionService(sessionId, userId)
    res.status(200).send({
      status: 'success',
      message: 'Joined study session successfully',
      data: studySession
    })
  } catch (error) {
    next(error)
  }
}

async function leaveStudySession(req, res, next) {
  try {
    const { sessionId } = req.params
    const userId = req.userData.id

    const result = await leaveStudySessionService(sessionId, userId)
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

async function getStudySessionParticipants(req, res, next) {
  try {
    const { sessionId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const result = await getStudySessionParticipantsService(sessionId, page, limit)
    res.status(200).send({
      status: 'success',
      message: 'Participants retrieved successfully',
      data: result.participants,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

export {
  createStudySession,
  getAllStudySessions,
  getStudySessionById,
  updateStudySession,
  deleteStudySession,
  joinStudySession,
  leaveStudySession,
  getStudySessionParticipants
}
