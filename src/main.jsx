import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";

const defaultMenu = [];

export default function OrderingApp() {
  const [menu, setMenu] = useState(defaultMenu);
  const [cart, setCart] = useState([]);
  const [restaurantName, setRestaurantName] = useState("我的餐廳");
  const [background, setBackground] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [orders, setOrders] = useState([]);

  const handleAddToCart = (item) => {
    const exists = cart.find(c => c.name === item.name);
    if (exists) {
      setCart(cart.map(c => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (name) => {
    setCart(cart.filter(c => c.name !== name));
  };

  const handleOrderSubmit = () => {
    setOrders([...orders, cart]);
    setCart([]);
  };

  const handleAddMenuItem = (item) => {
    if (menu.length >= 50) return;
    setMenu([...menu, item]);
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundImage: background ? `url(${background})` : 'none', backgroundSize: 'cover' }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white bg-black bg-opacity-50 p-2 rounded-xl">{restaurantName}</h1>
        <Dialog>
          <DialogTrigger><Button>購物車 ({cart.length})</Button></DialogTrigger>
          <DialogContent>
            <ScrollArea className="h-64">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <div>{item.name} x {item.quantity}</div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveFromCart(item.name)}><Trash2 size={16} /></Button>
                </div>
              ))}
            </ScrollArea>
            <Button onClick={handleOrderSubmit} className="mt-4 w-full">送出點餐</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <select onChange={(e) => handleAddToCart(menu[e.target.value])} className="w-full p-2 rounded-lg">
          <option value="">選擇菜色</option>
          {menu.map((item, index) => (
            <option value={index} key={index}>{item.name} - ${item.price}</option>
          ))}
        </select>
      </div>

      <div className="absolute top-4 left-4">
        <Dialog>
          <DialogTrigger><Button variant="secondary">菜單設定</Button></DialogTrigger>
          <DialogContent>
            {!showAdmin ? (
              <div>
                <Input type="password" placeholder="輸入密碼" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
                <Button onClick={() => setShowAdmin(adminPassword === "54877")}>確認</Button>
              </div>
            ) : (
              <div>
                <Input placeholder="餐廳名稱" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} className="mb-2" />
                <Input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => setBackground(reader.result);
                  reader.readAsDataURL(file);
                }} className="mb-4" />

                <h2 className="text-xl font-semibold mb-2">新增菜單</h2>
                <MenuEditor onAdd={handleAddMenuItem} />

                <h3 className="text-lg font-semibold mt-4">收到的訂單</h3>
                <ScrollArea className="h-32 border rounded p-2">
                  {orders.map((order, idx) => (
                    <div key={idx} className="mb-2 border-b pb-2">
                      <div>第 {idx + 1} 組客人：</div>
                      {order.map((item, i) => (
                        <div key={i}>{item.name} x {item.quantity}</div>
                      ))}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function MenuEditor({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);

  return (
    <div className="mb-4">
      <Input placeholder="菜名" value={name} onChange={e => setName(e.target.value)} className="mb-2" />
      <Input type="number" placeholder="價格" value={price} onChange={e => setPrice(e.target.value)} className="mb-2" />
      <Input type="file" accept="image/*" onChange={e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => setPhoto(reader.result);
        reader.readAsDataURL(file);
      }} className="mb-2" />
      {photo && <img src={photo} alt="預覽" className="w-[100px] h-[100px] object-cover rounded" />}
      <Button onClick={() => {
        if (name && price && photo) {
          onAdd({ name, price, photo });
          setName("");
          setPrice("");
          setPhoto(null);
        }
      }}><Plus className="mr-1" />新增菜色</Button>
    </div>
  );
}
