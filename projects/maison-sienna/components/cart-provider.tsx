'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import type {Dispatch,ReactNode,SetStateAction} from 'react';
import {KEYS,readLocal,writeLocal} from '@/lib/demo';
import {menu} from '@/lib/menu';

type CartContextValue={
  cart:Record<number,number>; setCart:Dispatch<SetStateAction<Record<number,number>>>;
  add:(id:number)=>void; change:(id:number,delta:number)=>void; clear:()=>void;
  count:number; subtotal:number; hydrated:boolean;
};
const CartContext=createContext<CartContextValue|null>(null);
export function CartProvider({children}:{children:ReactNode}){
  const [cart,setCart]=useState<Record<number,number>>({});
  const [hydrated,setHydrated]=useState(false);
  useEffect(()=>{
    const saved=readLocal<Record<number,number>>(KEYS.cart,{});
    if(saved && typeof saved ==='object' && !Array.isArray(saved)){
      const clean:Record<number,number>={};
      for(const [key,value] of Object.entries(saved)){
        const id=Number(key);
        if(menu.some(d=>d.id===id) && Number.isInteger(value) && value>0 && value<=30)clean[id]=value;
      }
      setCart(clean);
    }
    setHydrated(true);
  },[]);
  useEffect(()=>{if(hydrated)writeLocal(KEYS.cart,cart)},[cart,hydrated]);
  const add=(id:number)=>{if(!menu.some(d=>d.id===id))return;setCart(current=>({...current,[id]:Math.min(30,(current[id]||0)+1)}))};
  const change=(id:number,delta:number)=>setCart(current=>{
    const next={...current};const qty=Math.max(0,Math.min(30,(next[id]||0)+delta));
    if(qty===0)delete next[id];else next[id]=qty;
    return next;
  });
  const clear=()=>setCart({});
  const count=useMemo(()=>Object.values(cart).reduce((sum,n)=>sum+n,0),[cart]);
  const subtotal=useMemo(()=>menu.reduce((sum,item)=>sum+item.price*(cart[item.id]||0),0),[cart]);
  return <CartContext.Provider value={{cart,setCart,add,change,clear,count,subtotal,hydrated}}>{children}</CartContext.Provider>;
}
export function useCart(){const value=useContext(CartContext);if(!value)throw Error('CartProvider is missing');return value;}
