import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calculator, CalendarDays, FlaskConical, Library, ShoppingCart, Syringe, Bell, Lock, Search } from 'lucide-react';
import './styles.css';

const peptides = [
  { name: 'BPC-157', category: 'Recovery', pathway: 'VEGF / FGF / NO', halfLife: 'Research-dependent', overview: 'Synthetic pentadecapeptide studied in tissue repair, tendon, ligament, gut, and angiogenic signaling models.' },
  { name: 'TB-500', category: 'Recovery', pathway: 'Actin / cell migration', halfLife: 'Research-dependent', overview: 'Thymosin beta-4 fragment commonly referenced in connective tissue and cellular migration research.' },
  { name: 'GHK-Cu', category: 'Recovery / Skin', pathway: 'Copper peptide / ECM', halfLife: 'Research-dependent', overview: 'Copper-binding tripeptide studied for extracellular matrix remodeling, skin, hair, and wound models.' },
  { name: 'Retatrutide', category: 'Metabolic', pathway: 'GLP-1 / GIP / Glucagon', halfLife: 'Long acting', overview: 'Triple receptor agonist investigated in metabolic and body-composition research.' },
  { name: 'Tirzepatide', category: 'Metabolic', pathway: 'GLP-1 / GIP', halfLife: 'Long acting', overview: 'Dual incretin receptor agonist used in metabolic research contexts.' },
  { name: 'MOTS-C', category: 'Mitochondrial', pathway: 'AMPK', halfLife: 'Short', overview: 'Mitochondrial-derived peptide studied in AMPK, metabolism, exercise, and stress-response models.' },
  { name: 'AICAR', category: 'Performance', pathway: 'AMPK', halfLife: 'Research-dependent', overview: 'AMPK activator studied in endurance, glucose metabolism, and mitochondrial biogenesis models.' },
  { name: 'Thymosin Alpha-1', category: 'Immune', pathway: 'T-cell / immune modulation', halfLife: 'Research-dependent', overview: 'Immune-modulating peptide studied in T-cell signaling and antiviral immune-response research.' }
];

const nwpProducts = [
  { peptide: 'BPC-157', strengthMg: 10, price: 55, url: '#' },
  { peptide: 'TB-500', strengthMg: 10, price: 75, url: '#' },
  { peptide: 'GHK-Cu', strengthMg: 50, price: 85, url: '#' },
  { peptide: 'Retatrutide', strengthMg: 30, price: 220, url: '#' },
  { peptide: 'Tirzepatide', strengthMg: 30, price: 190, url: '#' },
  { peptide: 'MOTS-C', strengthMg: 20, price: 85, url: '#' },
  { peptide: 'AICAR', strengthMg: 50, price: 95, url: '#' },
  { peptide: 'Thymosin Alpha-1', strengthMg: 10, price: 65, url: '#' },
  { peptide: 'Bacteriostatic Water 10mL', strengthMg: 0, price: 15, url: '#' },
  { peptide: 'Insulin Syringes 100ct', strengthMg: 0, price: 25, url: '#' }
];

