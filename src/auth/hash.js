const upash = require('upash')

// TODO: abstract hash method so can switch implementations
upash.install('argon2', require('@phc/argon2'))

async function hash(plainText) {
  return await upash.hash(plainText)
}

async function verify(hashStr, plainText) {
  return await upash.verify(hashStr, plainText);
}

module.exports = {
  hash,
  verify,
}