import Report from '../models/report.js'
import Post from '../models/post.js'

async function reportPost(userId, postId, reason) {
  try {
    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      const err = new Error()
      err.message = 'Post not found'
      err.status = 404
      throw err
    }

    // Check if user already reported this post
    const existingReport = await Report.findOne({ postId, userId })
    if (existingReport) {
      const err = new Error()
      err.message = 'You have already reported this post'
      err.status = 400
      throw err
    }

    // Create report
    const report = await new Report({
      postId,
      userId,
      reason
    }).save()

    // Increment report count on post
    await Post.findByIdAndUpdate(postId, { $inc: { reportCount: 1 } })

    return {
      message: 'Post reported successfully',
      report
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getReportsByPost(postId) {
  try {
    const reports = await Report.find({ postId })
      .populate('userId', 'email displayName profileImage')
      .sort({ createdAt: -1 })

    return reports
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  reportPost,
  getReportsByPost
}
