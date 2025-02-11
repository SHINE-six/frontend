'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RealtimeStockTradingPlatformPage() {
  const [canPlaceOrder, setCanPlaceOrder] = useState(false);
  const [stockData, setStockData] = useState({});
  const [sortColumn, setSortColumn] = useState("symbol");
  const [direction, setDirection] = useState("asc");
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [orderType, setOrderType] = useState('Buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3030/ws`);
    ws.onmessage = (event) => {
      const stock = JSON.parse(event.data);
      setStockData(prev => ({
        ...prev,
        [stock.symbol]: stock.price
      }));
    };
    return () => ws.close();
  }, []);

  const handleSort = (newSortColumn) => {
    if (sortColumn === newSortColumn) {
      setDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(newSortColumn);
      setDirection("asc");
    }
  };

  const getSortedSymbols = () => {
    return Object.keys(stockData).sort((a, b) => {
      if (sortColumn === "symbol") {
        return direction === "asc" ? a.localeCompare(b) : b.localeCompare(a);
      }
      return direction === "asc" ? stockData[a] - stockData[b] : stockData[b] - stockData[a];
    });
  };

  useEffect(() => {
    if (!selectedSymbol || !orderType || !quantity || !price) {
      setCanPlaceOrder(false);
      return;
    }
    if (!Number.isInteger(parseFloat(quantity)) || quantity <= 0) {
      setCanPlaceOrder(false);
      return;
    }
    if (parseFloat(price) <= 0) {
      setCanPlaceOrder(false);
      return;
    }

    setCanPlaceOrder(true);
  }, [selectedSymbol, orderType, quantity, price]);

  const handlePlaceOrder = async () => {
    console.log(selectedSymbol, orderType, quantity, price);

    try {
      const response = await fetch('http://localhost:3030/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock_symbol: selectedSymbol,
          order_type: orderType,
          quantity: parseInt(quantity),
          price: parseFloat(price)
        }),
      });
      const data = await response.json();
      console.log('Success:', data);
      alert('Order placed successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to place order');
    }
  };

  const handleSymbolChange = (value) => {
    setSelectedSymbol(value);
  }

  const handleOrderTypeChange = (value) => {
    setOrderType(value);
  }

  const handleDownload = () => {
    const filePath = '/files/RTS Assignment.pdf'
    const fileName = 'RTS Assignment.pdf'
    // Create a temporary anchor element
    const link = document.createElement('a')
    link.href = filePath
    link.download = fileName
    
    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Real-Time Stock Trading Platform
      </h1>
      
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 justify-center items-start">
        {/* Stock Table */}
        <div className="w-full lg:w-2/3">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th 
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("symbol")}
                >
                  Symbol {direction === "asc" ? "↑" : "↓"}
                </th>
                <th 
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Price {direction === "asc" ? "↑" : "↓"}
                </th>
              </tr>
            </thead>
            <tbody>
              {getSortedSymbols().map((symbol) => (
                <tr key={symbol} className="border-b hover:bg-gray-50 text-black">
                  <td className="px-6 py-4 text-center">{symbol}</td>
                  <td className="px-6 py-4 text-center">{stockData[symbol].toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Form */}
        <div className='w-full lg:w-1/3'>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Symbol</label>
                <Select
                  // value={selectedSymbol}
                  onValueChange={handleSymbolChange}
                >
                  <SelectTrigger className="w-full p-2 border rounded">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(stockData).sort().map(symbol => (
                      <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Buy/Sell</label>
                <Select
                  value={orderType}
                  onValueChange={handleOrderTypeChange}
                >
                  <SelectTrigger className="w-full p-2 border rounded">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </div>
              <button
                className={`w-full ${canPlaceOrder ? "bg-indigo-600 hover:bg-violet-700 transition-colors" : "bg-gray-300 cursor-not-allowed"} text-white py-2 px-4 rounded`}
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
          
          <button
            className='bg-indigo-500 p-6 rounded-lg shadow-md mt-20 flex items-center mx-auto'
            onClick={handleDownload}
          >
            <Download size={24} className="mr-2" />
            Download Study Paper Documentation
          </button>
        </div>
      </div>
    </div>
  );
}