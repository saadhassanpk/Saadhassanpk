'use client';
import Link from 'next/link';
import {useState} from 'react';
import {useCart} from './cart-provider';
export function AddButton({id,label='ADD TO BAG',className='button button-dark'}:{id:number;label?:string;className?:string}){
  const {add}=useCart();const [added,setAdded]=useState(false);
  return <button className={className} type="button" onClick={()=>{add(id);setAdded(true)}} aria-label={label}><span>{added?'ADDED TO BAG ✓':label}</span><span aria-hidden="true">↗</span></button>;
}
export function BagLink(){const {count}=useCart();return <Link href="/cart" className="text-link dark-link">VIEW BAG ({count}) ↗</Link>}
