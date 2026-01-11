import Poll from '../models/poll.js'
import mongoose from 'mongoose'

async function createPoll(authorId, question, options, expiresAt = null) {
  try {
    // Transform options array into poll option objects
    const pollOptions = options.map(optionText => ({
      text: optionText,
      votes: 0,
      voters: []
    }))

    const poll = await new Poll({
      author: authorId,
      question,
      options: pollOptions,
      totalVotes: 0,
      expiresAt,
      isExpired: false
    }).save()
    
    return poll.populate('author', 'email displayName profileImage')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getAllPolls(page = 1, limit = 10, userId = null) {
  try {
    const skip = (page - 1) * limit
    
    // Get polls and populate voters with user data
    const polls = await Poll.find()
      .populate('author', 'email displayName profileImage')
      .populate('options.voters', 'email displayName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalPolls = await Poll.countDocuments()
    
    // Check expiry status for each poll
    await Promise.all(polls.map(poll => poll.checkExpiry()))
    
    // If userId is provided, add voting status for the user
    let pollsWithVoteStatus = polls
    if (userId) {
      pollsWithVoteStatus = polls.map(poll => {
        const pollObj = poll.toObject()
        
        // Check if user has voted on this poll and find the option index
        let userVotedOptionIndex = null
        pollObj.options.forEach((option, index) => {
          if (option.voters.some(voterId => voterId.toString() === userId.toString())) {
            userVotedOptionIndex = index
          }
        })
        
        pollObj.hasVoted = userVotedOptionIndex !== null
        pollObj.votedOptionIndex = userVotedOptionIndex
        
        return pollObj
      })
    }
    
    return {
      polls: pollsWithVoteStatus,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPolls / limit),
        totalPolls,
        hasNext: page < Math.ceil(totalPolls / limit),
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

async function getPollById(pollId, userId = null) {
  try {
    const poll = await Poll.findById(pollId)
      .populate('author', 'email displayName profileImage')
      .populate('options.voters', 'email displayName profileImage')
    
    if (!poll) {
      const err = new Error()
      err.message = 'Poll not found'
      err.status = 404
      throw err
    }
    
    // Check expiry
    await poll.checkExpiry()
    
    const pollObj = poll.toObject()
    
    // If userId is provided, check if user has voted and find the option index
    if (userId) {
      let userVotedOptionIndex = null
      pollObj.options.forEach((option, index) => {
        if (option.voters.some(voterId => voterId.toString() === userId.toString())) {
          userVotedOptionIndex = index
        }
      })
      
      pollObj.hasVoted = userVotedOptionIndex !== null
      pollObj.votedOptionIndex = userVotedOptionIndex
    }
    
    return pollObj
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function voteOnPoll(pollId, optionIndex, userId) {
  try {
    const poll = await Poll.findById(pollId)
    
    if (!poll) {
      const err = new Error()
      err.message = 'Poll not found'
      err.status = 404
      throw err
    }
    
    // Check if poll is expired
    await poll.checkExpiry()
    if (poll.isExpired || poll.expired) {
      const err = new Error()
      err.message = 'This poll has expired'
      err.status = 400
      throw err
    }
    
    // Validate option index
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      const err = new Error()
      err.message = 'Invalid option index'
      err.status = 400
      throw err
    }
    
    // Check if user has already voted and find their previous vote
    let previousVoteIndex = null
    poll.options.forEach((option, index) => {
      const voterIndex = option.voters.findIndex(
        voterId => voterId.toString() === userId.toString()
      )
      if (voterIndex !== -1) {
        previousVoteIndex = index
      }
    })
    
    // If user already voted for the same option, do nothing
    if (previousVoteIndex === optionIndex) {
      const updatedPoll = await Poll.findById(pollId)
        .populate('author', 'email')
        .populate('options.voters', 'email')
      
      const pollObj = updatedPoll.toObject()
      pollObj.hasVoted = true
      pollObj.votedOptionIndex = optionIndex
      
      return pollObj
    }
    
    // If user voted for a different option, remove the old vote
    if (previousVoteIndex !== null) {
      const previousOption = poll.options[previousVoteIndex]
      previousOption.voters = previousOption.voters.filter(
        voterId => voterId.toString() !== userId.toString()
      )
      previousOption.votes -= 1
      poll.totalVotes -= 1
    }
    
    // Add new vote
    const option = poll.options[optionIndex]
    option.votes += 1
    option.voters.push(userId)
    poll.totalVotes += 1
    
    await poll.save()
    
    // Return updated poll with user vote status and populated voters
    const updatedPoll = await Poll.findById(pollId)
      .populate('author', 'email')
      .populate('options.voters', 'email')
    
    const pollObj = updatedPoll.toObject()
    pollObj.hasVoted = true
    pollObj.votedOptionIndex = optionIndex
    
    return pollObj
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function deletePoll(pollId, userId) {
  try {
    const poll = await Poll.findById(pollId)
    
    if (!poll) {
      const err = new Error()
      err.message = 'Poll not found'
      err.status = 404
      throw err
    }
    
    // Check if user is the author
    if (poll.author.toString() !== userId.toString()) {
      const err = new Error()
      err.message = 'You are not authorized to delete this poll'
      err.status = 403
      throw err
    }
    
    await Poll.findByIdAndDelete(pollId)
    
    return { message: 'Poll deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  createPoll,
  getAllPolls,
  getPollById,
  voteOnPoll,
  deletePoll
}
