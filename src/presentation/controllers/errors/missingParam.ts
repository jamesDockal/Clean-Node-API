
class MissingParamError extends Error {
  constructor (field) {
    super(`Missing param: ${field}`)
    this.name = 'MissingParamError'
  }
}

export default MissingParamError
