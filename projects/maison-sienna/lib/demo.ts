export type Reservation = {
  reference: string; name: string; email: string; date: string; time: string;
  guests: number; occasion: string; note: string; createdAt: string; status: 'preview' | 'cancelled';
};
export type Order = {
  reference: string; items: {id:number;quantity:number}[]; name:string;
  email:string; occasion:string; note:string; amount:number; createdAt:string;
};
export const KEYS = {reservations:'maison_sienna_reservations_v2', orders:'maison_sienna_orders_v2', cart:'maison_sienna_cart_v2', enquiries:'maison_sienna_enquiries_v2'} as const;
export function readLocal<T>(key:string, fallback:T):T {
  if(typeof window === 'undefined')return fallback;
  try { const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
export function writeLocal<T>(key:string,value:T) {
  if(typeof window === 'undefined') return;
  try { localStorage.setItem(key,JSON.stringify(value)); } catch { /* Storage may be blocked; the current session remains usable. */ }
}
export function makeReference(prefix:string) {
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const random=new Uint32Array(7);
  if(typeof window !== 'undefined' && window.crypto?.getRandomValues) window.crypto.getRandomValues(random);
  else for(let i=0;i<random.length;i++)random[i]=Math.floor(Math.random()*1_000_000);
  return prefix+'-'+Array.from(random,x=>chars[x%chars.length]).join('');
}
export function dateTodayLocal() {
  const d=new Date(); const local=new Date(d.getTime()-d.getTimezoneOffset()*60000); return local.toISOString().slice(0,10);
}
export const timeSlots=['17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'];
