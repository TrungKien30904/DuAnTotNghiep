import { useState, useRef } from "react";

export default function InvoicePrinter() {
  const [invoice, setInvoice] = useState({
    customerName: "",
    items: [{ nameProduct: "", quantity: 1, price: 0 }],
  });
  const invoiceRef = useRef();

  const handleInputChange = (e, index = null, field = null) => {
    if (index !== null && field) {
      const newItems = [...invoice.items];
      newItems[index][field] = e.target.value;
      setInvoice({ ...invoice, items: newItems });
    } else {
      setInvoice({ ...invoice, [e.target.name]: e.target.value });
    }
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { nameProduct: "", quantity: 1, price: 0 }],
    });
  };

  const printInvoice = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Hóa Đơn</h2>
      <input
        type="text"
        name="customerName"
        value={invoice.customerName}
        onChange={handleInputChange}
        placeholder="Tên khách hàng"
        className="w-full p-2 border rounded mb-4"
      />
      <div>
        {invoice.items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item.nameProduct}
              onChange={(e) => handleInputChange(e, index, "nameProduct")}
              placeholder="Tên sản phẩm"
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, index, "quantity")}
              placeholder="số lượng sản phẩm"
              className="w-1/4 p-2 border rounded"
            />
            <input
              type="number"
              value={item.price}
              onChange={(e) => handleInputChange(e, index, "price")}
              placeholder="giá sản phẩm"
              className="w-1/4 p-2 border rounded"
            />
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Thêm mục
      </button>
      <button
        onClick={printInvoice}
        className="mt-4 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        In hóa đơn
      </button>
      <div className="hidden">
        <div ref={invoiceRef}>
          <h2 className="text-xl font-bold">Hóa Đơn</h2>
          <p>Tên khách hàng: {invoice.customerName}</p>
          <table className="w-full border-collapse border border-gray-500">
            <thead>
              <tr>
                <th className="border p-2">Tên sản phẩm</th>
                <th className="border p-2">Số lượng</th>
                <th className="border p-2">Giá</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.nameProduct}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


