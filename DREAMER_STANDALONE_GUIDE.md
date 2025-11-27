# 🏋️ DREAMER PWA - Guia Completo Standalone

## 📦 PARTE 1: Criar o Projeto

```bash
# 1. Criar pasta do projeto
mkdir dreamer-pwa
cd dreamer-pwa

# 2. Criar app React
npx create-react-app .

# 3. Instalar dependências
npm install react-router-dom recharts date-fns lucide-react
npm install -D tailwindcss postcss autoprefixer
npm install @radix-ui/react-dialog @radix-ui/react-popover
npm install sonner class-variance-authority clsx tailwind-merge
npm install react-day-picker

# 4. Inicializar Tailwind
npx tailwindcss init -p
```

---

## 📁 PARTE 2: Estrutura de Pastas

Crie a seguinte estrutura dentro de `src/`:

```
src/
├── components/
│   ├── ui/
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── dialog.jsx
│   │   ├── popover.jsx
│   │   ├── calendar.jsx
│   │   └── sonner.jsx
│   ├── BottomNav.js
│   ├── DateScrollPicker.js
│   └── NumberScrollPicker.js
├── contexts/
│   └── AppContext.js
├── pages/
│   ├── Home.js
│   ├── Treino.js
│   ├── Profile.js
│   ├── ActiveWorkout.js
│   ├── NewRoutine.js
│   ├── ExerciseLibrary.js
│   ├── NewMeasurement.js
│   ├── EditProfile.js
│   ├── Settings.js
│   ├── FolderManagement.js
│   └── WorkoutDetails.js
├── utils/
│   ├── db.js
│   └── calculations.js
├── App.js
├── App.css
├── index.js
└── index.css
```

---

## ⚙️ PARTE 3: Arquivos de Configuração

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### `package.json` (adicionar scripts)
```json
{
  "name": "dreamer-pwa",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.10.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.300.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-popover": "^1.0.7",
    "sonner": "^1.3.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "react-day-picker": "^8.10.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "tailwindcss-animate": "^1.0.7"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## 🎨 PARTE 4: Estilos Globais

Os arquivos CSS estão na próxima mensagem devido ao limite de caracteres.

**CONTINUA...**
