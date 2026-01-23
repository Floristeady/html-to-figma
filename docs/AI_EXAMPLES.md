# AI Examples & Best Practices

Ejemplos avanzados y mejores prácticas para usar el plugin con modelos AI.

> Para setup e instalación ver [README.md](../README.md)

## Uso Básico

```javascript
import_html({
  html: "<div style='...'>contenido</div>",
  name: "Nombre del componente"
})
```

## Ejemplos Avanzados

### User Profile Card

```javascript
import_html({
  html: `<div style="background:white;padding:24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);max-width:400px;font-family:system-ui">
    <div style="display:flex;align-items:center;margin-bottom:16px">
      <div style="width:48px;height:48px;background:#007bff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;margin-right:16px">JD</div>
      <div>
        <h3 style="margin:0;color:#333;font-size:18px">John Doe</h3>
        <p style="margin:0;color:#666;font-size:14px">Product Designer</p>
      </div>
    </div>
    <p style="color:#666;line-height:1.5;margin:0 0 20px 0">Creating beautiful and functional user interfaces.</p>
    <button style="background:#007bff;color:white;border:none;padding:12px 24px;border-radius:8px;font-weight:bold">View Profile</button>
  </div>`,
  name: "User Profile Card"
})
```

### Dashboard Stats (Grid)

```javascript
import_html({
  html: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:32px;background:#f5f5f5">
    <div style="background:white;padding:24px;border-radius:12px;text-align:center">
      <h3 style="margin:0 0 12px 0;color:#333">Users</h3>
      <p style="font-size:32px;font-weight:bold;color:#007bff;margin:0">1,234</p>
    </div>
    <div style="background:white;padding:24px;border-radius:12px;text-align:center">
      <h3 style="margin:0 0 12px 0;color:#333">Revenue</h3>
      <p style="font-size:32px;font-weight:bold;color:#28a745;margin:0">$12,345</p>
    </div>
    <div style="background:white;padding:24px;border-radius:12px;text-align:center">
      <h3 style="margin:0 0 12px 0;color:#333">Orders</h3>
      <p style="font-size:32px;font-weight:bold;color:#ffc107;margin:0">567</p>
    </div>
  </div>`,
  name: "Dashboard Stats"
})
```

### Gradient Hero Section

```javascript
import_html({
  html: `<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:60px;text-align:center;border-radius:20px">
    <h1 style="margin:0 0 20px 0;font-size:48px;font-weight:bold">Welcome</h1>
    <p style="margin:0 0 30px 0;font-size:20px;opacity:0.9">Experience the future of design</p>
    <button style="background:white;color:#667eea;border:none;padding:16px 32px;border-radius:12px;font-weight:bold;font-size:18px">Get Started</button>
  </div>`,
  name: "Hero Section"
})
```

### Pricing Card

```javascript
import_html({
  html: `<div style="background:white;padding:32px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.1);text-align:center;max-width:300px">
    <h3 style="margin:0 0 8px 0;color:#333;font-size:24px">Pro Plan</h3>
    <p style="margin:0 0 24px 0;color:#666">Perfect for growing businesses</p>
    <div style="margin-bottom:32px">
      <span style="font-size:48px;font-weight:bold;color:#007bff">$29</span>
      <span style="color:#666">/month</span>
    </div>
    <ul style="list-style:none;padding:0;margin:0 0 32px 0;text-align:left">
      <li style="padding:8px 0;color:#333">✓ 10 team members</li>
      <li style="padding:8px 0;color:#333">✓ Unlimited projects</li>
      <li style="padding:8px 0;color:#333">✓ Priority support</li>
    </ul>
    <button style="background:#007bff;color:white;border:none;padding:16px 32px;border-radius:8px;font-weight:bold;width:100%">Get Started</button>
  </div>`,
  name: "Pricing Card"
})
```

### Contact Form

```javascript
import_html({
  html: `<form style="background:#f8f9fa;padding:32px;border-radius:16px;max-width:500px;font-family:system-ui">
    <h2 style="margin:0 0 24px 0;color:#333;text-align:center">Contact Us</h2>
    <div style="margin-bottom:20px">
      <label style="display:block;margin-bottom:8px;color:#555;font-weight:500">Full Name</label>
      <input style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px" type="text" placeholder="Enter your name">
    </div>
    <div style="margin-bottom:20px">
      <label style="display:block;margin-bottom:8px;color:#555;font-weight:500">Email</label>
      <input style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px" type="email" placeholder="Enter your email">
    </div>
    <div style="margin-bottom:24px">
      <label style="display:block;margin-bottom:8px;color:#555;font-weight:500">Message</label>
      <textarea style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;resize:vertical" rows="4" placeholder="Your message..."></textarea>
    </div>
    <button style="background:#28a745;color:white;border:none;padding:14px 28px;border-radius:8px;font-weight:bold;width:100%;font-size:16px">Send Message</button>
  </form>`,
  name: "Contact Form"
})
```

### Color Palette (Design Tokens)

```javascript
import_html({
  html: `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;padding:24px">
    <div style="background:#007bff;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">Primary</div>
    <div style="background:#28a745;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">Success</div>
    <div style="background:#ffc107;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#212529;font-weight:bold">Warning</div>
    <div style="background:#dc3545;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">Danger</div>
    <div style="background:#6c757d;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">Secondary</div>
  </div>`,
  name: "Color Palette"
})
```

## Best Practices

### HTML Structure

```javascript
// ✅ Bueno: dimensiones específicas
"width:300px;height:200px"

// ✅ Bueno: estilos completos
"background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)"

// ✅ Bueno: flexbox para layouts
"display:flex;justify-content:center;align-items:center;gap:16px"

// ❌ Evitar: unidades relativas sin contexto
"width:50%;height:auto"

// ❌ Evitar: selectores complejos
"div > p:nth-child(2)"
```

### CSS Recomendado

```css
/* Layout */
display: flex | grid | block
width: 300px (usar px)
padding: 24px
gap: 16px

/* Colores */
background: #ffffff | linear-gradient(135deg, #667eea, #764ba2)
color: #333333 | rgb(51,51,51)

/* Tipografía */
font-family: system-ui, Arial, sans-serif
font-size: 16px
font-weight: bold | 500

/* Efectos */
border-radius: 8px
box-shadow: 0 4px 12px rgba(0,0,0,0.1)
```

### Tamaños Recomendados

| Tipo | Tamaño HTML | Tiempo proceso |
|------|-------------|----------------|
| Componente pequeño | < 1KB | ~100ms |
| Layout mediano | 1-5KB | ~200ms |
| Dashboard grande | 5-20KB | ~500ms |

## Prompts que Funcionan Bien

- "Crea un card de producto moderno con imagen, título, precio y botón de compra"
- "Diseña un formulario de login con campos de email y password"
- "Haz un dashboard con 4 estadísticas en grid"
- "Crea una sección hero con gradiente y CTA centrado"
- "Diseña una tabla de precios con 3 planes"
- "Haz una navbar con logo y links de navegación"

## Workflow AI

1. **Generar HTML** - Pedir al AI que cree el componente
2. **Enviar a Figma** - Usar `import_html()`
3. **Revisar** - Verificar el resultado en Figma
4. **Iterar** - Modificar y re-enviar si es necesario
