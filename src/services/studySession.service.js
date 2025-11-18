import StudySession from '../models/studySession.js'
import StudySessionParticipant from '../models/studySessionParticipant.js'

async function createStudySession(creatorId, sessionData) {
  try {
    const {
      title,
      description,
      subject,
      platform,
      platformLink,
      studyType,
      location,
      maxParticipants,
      scheduledDate,
      duration
    } = sessionData

    const studySession = await new StudySession({
      creator: creatorId,
      title,
      description,
      subject,
      platform,
      platformLink,
      studyType,
      location,
      maxParticipants,
      scheduledDate,
      duration
    }).save()

    // Add creator as first participant
    await new StudySessionParticipant({
      sessionId: studySession._id,
      userId: creatorId,
      status: 'Joined'
    }).save()

    return studySession.populate('creator', 'email')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getAllStudySessions(page = 1, limit = 10, filters = {}, userId = null) {
  try {
    const skip = (page - 1) * limit
    const query = { isActive: true }

    // Add filters if provided
    if (filters.status) {
      query.status = filters.status
    }
    if (filters.studyType) {
      query.studyType = filters.studyType
    }

    const studySessions = await StudySession.find(query)
      .populate('creator', 'email')
      .sort({ scheduledDate: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalSessions = await StudySession.countDocuments(query)

    // Add hasJoined field if userId is provided
    let sessionsWithJoinStatus = studySessions
    if (userId) {
      const sessionIds = studySessions.map(session => session._id)
      
      // Find all joined sessions for this user
      const userParticipations = await StudySessionParticipant.find({
        sessionId: { $in: sessionIds },
        userId: userId,
        status: 'Joined'
      }).select('sessionId')
      
      const joinedSessionIds = new Set(userParticipations.map(p => p.sessionId.toString()))
      
      // Add hasJoined field to each session
      sessionsWithJoinStatus = studySessions.map(session => {
        const sessionObj = session.toObject()
        sessionObj.hasJoined = joinedSessionIds.has(session._id.toString())
        return sessionObj
      })
    }

    return {
      sessions: sessionsWithJoinStatus,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalSessions / limit),
        totalSessions,
        hasNext: page < Math.ceil(totalSessions / limit),
        hasPrev: page > 1
      }
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getStudySessionById(sessionId, userId = null) {
  try {
    const studySession = await StudySession.findById(sessionId)
      .populate('creator', 'email')

    if (!studySession) {
      const err = new Error()
      err.message = 'Study session not found'
      err.status = 404
      throw err
    }

    // Add hasJoined field if userId is provided
    let sessionWithJoinStatus = studySession
    if (userId) {
      const participation = await StudySessionParticipant.findOne({
        sessionId,
        userId,
        status: 'Joined'
      })
      
      const sessionObj = studySession.toObject()
      sessionObj.hasJoined = !!participation
      sessionWithJoinStatus = sessionObj
    }

    return sessionWithJoinStatus
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function updateStudySession(sessionId, creatorId, updateData) {
  try {
    const studySession = await StudySession.findOne({
      _id: sessionId,
      creator: creatorId
    })

    if (!studySession) {
      const err = new Error()
      err.message = 'Study session not found or unauthorized'
      err.status = 404
      throw err
    }

    // Check if session can be updated (not completed or cancelled)
    if (studySession.status === 'Completed' || studySession.status === 'Cancelled') {
      const err = new Error()
      err.message = `Cannot update ${studySession.status.toLowerCase()} study session`
      err.status = 400
      throw err
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        studySession[key] = updateData[key]
      }
    })

    await studySession.save()
    return studySession.populate('creator', 'email')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function deleteStudySession(sessionId, creatorId) {
  try {
    const studySession = await StudySession.findOne({
      _id: sessionId,
      creator: creatorId
    })

    if (!studySession) {
      const err = new Error()
      err.message = 'Study session not found or unauthorized'
      err.status = 404
      throw err
    }

    // Soft delete
    studySession.isActive = false
    studySession.status = 'Cancelled'
    await studySession.save()

    return { message: 'Study session deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function joinStudySession(sessionId, userId) {
  try {
    const studySession = await StudySession.findById(sessionId)

    if (!studySession) {
      const err = new Error()
      err.message = 'Study session not found'
      err.status = 404
      throw err
    }

    // Check if session is active
    if (!studySession.isActive) {
      const err = new Error()
      err.message = 'Study session is not active'
      err.status = 400
      throw err
    }

    // Check if already joined (active participant)
    const existingParticipant = await StudySessionParticipant.findOne({
      sessionId,
      userId,
      status: 'Joined'
    })

    if (existingParticipant) {
      const err = new Error()
      err.message = 'You have already joined this study session'
      err.status = 400
      throw err
    }

    // Check if session is full
    if (studySession.maxParticipants && 
        studySession.currentParticipants >= studySession.maxParticipants) {
      const err = new Error()
      err.message = 'Study session is full'
      err.status = 400
      throw err
    }

    // Check if session has already started or passed
    if (studySession.status === 'Completed' || studySession.status === 'Cancelled') {
      const err = new Error()
      err.message = `Cannot join ${studySession.status.toLowerCase()} study session`
      err.status = 400
      throw err
    }

    // Add user to participants
    await new StudySessionParticipant({
      sessionId,
      userId,
      status: 'Joined'
    }).save()

    studySession.currentParticipants += 1
    await studySession.save()

    return studySession.populate('creator', 'email')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function leaveStudySession(sessionId, userId) {
  try {
    const studySession = await StudySession.findById(sessionId)

    if (!studySession) {
      const err = new Error()
      err.message = 'Study session not found'
      err.status = 404
      throw err
    }

    // Check if user is the creator
    if (studySession.creator.toString() === userId.toString()) {
      const err = new Error()
      err.message = 'Creator cannot leave the study session. Delete it instead.'
      err.status = 400
      throw err
    }

    // Check if user is a participant
    const participant = await StudySessionParticipant.findOne({
      sessionId,
      userId,
      status: 'Joined'
    })

    if (!participant) {
      const err = new Error()
      err.message = 'You are not a participant of this study session'
      err.status = 400
      throw err
    }

    // Update participant status to Left
    participant.status = 'Left'
    await participant.save()

    studySession.currentParticipants -= 1
    await studySession.save()

    return { message: 'Left study session successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getStudySessionParticipants(sessionId, page = 1, limit = 20) {
  try {
    const studySession = await StudySession.findById(sessionId)

    if (!studySession) {
      const err = new Error()
      err.message = 'Study session not found'
      err.status = 404
      throw err
    }

    const skip = (page - 1) * limit

    const participants = await StudySessionParticipant.find({
      sessionId,
      status: 'Joined'
    })
      .populate('userId', 'email')
      .sort({ joinedAt: 1 })
      .skip(skip)
      .limit(limit)

    const totalParticipants = await StudySessionParticipant.countDocuments({
      sessionId,
      status: 'Joined'
    })

    return {
      participants: participants.map(p => ({
        user: p.userId,
        joinedAt: p.joinedAt
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalParticipants / limit),
        totalParticipants,
        hasNext: page < Math.ceil(totalParticipants / limit),
        hasPrev: page > 1
      }
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
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
