const router = require('express').Router()

const svc = require('./service')

router.post('/', async (req, res) => {
  try {
    const data = await svc.diffing(req.body.last_sync_at)

    const hasil = svc.reducer(data)
    console.log(`hasil:`)
    for (const query of hasil) {
      console.log(query)
    }

    return res.json(data)

  } catch (error) {
    console.log(error)
    return res.json({ status: 'fail' })
  }
})

module.exports = router