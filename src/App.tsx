import { useEffect, useState } from "react"
import React from "react"
import InvoiceForm from "./components/InvoiceForm"
import InvoicePreview from "./components/InvoicePreview"
import InvoiceList from "./components/InvoiceList"
import { Invoice } from "./types"

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("invoices") || "[]")
    } catch {
      return []
    }
  })
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices))
  }, [invoices])

  const addInvoice = (inv: Invoice) => {
    const id = Date.now().toString()
    const newInv: Invoice = { ...inv, id, createdAt: new Date().toISOString() }
    setInvoices((prev) => [newInv, ...prev])
    setSelected(newInv)
  }

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const filteredInvoices = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Invoice App (TSX)</h1>
        <p className="text-sm text-gray-600">
          Create invoices, preview live, save locally, export to PDF.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form + Preview side by side */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InvoiceForm onSave={addInvoice} />
          {selected ? (
            <InvoicePreview invoice={selected} />
          ) : (
            <div className="rounded border border-dashed border-gray-200 p-6 text-center text-gray-500">
              Select or create an invoice to preview it here.
            </div>
          )}
        </div>

        {/* Right: Invoice List */}
        <aside className="lg:col-span-1">
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded p-2 mb-3"
          />
          <InvoiceList
            invoices={filteredInvoices}
            onSelect={(invoice) => {
              const fullInvoice = invoices.find((i) => i.id === invoice.id)
              setSelected(fullInvoice ?? null)
            }}
            onDelete={deleteInvoice}
          />
        </aside>
      </div>
    </div>
  )
}
