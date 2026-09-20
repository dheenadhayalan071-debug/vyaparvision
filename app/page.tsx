"use client";
import { useState } from 'react';
import { Camera, Store, BookOpen, Share2, MessageCircle, ArrowRight, Image as ImageIcon } from 'lucide-react';

interface Item { item: string; localName: string; estimatedPriceINR: number; }
interface Khata { customerName: string; udharAmountINR: number; notes: string; }

export default function VyaparVisionUI() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ inventory: Item[], khata: Khata[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'store' | 'khata'>('store');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: reader.result })
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("AI failed", error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
"use client";
import { useState } from 'react';
import { Camera, Store, BookOpen, Share2, MessageCircle, ArrowRight, Image as ImageIcon, ShoppingCart, Plus, Minus, User, MapPin } from 'lucide-react';

interface Item { item: string; localName: string; estimatedPriceINR: number; }
interface Khata { customerName: string; udharAmountINR: number; notes: string; }

export default function VyaparVisionUI() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ inventory: Item[], khata: Khata[] } | null>(null);
  
  // New States for the E-commerce Flow
  const [activeTab, setActiveTab] = useState<'store' | 'khata'>('store');
  const [viewMode, setViewMode] = useState<'owner' | 'customer'>('owner');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: reader.result })
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("AI failed", error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadDemoData = () => {
    setLoading(true);
    setTimeout(() => {
      setData({
        inventory: [
          { item: "Ponni Boiled Rice (5kg)", localName: "பொன்னி அரிசி 5kg", estimatedPriceINR: 320 },
          { item: "Aachi Chicken Masala", localName: "ஆச்சி சிக்கன் மசாலா", estimatedPriceINR: 45 },
          { item: "Gold Winner Oil (1L)", localName: "கோல்ட் வின்னர்", estimatedPriceINR: 115 },
          { item: "Parle-G Biscuits", localName: "Parle-G", estimatedPriceINR: 10 }
        ],
        khata: [
          { customerName: "Murugan Annan", udharAmountINR: 450, notes: "Taken yesterday evening" },
          { customerName: "Ramesh Auto", udharAmountINR: 120, notes: "Tea & Biscuits account" }
        ]
      });
      setLoading(false);
    }, 1200);
  };

  // Cart Functions
  const updateCart = (itemName: string, delta: number) => {
    setCart(prev => {
      const current = prev[itemName] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemName];
        return copy;
      }
      return { ...prev, [itemName]: next };
    });
  };

  const cartTotal = data?.inventory.reduce((sum, item) => {
    return sum + (item.estimatedPriceINR * (cart[item.item] || 0));
  }, 0) || 0;

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  // WhatsApp Order Generator
  const sendOrderToWhatsApp = (paymentMethod: string) => {
    if (!data) return;
    let orderText = `*New Order from ${customerName || "Customer"}*%0A%0A`;
    
    data.inventory.forEach(item => {
      if (cart[item.item]) {
        orderText += `${cart[item.item]}x ${item.item} - ₹${item.estimatedPriceINR * cart[item.item]}%0A`;
      }
    });
    
    orderText += `%0A*Total: ₹${cartTotal}*%0A*Fulfillment:* In-Store Pickup%0A*Payment:* ${paymentMethod}`;
    
    // In a real app, this would be the owner's phone number. 
    // For demo, we just open the WhatsApp API link.
    window.open(`https://wa.me/?text=${orderText}`, '_blank');
  };

  // --- CUSTOMER VIEW UI ---
  if (viewMode === 'customer' && data) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-32">
        <header className="bg-green-600 text-white p-6 shadow-md rounded-b-3xl relative">
          <button onClick={() => setViewMode('owner')} className="absolute top-4 right-4 text-xs bg-green-700 px-2 py-1 rounded">Exit Preview</button>
          <h1 className="text-2xl font-extrabold flex items-center gap-2 tracking-tight">
            <Store size={28} /> Local Kirana Store
          </h1>
          <p className="text-green-100 text-sm mt-1 font-medium flex items-center gap-1"><MapPin size={14}/> Madurai, Tamil Nadu</p>
        </header>

        <main className="max-w-md mx-auto p-4 mt-2">
          <h2 className="font-bold text-gray-800 mb-4 text-lg">Available Items</h2>
          <div className="space-y-3">
            {data.inventory.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{item.item}</p>
                  <p className="text-xs font-medium text-gray-400">{item.localName}</p>
                  <p className="font-extrabold text-green-700 mt-1">₹{item.estimatedPriceINR}</p>
                </div>
                
                {/* Add to Cart Controls */}
                {cart[item.item] ? (
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => updateCart(item.item, -1)} className="p-1 bg-white rounded shadow-sm text-red-500"><Minus size={16}/></button>
                    <span className="font-bold w-4 text-center">{cart[item.item]}</span>
                    <button onClick={() => updateCart(item.item, 1)} className="p-1 bg-white rounded shadow-sm text-green-500"><Plus size={16}/></button>
                  </div>
                ) : (
                  <button onClick={() => updateCart(item.item, 1)} className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-bold text-sm">
                    Add
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Sticky Checkout Bar */}
        {totalItems > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Your Name (Optional)" 
                className="w-full bg-gray-100 p-3 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => sendOrderToWhatsApp('Pay on Pickup')} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                  <ShoppingCart size={18} /> ₹{cartTotal} • Pay on Pickup
                </button>
                <button onClick={() => sendOrderToWhatsApp('Add to Khata')} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                  <BookOpen size={18} /> Add to Khata
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- OWNER VIEW UI (Original View) ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      <header className="bg-orange-600 text-white p-6 shadow-md rounded-b-3xl">
        <h1 className="text-2xl font-extrabold flex items-center justify-center gap-2 tracking-tight">
          <Store size={28} /> VyaparVision
        </h1>
        <p className="text-center text-orange-100 text-sm mt-1 font-medium">ONDC & Bahi-Khata AI Bridge</p>
      </header>

      <main className="max-w-md mx-auto p-4 mt-4">
        {!data && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-orange-300 rounded-2xl p-8 bg-white shadow-sm relative cursor-pointer hover:bg-orange-50 transition-all text-center">
              <input 
                type="file" accept="image/*" onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {loading ? (
                <div className="flex flex-col items-center py-4">
                  <div className="h-10 w-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4" />
                  <p className="text-orange-700 font-bold">Scanning Ledger...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <Camera size={48} className="text-orange-500 mb-4" />
                  <p className="font-bold text-gray-800 text-lg">Snap Bahi-Khata Page</p>
                  <p className="text-sm text-gray-500 mt-1">Supports Tamil, Hindi & English</p>
                </div>
              )}
            </div>
            <button onClick={loadDemoData} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold hover:bg-gray-300">
              <ImageIcon size={18} /> Load Demo Tamil Ledger
            </button>
          </div>
        )}

        {data && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex bg-white rounded-xl shadow-sm p-1 mb-4 border border-gray-100">
              <button onClick={() => setActiveTab('store')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'store' ? 'bg-orange-100 text-orange-700' : 'text-gray-500'}`}>
                <Store size={16} /> Digital Store
              </button>
              <button onClick={() => setActiveTab('khata')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'khata' ? 'bg-red-100 text-red-700' : 'text-gray-500'}`}>
                <BookOpen size={16} /> Bahi-Khata
              </button>
            </div>

            {activeTab === 'store' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                  <h2 className="font-bold text-gray-800">Your Catalog</h2>
                  <button 
                    onClick={() => {
                      alert("Store link copied! Opening Customer Preview Mode for Demo...");
                      setViewMode('customer');
                    }} 
                    className="bg-green-500 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1 font-bold shadow-sm animate-pulse"
                  >
                    <Share2 size={14} /> Share & Preview
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {data.inventory.map((item, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800">{item.item}</p>
                        <p className="text-xs font-medium text-gray-400">{item.localName}</p>
                      </div>
                      <p className="font-extrabold text-green-700">₹{item.estimatedPriceINR}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'khata' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-red-50 border-b border-red-100">
                  <h2 className="font-bold text-red-800">Pending Udhar Recovery</h2>
                </div>
                <div className="p-2">
                  {data.khata.map((k, idx) => (
                    <div key={idx} className="p-3 bg-white border border-gray-100 rounded-xl mb-2 flex flex-col gap-3 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{k.customerName}</p>
                          <p className="text-xs text-gray-400">{k.notes}</p>
                        </div>
                        <p className="font-extrabold text-red-600">₹{k.udharAmountINR}</p>
                      </div>
                      <button className="w-full bg-[#25D366] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"><MessageCircle size={14} /> Send UPI Link</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setData(null)} className="w-full mt-6 py-3 text-sm font-bold text-gray-400 flex items-center justify-center gap-1"><ArrowRight size={16} /> Scan another page</button>
          </div>
        )}
      </main>
    </div>
  );
    }
           
