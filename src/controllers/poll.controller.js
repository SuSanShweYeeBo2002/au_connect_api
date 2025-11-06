import {
  createPoll as createPollService,
  getAllPolls as getAllPollsService,
  getPollById as getPollByIdService,
  voteOnPoll as voteOnPollService,
  deletePoll as deletePollService
} from '../services/poll.service.js'

async function createPoll(req, res, next) {
  try {
    const { question, options, expiresAt } = req.body
    const authorId = req.userData.id

    const poll = await createPollService(authorId, question, options, expiresAt)
    res.status(201).send({
      status: 'success',
      message: 'Poll created successfully',
      data: poll
    })
  } catch (error) {
    next(error)
  }
}

async function getAllPolls(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const userId = req.userData.id

    const result = await getAllPollsService(page, limit, userId)
    res.status(200).send({
      status: 'success',
      message: 'Polls retrieved successfully',
      data: result.polls,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

async function getPollById(req, res, next) {
  try {
    const { pollId } = req.params
    const userId = req.userData.id

    const poll = await getPollByIdService(pollId, userId)
    res.status(200).send({
      status: 'success',
      message: 'Poll retrieved successfully',
      data: poll
    })
  } catch (error) {
    next(error)
  }
}

async function voteOnPoll(req, res, next) {
  try {
    const { pollId } = req.params
    const { optionIndex } = req.body
    const userId = req.userData.id

    const poll = await voteOnPollService(pollId, optionIndex, userId)
    res.status(200).send({
      status: 'success',
      message: 'Vote recorded successfully',
      data: poll
    })
  } catch (error) {
    next(error)
  }
}

async function deletePoll(req, res, next) {
  try {
    const { pollId } = req.params
    const userId = req.userData.id

    const result = await deletePollService(pollId, userId)
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

export {
  createPoll,
  getAllPolls,
  getPollById,
  voteOnPoll,
  deletePoll
}
