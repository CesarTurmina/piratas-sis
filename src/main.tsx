import React, { useEffect, useMemo, useState } from "react";

declare global { interface Window { api: any } }
const BRL = (cents:number)=> (cents/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const ISO = ()=> new Date().toISOString();

type Employee = { id:number; name:string; active:1|0 };
type Charge = { id:number; employeeId:number; item:string; amountCents:number; createdAt:string };

const Tab = ({active, onClick, children}:{active:boolean; onClick:()=>void; children:React.ReactNode}) => (
  <button onClick={onClick} style={{padding:8,border:"1px solid #ddd",background:active?"#fff":"#f7f7f7",fontWeight:active?600:400}}>{children}</button>
);

export default function App(){
  const [tab,setTab]=useState<"cadastro"|"contas">("cadastro");
  return (
    <div style={{padding:16,fontFamily:"Inter,system-ui,Arial"}}>
      <h1>Pirata SIS</h1>
      <div style={{display:"flex",gap:8,borderBottom:"1px solid #ddd",paddingBottom:8}}>
        <Tab active={tab==="cadastro"} onClick={()=>setTab("cadastro")}>Cadastro</Tab>
        <Tab active={tab==="contas"} onClick={()=>setTab("contas")}>Contas Funcionários</Tab>
      </div>
      {tab==="cadastro" && <Cadastro/>}
      {tab==="contas" && <Contas/>}
    </div>
  );
}

function Cadastro(){
  const [name,setName]=useState("");
  const [list,setList]=useState<Employee[]>([]);
  const refresh=async()=> setList(await window.api.listEmployees(false));
  useEffect(()=>{refresh()},[]);
  const add=async()=>{ if(!name.trim())return; await window.api.addEmployee(name.trim()); setName(""); refresh(); };

  return (
    <div style={{marginTop:16}}>
      <h2>Cadastrar funcionário</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome"/>
        <button onClick={add}>Cadastrar</button>
      </div>
      <ul style={{marginTop:12}}>
        {list.map(e=> <li key={e.id}>{e.name}</li>)}
      </ul>
    </div>
  );
}

function Contas(){
  const [employees,setEmployees]=useState<Employee[]>([]);
  const [empId,setEmpId]=useState<number|undefined>();
  const [item,setItem]=useState("");
  const [valor,setValor]=useState("");
  const [month,setMonth]=useState(new Date().toISOString().slice(0,7));
  const [charges,setCharges]=useState<Charge[]>([]);
  const [sum,setSum]=useState(0);

  useEffect(()=>{ (async()=>{
    const emps = await window.api.listEmployees(true);
    setEmployees(emps);
    if(!empId && emps.length) setEmpId(emps[0].id);
  })() },[]);

  const refresh = async()=>{
    if(!empId) return;
    setCharges(await window.api.listCharges({employeeId:empId, monthISO:month}));
    setSum(await window.api.sumCharges({employeeId:empId, monthISO:month}));
  };
  useEffect(()=>{refresh()},[empId,month]);

  const add = async()=>{
    if(!empId || !item.trim() || !valor) return;
    const cents = Math.round(parseFloat(valor.replace(",", "."))*100);
    await window.api.addCharge({employeeId:empId, item:item.trim(), amountCents:cents, whenISO:ISO()});
    setItem(""); setValor(""); refresh();
  };

  return (
    <div style={{marginTop:16}}>
      <h2>Lançar consumo</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:8}}>
        <select value={empId} onChange={e=>setEmpId(Number(e.target.value))}>
          {employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <input value={item} onChange={e=>setItem(e.target.value)} placeholder="Item"/>
        <input value={valor} onChange={e=>setValor(e.target.value)} placeholder="Valor (ex.: 7,50)"/>
        <button onClick={add}>Adicionar</button>
      </div>

      <div style={{display:"flex",gap:8,alignItems:"center",marginTop:12}}>
        <label>Mês:&nbsp;</label>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)}/>
        <div style={{marginLeft:"auto",fontWeight:600}}>Total: {BRL(sum)}</div>
      </div>

      <table width="100%" style={{marginTop:8,borderCollapse:"collapse"}}>
        <thead><tr>
          <th style={{textAlign:"left",borderBottom:"1px solid #ddd"}}>Data</th>
          <th style={{textAlign:"left",borderBottom:"1px solid #ddd"}}>Item</th>
          <th style={{textAlign:"right",borderBottom:"1px solid #ddd"}}>Valor</th>
        </tr></thead>
        <tbody>
          {charges.map(c=>(
            <tr key={c.id}>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
              <td>{c.item}</td>
              <td style={{textAlign:"right"}}>{BRL(c.amountCents)}</td>
            </tr>
          ))}
          {!charges.length && <tr><td colSpan={3} style={{padding:8,opacity:.7}}>Sem lançamentos neste mês.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}