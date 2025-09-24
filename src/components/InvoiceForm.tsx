import React, { useState } from "react"
import { Invoice, LineItem } from "../types"

const emptyItem = (): LineItem => ({
  id: Math.random().toString(36).slice(2, 9),
  description: "",
  qty: 1,
  price: 0,
  prize: 0,
})

export default function InvoiceForm({ onSave }: { onSave: (inv: Invoice) => void }) {
  const [data, setData] = useState<Omit<Invoice, "subtotal" | "tax" | "total">>({
    id: Math.random().toString(36).slice(2, 9),
    from: "ACME Corp\n123 Business Rd\nCity, Country",
    to: "Client Name\nClient Address",
    invoiceNumber: "INV-" + Math.floor(Math.random() * 9000 + 1000),
    dueDate: "",
    items: [emptyItem()],
    notes: "",
  })

  const update = (patch: Partial<typeof data>) => setData((d) => ({ ...d, ...patch }))

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    update({
      items: data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    })
  }

  const addItem = () => update({ items: [...data.items, emptyItem()] })
  const removeItem = (id: string) => update({ items: data.items.filter((it) => it.id !== id) })

  // totals
  const subtotal = data.items.reduce((s, it) => s + (it.prize || 0), 0)
  const tax = +(subtotal * 0.18).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const invoice: Invoice = { ...data, subtotal, tax, total }
    onSave(invoice)
    update({
      invoiceNumber: "INV-" + Math.floor(Math.random() * 9000 + 1000),
      items: [emptyItem()],
    })
  }

  return (
    <form className="bg-white rounded shadow p-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-medium mb-3">Create Invoice</h2>

      {/* Sender / Receiver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <div className="text-sm text-gray-600">From</div>
          <textarea
            value={data.from}
            onChange={(e) => update({ from: e.target.value })}
            className="mt-1 w-full border rounded p-2"
            rows={3}
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600">To</div>
          <textarea
            value={data.to}
            onChange={(e) => update({ to: e.target.value })}
            className="mt-1 w-full border rounded p-2"
            rows={3}
          />
        </label>

        <label>
          <div className="text-sm text-gray-600">Invoice #</div>
          <input
            value={data.invoiceNumber}
            onChange={(e) => update({ invoiceNumber: e.target.value })}
            className="mt-1 w-full border rounded p-2"
          />
        </label>

        <label>
          <div className="text-sm text-gray-600">Due Date</div>
          <input
            type="date"
            value={data.dueDate}
            onChange={(e) => update({ dueDate: e.target.value })}
            className="mt-1 w-full border rounded p-2"
          />
        </label>
      </div>

      {/* Line Items */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Line Items</h3>
          <button type="button" onClick={addItem} className="text-sm underline">
            + Add item
          </button>
        </div>

        {/* Headings row */}
        <div className="grid grid-cols-12 gap-2 font-semibold text-sm text-gray-600 border-b pb-1">
          <div className="col-span-3">Description</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-2">Unit Price</div>
          <div className="col-span-3">Prize</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Input rows */}
        <div className="mt-2 space-y-2">
          {data.items.map((it) => (
            <div key={it.id} className="grid grid-cols-12 gap-2 items-center">
              <input
                className="col-span-3 border rounded p-2 text-sm"
                placeholder="Item description"
                value={it.description}
                onChange={(e) => updateItem(it.id, { description: e.target.value })}
              />
              <input
                type="number"
                className="col-span-2 border rounded p-2 text-sm"
                placeholder="Qty"
                value={it.qty}
                onChange={(e) => {
                  const qty = Number(e.target.value)
                  updateItem(it.id, { qty, prize: qty * it.price })
                }}
              />
              <input
                type="number"
                className="col-span-2 border rounded p-2 text-sm"
                placeholder="Unit Price"
                value={it.price}
                onChange={(e) => {
                  const price = Number(e.target.value)
                  updateItem(it.id, { price, prize: price * it.qty })
                }}
              />
              <input
                type="number"
                className="col-span-3 border rounded p-2 text-sm"
                placeholder="Prize (editable)"
                value={it.prize}
                onChange={(e) => updateItem(it.id, { prize: Number(e.target.value) })}
              />
              <div className="col-span-2 text-right">
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <label className="block mt-6">
        <div className="text-sm text-gray-600">Notes</div>
        <textarea
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
          className="mt-1 w-full border rounded p-2"
          rows={3}
        />
      </label>

      {/* Totals */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm">
          Subtotal: <b>₹{subtotal.toFixed(2)}</b>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Save Invoice
        </button>
      </div>
    </form>
  )
}
