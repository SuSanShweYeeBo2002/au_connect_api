import { reportPost } from '../services/report.service.js'

async function reportPostController(req, res, next) {
  try {
    const userId = req.userData.id
    const { postId } = req.params
    const { reason } = req.body

    const result = await reportPost(userId, postId, reason)

    res.status(200).send({
      status: 'success',
      message: result.message,
      data: result.report
    })
  } catch (error) {
    next(error)
  }
}

export {
  reportPostController
}
