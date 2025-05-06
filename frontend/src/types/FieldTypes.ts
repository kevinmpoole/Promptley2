export type AttributeField = {
  key: string
  label: string
  type: string
  required?: boolean
  options?: string[]
  children?: AttributeField[]
}
