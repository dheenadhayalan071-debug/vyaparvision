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
                  <button className="bg-green-500 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1 font-bold shadow-sm"><Share2 size={14} /> Share</button>
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
