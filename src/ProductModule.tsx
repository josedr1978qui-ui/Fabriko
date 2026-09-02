import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, Edit3, PackagePlus, Plus, Search, X } from 'lucide-react';
import { supabase } from './supabase';

type Product = { id:number; code:string; name:string; unit:string; stock:number; min_stock:number; supplier:string|null; pack:string|null; last_entry:string|null };

type Props = { products:Product[]; onReload:()=>Promise<void> };

const empty = { code:'', name:'', unit:'Pieza', stock:'0', min_stock:'0', supplier:'', pack:'' };

export default function ProductModule({ products, onReload }:Props){
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState<Product|null>(null);
  const [form,setForm]=useState(empty);
  const [q,setQ]=useState('');
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');

  const filtered=useMemo(()=>products.filter(p=>`${p.code} ${p.name} ${p.unit} ${p.supplier||''} ${p.pack||''}`.toLowerCase().includes(q.toLowerCase())),[products,q]);
  const startNew=()=>{setEditing(null);setForm(empty);setMessage('');setOpen(true)};
  const startEdit=(p:Product)=>{setEditing(p);setForm({code:p.code,name:p.name,unit:p.unit,stock:String(p.stock),min_stock:String(p.min_stock),supplier:p.supplier||'',pack:p.pack||''});setMessage('');setOpen(true)};
  const close=()=>{if(!busy){setOpen(false);setEditing(null)}};
  const save=async(e:FormEvent)=>{
    e.preventDefault(); setBusy(true); setMessage('');
    const payload={code:form.code.trim(),name:form.name.trim(),unit:form.unit.trim()||'Pieza',stock:Number(form.stock)||0,min_stock:Number(form.min_stock)||0,supplier:form.supplier.trim()||null,pack:form.pack.trim()||null,last_entry:Number(form.stock)>0?new Date().toISOString().slice(0,10):editing?.last_entry||null};
    if(!payload.code||!payload.name){setMessage('Código y nombre del producto son obligatorios.');setBusy(false);return}
    const result=editing?await supabase.from('products').update(payload).eq('id',editing.id):await supabase.from('products').insert(payload);
    if(result.error){setMessage(result.error.message)}else{await onReload();setOpen(false);setEditing(null)}
    setBusy(false);
  };
  const deactivate=async(p:Product)=>{if(!window.confirm(`¿Desactivar ${p.code} · ${p.name}?`))return;const{error}=await supabase.from('products').delete().eq('id',p.id);if(error)setMessage(error.message);else await onReload()};

  return <section className="panel products-module">
    <div className="panelhead products-head"><div><h2>Productos</h2><small>Catálogo maestro de productos e inventario inicial</small></div><button className="primary" onClick={startNew}><Plus size={18}/> Nuevo producto</button></div>
    {message&&<div className="product-message">{message}</div>}
    <div className="filters"><div className="search"><Search size={17}/><input placeholder="Buscar código, producto, proveedor..." value={q} onChange={e=>setQ(e.target.value)}/></div><span className="product-count">{filtered.length} productos</span></div>
    <div className="tablewrap"><table><thead><tr><th>Código</th><th>Producto</th><th>Categoría / Presentación</th><th>Unidad</th><th>Stock</th><th>Mínimo</th><th>Proveedor</th><th>Estado</th><th></th></tr></thead><tbody>
      {filtered.map(p=><tr key={p.id}><td><b>{p.code}</b></td><td>{p.name}</td><td>{p.pack||'—'}</td><td>{p.unit}</td><td>{p.stock}</td><td>{p.min_stock}</td><td>{p.supplier||'—'}</td><td><span className={p.min_stock>0&&p.stock<=p.min_stock?'tag out':'tag in'}>{p.min_stock>0&&p.stock<=p.min_stock?'Reponer':'Activo'}</span></td><td><button className="icon-button" title="Editar" onClick={()=>startEdit(p)}><Edit3 size={16}/></button></td></tr>)}
      {filtered.length===0&&<tr><td colSpan={9} className="empty-row"><PackagePlus size={24}/><span>No hay productos que coincidan.</span><button onClick={startNew}>Agregar producto</button></td></tr>}
    </tbody></table></div>
    {open&&<div className="overlay"><div className="modal product-modal"><div className="panelhead"><div><h2>{editing?'Editar producto':'Nuevo producto'}</h2><small>{editing?'Actualiza los datos del catálogo':'Registra un producto para que esté disponible en inventario y movimientos'}</small></div><button onClick={close}><X/></button></div>
      <form onSubmit={save} className="product-form"><div className="product-grid">
        <label>Código *<input value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} placeholder="Ej. P006" required/></label>
        <label>Producto *<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nombre o descripción" required/></label>
        <label>Unidad<select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}><option>Pieza</option><option>Kg</option><option>Metro</option><option>Litro</option><option>Caja</option><option>Paquete</option></select></label>
        <label>Stock inicial<input type="number" min="0" step="0.01" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></label>
        <label>Stock mínimo<input type="number" min="0" step="0.01" value={form.min_stock} onChange={e=>setForm({...form,min_stock:e.target.value})}/></label>
        <label>Proveedor<input value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} placeholder="Opcional"/></label>
        <label className="wide">Presentación / empaque<input value={form.pack} onChange={e=>setForm({...form,pack:e.target.value})} placeholder="Ej. Caja 20 piezas"/></label>
      </div><div className="form-actions"><button type="button" className="secondary" onClick={close}><X/> Cancelar</button><button className="primary" disabled={busy}><CheckCircle2/>{busy?'Guardando...':editing?'Guardar cambios':'Crear producto'}</button></div></form>
    </div></div>}
  </section>
}
