const redis = require('redis')
const fetch = require('node-fetch')
const client = require('../util/cache')
exports.getRepos = async function(req, res, next) {
    try {
        data = await client.get('lok')
        res.json({ data: data })
    } catch (err) {
        console.error(err)
        res.status(500)

    }
}