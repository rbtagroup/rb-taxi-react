import React, { useState } from 'react';

export default function App() {
  const [zaznamy, setZaznamy] = useState([]);
  const [form, setForm] = useState({ ridic: '', datum: '', trzba: '', km: '', pristavne: '', kartaD: '', kartaV: '', faktura: '', palivo: '', myti: '', odevzdal: '', pocetJizd: '', poznamka: '' });

  const spocitej = () => {
    const n = id => parseFloat(form[id]) || 0;
    const trzba = n('trzba');
    const vyplata = Math.max((trzba - n('pristavne')) * 0.3, 1000);
    const kOdevzdani = trzba - n('kartaD') - n('faktura') - n('palivo') - n('myti');
    const poVyplate = kOdevzdani - vyplata;
    const trzbaNaKm = n('km') ? trzba / n('km') : 0;
    const ziskNaKm = trzbaNaKm - 15;

    return {
      vyplata,
      kOdevzdani,
      poVyplate,
      trzbaNaKm,
      ziskNaKm,
      rozdilOdevzdal: n('odevzdal') - kOdevzdani,
      podilKarta: trzba > 0 ? (n('kartaD') + n('kartaV')) / trzba * 100 : 0,
      podilFaktura: trzba > 0 ? n('faktura') / trzba * 100 : 0,
      podilHotove: trzba > 0 ? 100 - ((n('kartaD') + n('kartaV')) / trzba * 100 + (n('faktura') / trzba * 100)) : 0,
      prumerCekani: n('pocetJizd') > 0 ? 480 / n('pocetJizd') : 0,
      nakladNaKm: n('km') ? n('palivo') / n('km') : 0
    };
  };

  const handleAdd = () => {
    const vypocet = spocitej();
    setZaznamy([...zaznamy, { ...form, ...vypocet }]);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>RB Taxi – Výpočet směn</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 15 }}>
        {['ridic','datum','trzba','km','pristavne','kartaD','kartaV','faktura','palivo','myti','odevzdal','pocetJizd'].map((field) => (
          <div key={field}>
            <label>{field}</label>
            <input id={field} value={form[field]} onChange={handleChange} />
          </div>
        ))}
        <div style={{ gridColumn: 'span 2' }}>
          <label>Poznámka</label>
          <input id="poznamka" value={form.poznamka} onChange={handleChange} />
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <button onClick={handleAdd}>💡 Spočítej & Přidej záznam</button>
      </div>

      <div style={{ marginTop: 30 }}>
        {zaznamy.map((z, idx) => (
          <div key={idx} style={{ background: '#fff', padding: 15, marginBottom: 10, borderRadius: 10, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
            <p><strong>{z.ridic}</strong> – {z.datum}</p>
            <p>Výplata: {z.vyplata} Kč | K odevzdání: {z.kOdevzdani} Kč | Po výplatě: {z.poVyplate} Kč</p>
            <p>Zisk/km: {z.ziskNaKm.toFixed(2)} Kč | Náklad/km: {z.nakladNaKm.toFixed(2)} Kč</p>
            <p>Hotově: {z.podilHotove.toFixed(0)} % | Karta: {z.podilKarta.toFixed(0)} % | Faktura: {z.podilFaktura.toFixed(0)} %</p>
            <p>Poznámka: {z.poznamka}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