function App() {
  const [tab, setTab] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [calc, setCalc] = useState({ mg: 10, ml: 2, doseMcg: 500 });
  const [rows, setRows] = useState([
    { peptide: 'BPC-157', dose: 500, unit: 'mcg', perWeek: 7, weeks: 8 },
    { peptide: 'TB-500', dose: 2, unit: 'mg', perWeek: 2, weeks: 8 }
  ]);

  const calcOut = useMemo(() => {
    const concentrationMcgPerMl = (Number(calc.mg) * 1000) / Number(calc.ml || 1);
    const mlPerDose = Number(calc.doseMcg) / concentrationMcgPerMl;
    return { concentrationMcgPerMl, mlPerDose, insulinUnits: mlPerDose * 100, dosesPerVial: (Number(calc.mg) * 1000) / Number(calc.doseMcg || 1) };
  }, [calc]);

  const planner = useMemo(() => {
    const items = rows.map(r => {
      const doseMg = r.unit === 'mcg' ? Number(r.dose) / 1000 : Number(r.dose);
      const totalMg = doseMg * Number(r.perWeek) * Number(r.weeks);
      const product = nwpProducts.find(p => p.peptide === r.peptide);
      const vials = product ? Math.ceil(totalMg / product.strengthMg) : 0;
      const cost = product ? vials * product.price : 0;
      return { ...r, totalMg, product, vials, cost };
    });
    const totalInjections = rows.reduce((sum, r) => sum + Number(r.perWeek) * Number(r.weeks), 0);
    const syringeBoxes = Math.ceil(totalInjections / 100);
    const waterVials = Math.max(1, Math.ceil(items.reduce((sum, i) => sum + i.vials, 0) / 4));
    const supplies = syringeBoxes * 25 + waterVials * 15;
    const products = items.reduce((sum, i) => sum + i.cost, 0);
    return { items, totalInjections, syringeBoxes, waterVials, supplies, products, grand: supplies + products };
  }, [rows]);

  const filtered = peptides.filter(p => `${p.name} ${p.category} ${p.pathway}`.toLowerCase().includes(query.toLowerCase()));

  return <div className="app">
    <aside className="sidebar">
      <img src="/peptide-informer-logo.jpg" className="logo" />
      <h1>Peptide Informer</h1>
      <p className="sub">Research planning, tracking, and reference.</p>
      {[['dashboard','Dashboard',FlaskConical],['calculator','Calculator',Calculator],['planner','Protocol Planner',CalendarDays],['library','Library',Library],['cart','NWP Cart',ShoppingCart]].map(([id,label,Icon]) =>
        <button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon size={18}/>{label}</button>
      )}
      <div className="powered">Powered by Northwest Peps</div>
    </aside>

    <main>
      {tab === 'dashboard' && <section>
        <div className="hero"><div><h2>Peptide Informer MVP</h2><p>A branded cloud-ready web app starter for reconstitution, titration planning, dose logging, peptide reference, and NWP cost planning.</p></div><span className="pill">V1 Prototype</span></div>
        <div className="grid cards">
          <Card icon={<Calculator/>} title="Reconstitution Suite" text="Calculate concentration, syringe units, injection volume, and doses per vial." />
          <Card icon={<CalendarDays/>} title="Protocol Planner" text="Build cycles and estimate total peptide, vials, supplies, and costs." />
          <Card icon={<Library/>} title="Cloud Library Ready" text="Search by compound, category, pathway, goal, and quick facts." />
          <Card icon={<Bell/>} title="Pro Features" text="Reminders, inventory, protocol sharing, exports, and saved templates." />
        </div>
        <div className="disclaimer">Research-use-only educational planning tool. Not medical advice. Not for diagnosing, treating, curing, or preventing disease.</div>
      </section>}

      {tab === 'calculator' && <section><h2>Reconstitution Calculator</h2><div className="panel formgrid">
        <label>Peptide amount (mg)<input value={calc.mg} onChange={e=>setCalc({...calc,mg:e.target.value})}/></label>
        <label>Diluent volume (mL)<input value={calc.ml} onChange={e=>setCalc({...calc,ml:e.target.value})}/></label>
        <label>Desired dose (mcg)<input value={calc.doseMcg} onChange={e=>setCalc({...calc,doseMcg:e.target.value})}/></label>
      </div><div className="grid cards">
        <Metric label="Concentration" value={`${calcOut.concentrationMcgPerMl.toFixed(0)} mcg/mL`} />
        <Metric label="Injection Volume" value={`${calcOut.mlPerDose.toFixed(3)} mL`} />
        <Metric label="Insulin Syringe" value={`${calcOut.insulinUnits.toFixed(1)} units`} />
        <Metric label="Doses Per Vial" value={`${calcOut.dosesPerVial.toFixed(1)}`} />
      </div></section>}

      {tab === 'planner' && <section><h2>Protocol Planner</h2><p className="muted">Estimate total peptide needed, NWP vials, syringes, bac water, and cycle cost.</p>
        <div className="panel">
          {rows.map((r, idx) => <div className="row" key={idx}>
            <select value={r.peptide} onChange={e=>updateRow(idx,{peptide:e.target.value})}>{nwpProducts.filter(p=>p.strengthMg>0).map(p=><option key={p.peptide}>{p.peptide}</option>)}</select>
            <input value={r.dose} onChange={e=>updateRow(idx,{dose:e.target.value})}/>
            <select value={r.unit} onChange={e=>updateRow(idx,{unit:e.target.value})}><option>mcg</option><option>mg</option></select>
            <input value={r.perWeek} onChange={e=>updateRow(idx,{perWeek:e.target.value})}/><span>/ week</span>
            <input value={r.weeks} onChange={e=>updateRow(idx,{weeks:e.target.value})}/><span>weeks</span>
            <button className="ghost" onClick={()=>setRows(rows.filter((_,i)=>i!==idx))}>Remove</button>
          </div>)}
          <button onClick={()=>setRows([...rows,{peptide:'BPC-157',dose:500,unit:'mcg',perWeek:7,weeks:8}])}>+ Add Peptide</button>
        </div>
        <table><thead><tr><th>Peptide</th><th>Total Needed</th><th>NWP Product</th><th>Vials</th><th>Cost</th></tr></thead><tbody>{planner.items.map(i=><tr key={i.peptide}><td>{i.peptide}</td><td>{i.totalMg.toFixed(2)} mg</td><td>{i.product?.strengthMg}mg vial</td><td>{i.vials}</td><td>${i.cost}</td></tr>)}</tbody></table>
        <div className="grid cards"><Metric label="Syringes Needed" value={`${planner.totalInjections}`} /><Metric label="Syringe Boxes" value={`${planner.syringeBoxes}`} /><Metric label="Bac Water 10mL" value={`${planner.waterVials}`} /><Metric label="Estimated Total" value={`$${planner.grand}`} /></div>
      </section>}

      {tab === 'library' && <section><h2>Peptide Library</h2><div className="search"><Search size={18}/><input placeholder="Search peptide, pathway, category..." value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="library">{filtered.map(p=><article key={p.name}><span>{p.category}</span><h3>{p.name}</h3><p>{p.overview}</p><b>Pathway:</b> {p.pathway}<br/><b>Half-life:</b> {p.halfLife}</article>)}</div></section>}

      {tab === 'cart' && <section><h2>Northwest Peps Cart Builder</h2><p className="muted">Prototype output from the active protocol planner.</p><div className="panel">{planner.items.map(i=><div className="cartline" key={i.peptide}><div><b>{i.peptide}</b><br/><span>{i.product?.strengthMg}mg vial × {i.vials}</span></div><b>${i.cost}</b></div>)}<div className="cartline"><div><b>Bacteriostatic Water 10mL</b><br/><span>× {planner.waterVials}</span></div><b>${planner.waterVials*15}</b></div><div className="cartline"><div><b>Insulin Syringes 100ct</b><br/><span>× {planner.syringeBoxes}</span></div><b>${planner.syringeBoxes*25}</b></div><hr/><div className="cartline total"><b>Total</b><b>${planner.grand}</b></div><button className="wide"><ShoppingCart size={18}/> Generate NWP Cart Link</button></div></section>}
    </main>
  </div>;

  function updateRow(idx, patch) { setRows(rows.map((r,i)=>i===idx?{...r,...patch}:r)); }
}
function Card({icon,title,text}) { return <div className="card">{icon}<h3>{title}</h3><p>{text}</p></div> }
function Metric({label,value}) { return <div className="metric"><span>{label}</span><b>{value}</b></div> }

createRoot(document.getElementById('root')).render(<App />);
