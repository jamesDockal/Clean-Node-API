
class InvalidParamError extends Error {
  constructor (field: string) {
    super(`Invalid field: ${field}`)
    this.name = 'InvalidField'
  }
}

export default InvalidParamError
