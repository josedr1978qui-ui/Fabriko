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
function K({n,t,i}:{n:number|string;t:string;i:React.ReactNode}){return <div className="tkpi"><div>{i}</div><b>{n}</b><span>{t}</span></div>}.training-module{padding:20px;color:#f4f4f4}.training-nav{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.training-nav button{display:flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid #3b3b3b;border-radius:10px;background:#181818;color:#ddd;cursor:pointer}.training-nav button.active{background:#c51f1f;color:#fff;border-color:#c51f1f}.training-head{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px}.training-head h2{margin:0;font-size:24px}.training-head p{color:#aaa;margin:5px 0}.training-module .primary{display:flex;align-items:center;gap:8px;background:#c51f1f;color:#fff;border:0;border-radius:10px;padding:11px 15px;cursor:pointer}.training-kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:18px}.tkpi{background:#111;border:1px solid #303030;border-top:3px solid #c51f1f;border-radius:14px;padding:16px}.tkpi div{color:#c51f1f}.tkpi b{display:block;font-size:25px;margin-top:8px}.tkpi span{color:#aaa;font-size:13px}.training-grid2{display:grid;grid-template-columns:1.4fr 1fr;gap:15px}.tcard{background:#111;border:1px solid #303030;border-radius:14px;padding:18px;overflow:auto}.tcard h3{margin-top:0}.barrow{display:grid;grid-template-columns:42px 1fr;gap:10px;align-items:center;margin:11px 0}.barrow>div{height:12px;background:#292929;border-radius:8px;position:relative}.barrow i{display:block;height:100%;background:#c51f1f;border-radius:8px}.barrow b{font-size:11px;margin-left:8px;color:#aaa}.alertrow{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid #292929}.alertrow svg{color:#f0a000}.alertrow div{flex:1}.alertrow span{display:block;color:#aaa;font-size:12px}.alertrow em{font-style:normal;color:#ff7777;font-size:12px}.tsearch{display:flex;align-items:center;gap:8px;background:#181818;border:1px solid #3b3b3b;border-radius:10px;padding:8px 11px}.tsearch input{border:0;background:transparent;color:#fff;outline:0}.tcard table{width:100%;border-collapse:collapse;min-width:700px}.tcard th,.tcard td{padding:11px 10px;text-align:left;border-bottom:1px solid #2d2d2d}.tcard th{background:#252525}.tcard td small{display:block;color:#999}.tgood,.twarn,.tbad,.tgray{display:inline-block;padding:4px 8px;border-radius:7px;font-size:12px}.tgood{background:#153c28;color:#70d99a}.twarn{background:#4b3515;color:#ffc36a}.tbad{background:#4b1818;color:#ff7b7b}.tgray{background:#292929;color:#aaa}.matrix-wrap{overflow:auto}.training-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:100}.training-modal{width:min(460px,92vw);background:#111;border:1px solid #444;border-radius:16px;padding:20px;display:grid;gap:12px}.training-modal .panelhead{display:flex;justify-content:space-between;align-items:center}.training-modal .panelhead button{background:transparent;border:0;color:#fff;cursor:pointer}.training-modal label{display:grid;gap:6px;color:#ddd}.training-modal input,.training-modal select{background:#1b1b1b;color:#fff;border:1px solid #444;border-radius:9px;padding:10px}.training-modal .primary{justify-content:center}@media(max-width:900px){.training-kpis{grid-template-columns:repeat(2,1fr)}.training-grid2{grid-template-columns:1fr}.training-head{align-items:flex-start;flex-direction:column}}@media(max-width:600px){.training-module{padding:10px}.training-kpis{grid-template-columns:1fr 1fr}.tkpi b{font-size:21px}}