export interface SuccessResponse<Data = void> {
  mesage: string
  success: boolean
  result: Data
}
