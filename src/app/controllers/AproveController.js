const purchase = require('../models/Purchase')
class AproveController {
  async update (req, res) {
    const { id } = req.params
    const { ad } = await purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })
    if (ad.purchasedBy) {
      return res.status(400).json({ error: 'O produto já foi comprado' })
    }
    if (!ad.author._id.equals(req.userId)) {
      return res
        .status(401)
        .json({ error: 'Você não é o criador desse anúncio' })
    }
    ad.purchasedBy = id
    await ad.save()
    return res.json(ad)
  }
}
module.exports = new AproveController()
