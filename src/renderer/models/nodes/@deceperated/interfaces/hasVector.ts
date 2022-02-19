import { VectorType } from '../svg/VectorType'

export default interface hasVector {
  vectorType: VectorType,
  vectorData: any,
  setVector(type: VectorType, data?: object | null): this
}
