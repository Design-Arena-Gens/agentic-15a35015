export const metadata = {
  title: 'Modern Residential Fa?ade Render',
  description: 'Photorealistic 3D fa?ade with concrete, glass, metal, wood, fins and LED lines.',
  metadataBase: new URL('https://agentic-15a35015.vercel.app')
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0, background:'#0b0d10', color:'#e6e9ef', fontFamily:'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji'}}> 
        {children}
      </body>
    </html>
  );
}
