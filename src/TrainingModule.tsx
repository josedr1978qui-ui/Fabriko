import React,{useMemo,useState}from'react';
import{BookOpen,Users,CalendarDays,CheckCircle2,AlertTriangle,Clock,Search,Plus,ClipboardCheck,BarChart3,X}from'lucide-react';

type Employee={id:number;name:string;dept:string;position:string;status:string};
type Course={id:number;name:string;type:string;dept:string;hours:number;required:boolean};
type RecordT={id:number;employee:number;course:number;date:string;score:number;status:'Completado'|'Pendiente'|'Vencido'};

const employees:Employee[]=[
{id:1,name:'Empleado 001',dept:'Ensamble',position:'Operador',status:'Activo'},
{id:2,name:'Empleado 002',dept:'Calidad',position:'Inspector',status:'Activo'},
{id:3,name:'Empleado 003',dept:'Almacén',position:'Auxiliar',status:'Activo'},
{id:4,name:'Empleado 004',dept:'Mantenimiento',position:'Técnico',status:'Activo'},
{id:5,name:'Empleado 005',dept:'Máquinas',position:'Operador',status:'Activo'},
];
const courses:Course[]=[
{id:1,name:'Inducción FABRIKO',type:'Inducción',dept:'Todos',hours:4,required:true},
{id:2,name:'Seguridad e Higiene',type:'Obligatorio',dept:'Todos',hours:3,required:true},
{id:3,name:'5S',type:'Calidad',dept:'Todos',hours:2,required:true},
{id:4,name:'Competencias del puesto',type:'Puesto',dept:'Ensamble',hours:4,required:true},
{id:5,name:'Manejo seguro de maquinaria',type:'Seguridad',dept:'Máquinas',hours:4,required:true},
{id:6,name:'Control de calidad',type:'Calidad',dept:'Calidad',hours:3,required:true},
];
const initial:RecordT[]=[
{id:1,employee:1,course:1,date:'2026-09-01',score:95,status:'Completado'},
{id:2,employee:1,course:2,date:'2026-09-03',score:90,status:'Completado'},
{id:3,employee:2,course:1,date:'2026-09-02',score:98,status:'Completado'},
{id:4,employee:2,course:6,date:'2026-09-10',score:92,status:'Completado'},
{id:5,employee:3,course:1,date:'2026-09-04',score:88,status:'Completado'},
{id:6,employee:4,course:2,date:'2026-09-05',score:0,status:'Pendiente'},
{id:7,employee:5,course:5,date:'2026-09-08',score:0,status:'Vencido'},
];

