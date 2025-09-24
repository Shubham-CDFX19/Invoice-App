import React from 'react'

type Invoice = {
  id: string | number;
  invoiceNumber: string;
  total?: number;
  // add other fields as needed
};

type InvoiceListProps = {
  invoices: Invoice[];
  onSelect: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
};

export default function InvoiceList({ invoices, onSelect, onDelete }: InvoiceListProps){
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium">Invoices</h3>
        <div className="text-sm text-gray-500">{invoices.length}</div>
      </div>

      {invoices.length===0 ? (
        <div className="text-center text-gray-500 py-8">No invoices yet. Create one!</div>
      ) : (
        <ul className="space-y-2">
          {invoices.map(inv=>(
            <li key={inv.id} className="flex items-center justify-between border rounded p-2">
              <div className="cursor-pointer" onClick={()=>onSelect(inv)}>
                <div className="font-medium">{inv.invoiceNumber}</div>
                <div className="text-xs text-gray-500">₹{Number(inv.total||0).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>onSelect(inv)} className="text-sm text-indigo-600">View</button>
                <button onClick={()=>onDelete(inv.id.toString())} className="text-sm text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
