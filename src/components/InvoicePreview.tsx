import { useRef } from "react"
import { Invoice } from "../types"
import React from "react"
import html2pdf from "html2pdf.js"

export default function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const ref = useRef(null)

  const handleExport = () => {
    if (!ref.current) return
    const opt = {
      margin: 0.5,
      filename: invoice.invoiceNumber + ".pdf",
      image: { type: "jpeg" as "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
    }
    html2pdf().set(opt).from(ref.current).save()
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Invoice — {invoice.invoiceNumber}</h2>
        <button onClick={handleExport} className="bg-green-600 text-white px-3 py-1 rounded">
          Export PDF
        </button>
      </div>

      <div ref={ref} className="p-4 border rounded">
        <div className="flex justify-between mb-4">
          <pre className="text-sm whitespace-pre-wrap">{invoice.from}</pre>
          <pre className="text-sm whitespace-pre-wrap text-right">{invoice.to}</pre>
        </div>

        <table className="w-full text-sm border-t border-b">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th className="text-right">Prize</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it) => (
              <tr key={it.id} className="border-t">
                <td>{it.description}</td>
                <td>{it.qty}</td>
                <td>₹{it.price.toFixed(2)}</td>
                <td className="text-right">₹{it.prize.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right">
          <div>Subtotal: ₹{invoice.subtotal.toFixed(2)}</div>
          <div>Tax: ₹{invoice.tax.toFixed(2)}</div>
          <div className="text-lg font-semibold">Total: ₹{invoice.total.toFixed(2)}</div>
        </div>

        <div className="mt-4 text-sm">
          <strong>Notes:</strong>
          <div>{invoice.notes || "—"}</div>
        </div>
      </div>
    </div>
  )
}
