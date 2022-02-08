export interface IResponse<T> {
  status?: number
  success?: boolean
  message?: string
  errorCode?: any
  data?: T
  error?: any
}
