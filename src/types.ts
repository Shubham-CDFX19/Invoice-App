export interface LineItem {
  id: string
  description: string
  qty: number
  price: number
  prize: number
}

export interface Invoice {
  id: string | number
  from: string
  to: string
  invoiceNumber: string
  dueDate: string
  items: LineItem[]
  notes: string
  subtotal: number
  tax: number
  total: number
  createdAt?: string
}