export default function TrainingModule(){
const[view,setView]=useState<'dashboard'|'employees'|'matrix'|'courses'>('dashboard');
const[records,setRecords]=useState(initial);
const[q,setQ]=useState('');
const[show,setShow]=useState(false);
const[form,setForm]=useState({employee:'1',course:'1',date:'2026-09-18',score:'90'});
const total=employees.length;
const completed=records.filter(r=>r.status==='Completado').length;
const pending=records.filter(r=>r.status==='Pendiente').length;
const expired=records.filter(r=>r.status==='Vencido').length;
const compliance=Math.round(completed/(completed+pending+expired)*100);
const filtered=employees.filter(e=>(e.name+' '+e.dept+' '+e.position).toLowerCase().includes(q.toLowerCase()));
const add=()=>{setRecords(x=>[...x,{id:Date.now(),employee:+form.employee,course:+form.course,date:form.date,score:+form.score,status:'Completado'}]);setShow(false)};
const emp=(id:number)=>employees.find(e=>e.id===id);
const course=(id:number)=>courses.find(c=>c.id===id);
return <div className="training-module">
<div className="training-nav">{[['dashboard','Dashboard',BarChart3],['employees','Empleados',Users],['matrix','Matriz de competencias',ClipboardCheck],['courses','Cursos y calendario',CalendarDays]].map(([id,label,I]:any)=><button className={view===id?'active':''} onClick={()=>setView(id)} key={id}><I size={17}/>{label}</button>)}</div>
{view==='dashboard'&&<><div className="training-head"><div><h2>Capacitación y Entrenamiento</h2><p>Gestión centralizada del programa anual y competencias.</p></div><button className="primary" onClick={()=>setShow(true)}><Plus/>Registrar capacitación</button></div>
<div className="training-kpis"><K n={total} t="Personal activo" i={<Users/>}/><K n={completed} t="Capacitaciones completadas" i={<CheckCircle2/>}/><K n={pending} t="Pendientes" i={<Clock/>}/><K n={expired} t="Vencidas" i={<AlertTriangle/>}/><K n={compliance+'%'} t="Cumplimiento" i={<BarChart3/>}/></div>
<div className="training-grid2"><section className="tcard"><h3>Programa anual · 2026</h3><div className="bars">{['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep'].map((m,i)=><div className="barrow" key={m}><span>{m}</span><div><i style={{width:(45+(i%5)*10)+'%'}}/><b>{45+(i%5)*10}%</b></div></div>)}</div></section>
<section className="tcard"><h3>Atención requerida</h3>{records.filter(r=>r.status!=='Completado').map(r=><div className="alertrow" key={r.id}><AlertTriangle size={17}/><div><b>{emp(r.employee)?.name}</b><span>{course(r.course)?.name}</span></div><em>{r.status}</em></div>)}</section></div></>}
{view==='employees'&&<><div className="training-head"><div><h2>Personal</h2><p>Expediente y estado de capacitación.</p></div><div className="tsearch"><Search size={17}/><input placeholder="Buscar empleado..." value={q} onChange={e=>setQ(e.target.value)}/></div></div><div className="tcard"><table><thead><tr><th>Empleado</th><th>Departamento</th><th>Puesto</th><th>Cursos completados</th><th>Estado</th></tr></thead><tbody>{filtered.map(e=>{const rs=records.filter(r=>r.employee===e.id);const ok=rs.filter(r=>r.status==='Completado').length;return <tr key={e.id}><td><b>{e.name}</b></td><td>{e.dept}</td><td>{e.position}</td><td>{ok}/{courses.filter(c=>c.dept==='Todos'||c.dept===e.dept).length}</td><td><span className={ok>=2?'tgood':'twarn'}>{ok>=2?'En control':'Revisar'}</span></td></tr>})}</tbody></table></div></>}
{view==='matrix'&&<><div className="training-head"><div><h2>Matriz de competencias</h2><p>Nivel de avance por empleado y curso.</p></div></div><div className="tcard"><div className="matrix-wrap"><table><thead><tr><th>Empleado</th>{courses.map(c=><th key={c.id}>{c.name}</th>)}</tr></thead><tbody>{employees.map(e=><tr key={e.id}><td><b>{e.name}</b><small>{e.dept}</small></td>{courses.map(c=>{const r=records.find(x=>x.employee===e.id&&x.course===c.id);return <td key={c.id}><span className={!r?'tgray':r.status==='Completado'?'tgood':r.status==='Vencido'?'tbad':'twarn'}>{!r?'—':r.status==='Completado'?'C-1':r.status==='Vencido'?'C-3':'C-2'}</span></td>})}</tr>)}</tbody></table></div></div></>}
{view==='courses'&&<><div className="training-head"><div><h2>Cursos y calendario</h2><p>Programa anual, responsables y seguimiento.</p></div><button className="primary" onClick={()=>setShow(true)}><Plus/>Nueva capacitación</button></div><div className="tcard"><table><thead><tr><th>Curso</th><th>Tipo</th><th>Departamento</th><th>Horas</th><th>Obligatorio</th></tr></thead><tbody>{courses.map(c=><tr key={c.id}><td><b>{c.name}</b></td><td>{c.type}</td><td>{c.dept}</td><td>{c.hours}</td><td>{c.required?'Sí':'No'}</td></tr>)}</tbody></table></div></>}
{show&&<div className="training-overlay"><div className="training-modal"><div className="panelhead"><h2>Registrar capacitación</h2><button onClick={()=>setShow(false)}><X/></button></div><label>Empleado<select value={form.employee} onChange={e=>setForm({...form,employee:e.target.value})}>{employees.map(e=><option value={e.id} key={e.id}>{e.name} · {e.dept}</option>)}</select></label><label>Curso<select value={form.course} onChange={e=>setForm({...form,course:e.target.value})}>{courses.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label><label>Fecha<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>Calificación<input type="number" min="0" max="100" value={form.score} onChange={e=>setForm({...form,score:e.target.value})}/></label><button className="primary" onClick={add}><CheckCircle2/>Guardar capacitación</button></div></div>}
</div>}
function K({n,t,i}:{n:number|string;t:string;i:React.ReactNode}){return <div className="tkpi"><div>{i}</div><b>{n}</b><span>{t}</span></div>}
import './training.css';
