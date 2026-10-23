import {createContext,useContext,useState} from 'react';
// DEMO ONLY: data lives in localStorage. Replace with a real backend before launch.
export const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
export const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const hash=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const TTL=2*60*60*1000; // session lasts 2 hours
const live=()=>{const s=read('cp_session',null);return s&&Date.now()-s.at<TTL?s:null};
const Ctx=createContext();export const useAuth=()=>useContext(Ctx);
export function AuthProvider({children}){
  const [user,setUser]=useState(live);
  const signUp=async({name,email,password})=>{
    const users=read('cp_users',[]);email=email.trim().toLowerCase();
    if(users.some(u=>u.email===email))throw new Error('An account with this email already exists.');
    users.push({name:name.trim(),email,pw:await hash(password),joined:new Date().toISOString()});write('cp_users',users);
    const s={name:name.trim(),email,at:Date.now()};write('cp_session',s);setUser(s);};
  const signIn=async({email,password})=>{
    email=email.trim().toLowerCase();const u=read('cp_users',[]).find(x=>x.email===email);
    if(!u||u.pw!==await hash(password))throw new Error('Incorrect email or password.');
    const s={name:u.name,email,at:Date.now()};write('cp_session',s);setUser(s);};
  const signOut=()=>{localStorage.removeItem('cp_session');setUser(null)};
  return <Ctx.Provider value={{user,signUp,signIn,signOut}}>{children}</Ctx.Provider>;
}
export const list=(key,email)=>read(key,[]).filter(x=>x.email===email);
export const add=(key,item)=>write(key,[{id:Date.now(),at:new Date().toISOString(),...item},...read(key,[])]);
export const remove=(key,id)=>write(key,read(key,[]).filter(x=>x.id!==id));
