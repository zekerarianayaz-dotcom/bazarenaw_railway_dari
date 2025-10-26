import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function App(){
  const [listings, setListings] = useState([])
  useEffect(()=>{ axios.get('/api/listings').then(r=>setListings(r.data)).catch(()=>setListings([])) },[])
  return (
    <div className="container">
      <header className="header">
        <h1>بازارنو</h1>
        <div>ثبت آگهی رایگان</div>
      </header>

      <main>
        <div className="card">
          <h2>آگهی‌ها</h2>
          <div className="list-grid">
            {listings.map(l=>(
              <div key={l._id} className="card">
                <div style={{fontWeight:700}}>{l.title}</div>
                <div style={{fontSize:12,color:'#6b7280'}}>{l.location} • {l.price}</div>
                <p style={{marginTop:8}}>{l.description}</p>
                <div style={{marginTop:8,fontSize:12,color:'#374151'}}>سازنده: {l.owner?.username || 'کاربر'}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
