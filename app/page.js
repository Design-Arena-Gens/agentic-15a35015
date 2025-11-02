import FacadeCanvas from '../components/FacadeScene';

export default function Page() {
  return (
    <main style={{height:'100vh', width:'100vw', position:'relative'}}>
      <div style={{position:'absolute', top:16, left:16, zIndex:10, background:'rgba(0,0,0,0.35)', padding:'10px 12px', borderRadius:8, backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.08)'}}>
        <h1 style={{margin:0, fontSize:16, letterSpacing:0.3}}>Modern Residential Fa?ade</h1>
        <p style={{margin:'6px 0 0 0', fontSize:12, opacity:0.8}}>Concrete ? Glass ? Metal ? Wood ? Fins ? LEDs</p>
      </div>
      <FacadeCanvas />
    </main>
  );
}
