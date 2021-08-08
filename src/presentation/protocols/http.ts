export interface IHttpResponse {
  statusCode: number
  body: any
}

// export interface IHttpRequest{
//   body: {
//     email: string
//     name: string
//     password: string
//     passwordConfirmation: string
//   }
// }

export interface IHttpRequest{
  body?: any
}
