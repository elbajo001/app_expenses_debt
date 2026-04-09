# 🤖 AGENT PROMPT — App de Gestión de Gastos Compartidos

> **Instrucciones para agente de IA**: Este documento define el plan de implementación completo. Sigue cada fase en orden estricto. No avances a la siguiente fase hasta que la actual esté **compilando sin errores y funcionando correctamente**. Ante cualquier error, corrígelo antes de continuar.

---

## 🧠 CONTEXTO DEL PROYECTO

Estás construyendo una **Single Page Application (SPA)** en **React + TypeScript** para gestionar gastos compartidos entre grupos de personas. La app debe permitir crear grupos, agregar miembros, registrar gastos con división automática, y visualizar deudas entre participantes.

**Stack obligatorio:**
- React 18 + TypeScript (Vite como bundler)
- Zustand (estado global)
- TailwindCSS (estilos)
- Recharts (gráficos)
- date-fns (manejo de fechas)
- uuid (generación de IDs)
- localStorage (persistencia)

---

## 📐 REGLAS GENERALES DEL AGENTE

1. **Nunca** generes código placeholder, TODOs pendientes ni funciones vacías en el output final.
2. **Siempre** tipea explícitamente con TypeScript. Prohibido usar `any`.
3. **Siempre** maneja los edge cases: listas vacías, divisiones con cero participantes, grupos sin miembros.
4. **Antes de crear** un archivo nuevo, verifica si ya existe y debe editarse en su lugar.
5. **Cada componente** debe ser funcional, con sus props tipadas mediante `interface`.
6. **El store de Zustand** debe tener persistencia con `persist` middleware desde el inicio.
7. **No instales** librerías fuera del stack definido sin justificación explícita.
8. Al terminar cada fase, ejecuta `npm run build` y verifica que **no hay errores de TypeScript ni de compilación**.

---

## 🏗️ FASE 0 — Inicialización del Proyecto

### Objetivo
Crear la base del proyecto con toda la configuración necesaria.

### Pasos

```bash
# 1. Crear proyecto con Vite
npm create vite@latest expense-app -- --template react-ts
cd expense-app

# 2. Instalar dependencias
npm install zustand recharts date-fns uuid
npm install -D tailwindcss postcss autoprefixer @types/uuid
npx tailwindcss init -p
```

### Configurar `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

### Configurar `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Limpiar archivos generados por Vite
- Elimina el contenido de `App.tsx` (reemplazar con componente vacío temporal).
- Elimina `App.css`.
- Limpia `main.tsx` para que solo importe `App` y el CSS global.

### Verificación ✅
```bash
npm run dev  # Debe abrir sin errores
npm run build  # Debe compilar sin errores
```

---

## 🏗️ FASE 1 — Tipos e Interfaces TypeScript

### Objetivo
Definir todos los tipos del dominio **antes** de escribir lógica. Son el contrato de la aplicación.

### Archivo: `src/types/index.ts`

Implementa exactamente las siguientes interfaces, sin omitir ningún campo:

```typescript
export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'health'
  | 'other';

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Comida',
  transport: 'Transporte',
  utilities: 'Servicios',
  entertainment: 'Entretenimiento',
  health: 'Salud',
  other: 'Otro',
};

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#f97316',
  transport: '#3b82f6',
  utilities: '#8b5cf6',
  entertainment: '#ec4899',
  health: '#10b981',
  other: '#6b7280',
};

export interface Person {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: string;        // Person.id
  participants: string[]; // Person.id[]
  date: string;          // ISO date string (YYYY-MM-DD)
  createdAt: string;     // ISO datetime
  splits?: Record<string, number>; // Person.id -> monto personalizado
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[];    // Person.id[]
  createdAt: string;
}

export interface Debt {
  from: string;  // Person.id (quien debe)
  to: string;    // Person.id (a quien le debe)
  amount: number;
}

export interface ExpenseFilters {
  category?: ExpenseCategory | 'all';
  personId?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
  searchText?: string;
}
```

### Verificación ✅
```bash
npx tsc --noEmit  # Cero errores
```

---

## 🏗️ FASE 2 — Store Global con Zustand

### Objetivo
Implementar el estado global con persistencia en localStorage.

### Archivo: `src/store/expenseStore.ts`

El store debe incluir:

**Estado:**
- `groups: Group[]`
- `people: Person[]`
- `expenses: Expense[]`
- `activeGroupId: string | null`

**Acciones para Grupos:**
- `addGroup(data: Omit<Group, 'id' | 'createdAt'>): void`
- `updateGroup(id: string, data: Partial<Pick<Group, 'name' | 'description'>>): void`
- `deleteGroup(id: string): void` — también elimina gastos y miembros huérfanos del grupo
- `setActiveGroup(id: string | null): void`

**Acciones para Personas:**
- `addPerson(groupId: string, name: string): void` — genera color aleatorio único
- `removePerson(groupId: string, personId: string): void` — lo quita del grupo pero preserva el person para historial

**Acciones para Gastos:**
- `addExpense(data: Omit<Expense, 'id' | 'createdAt'>): void`
- `updateExpense(id: string, data: Partial<Omit<Expense, 'id' | 'groupId' | 'createdAt'>>): void`
- `deleteExpense(id: string): void`

**Selectores derivados (como funciones dentro del store o getters):**
- `getGroupById(id: string): Group | undefined`
- `getPeopleByGroup(groupId: string): Person[]`
- `getExpensesByGroup(groupId: string): Expense[]`
- `getPersonById(id: string): Person | undefined`

**Configuración obligatoria del store:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Usar persist middleware para guardar en localStorage
export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({ /* implementación */ }),
    { name: 'expense-app-storage' }
  )
);
```

**Generación de colores para personas:**
Usa esta paleta fija rotativa (10 colores), no colores aleatorios:
```typescript
const PERSON_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#06b6d4', '#84cc16'
];
```
Asigna el siguiente color disponible que no esté en uso en el grupo.

### Verificación ✅
```bash
npx tsc --noEmit  # Cero errores
```

---

## 🏗️ FASE 3 — Utilidades y Cálculos

### Objetivo
Implementar las funciones puras de negocio (sin efectos secundarios).

### Archivo: `src/utils/calculations.ts`

Implementa el algoritmo de cálculo de deudas:

```typescript
import type { Expense, Debt, Person } from '../types';

/**
 * Calcula las deudas mínimas entre personas dado un conjunto de gastos.
 * Usa el algoritmo de simplificación de deudas (debt settlement).
 * 
 * Algoritmo:
 * 1. Para cada gasto, calcular cuánto debe cada participante al pagador
 * 2. Construir un balance neto por persona (positivo = le deben, negativo = debe)
 * 3. Simplificar usando greedy: el que más debe paga al que más le deben
 */
export function calculateDebts(expenses: Expense[]): Debt[] {
  // Implementar completamente. No dejar TODO.
}

/**
 * Calcula el total gastado en un array de gastos
 */
export function calculateTotal(expenses: Expense[]): number {
  // Implementar
}

/**
 * Calcula cuánto gastó cada persona (como pagador)
 */
export function calculateSpentByPerson(
  expenses: Expense[],
  people: Person[]
): Array<{ person: Person; amount: number }> {
  // Implementar
}

/**
 * Calcula gastos agrupados por categoría
 */
export function calculateByCategory(
  expenses: Expense[]
): Array<{ category: string; amount: number; label: string }> {
  // Implementar
}
```

### Archivo: `src/utils/formatting.ts`

```typescript
/**
 * Formatea número como moneda (COP por defecto)
 * Ej: 15000 -> "$15,000"
 */
export function formatCurrency(amount: number, locale = 'es-CO', currency = 'COP'): string

/**
 * Formatea fecha ISO a formato legible
 * Ej: "2024-01-15" -> "15 ene 2024"
 */
export function formatDate(isoDate: string): string

/**
 * Trunca texto a N caracteres con ellipsis
 */
export function truncate(text: string, maxLength: number): string
```

### Archivo: `src/utils/validation.ts`

```typescript
/**
 * Valida que un gasto sea válido antes de guardarlo.
 * Retorna array de mensajes de error. Array vacío = válido.
 */
export function validateExpense(data: {
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  date: string;
}): string[]

/**
 * Valida nombre de grupo o persona
 */
export function validateName(name: string): string[]
```

### Verificación ✅
```bash
npx tsc --noEmit  # Cero errores
```

---

## 🏗️ FASE 4 — Componentes Comunes (UI Base)

### Objetivo
Construir los componentes reutilizables que usará toda la app.

### Componentes a crear en `src/components/common/`:

#### `Button.tsx`
Props: `variant: 'primary' | 'secondary' | 'danger' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`, `loading?: boolean`, `disabled?: boolean`, `onClick`, `children`, `type?: 'button' | 'submit'`, `className?: string`.

#### `Modal.tsx`
Props: `isOpen: boolean`, `onClose: () => void`, `title: string`, `children`, `size?: 'sm' | 'md' | 'lg'`.
- Debe bloquear el scroll del body cuando está abierto.
- Cierra al presionar Escape.
- Cierra al hacer click en el backdrop (fondo oscuro).
- Animación de entrada/salida con CSS transition.

#### `Card.tsx`
Props: `children`, `className?: string`, `onClick?: () => void`.
Wrapper con fondo blanco, sombra sutil, bordes redondeados.

#### `Badge.tsx`
Props: `label: string`, `color?: string` (hex), `size?: 'sm' | 'md'`.
Muestra una etiqueta coloreada (útil para categorías y personas).

#### `EmptyState.tsx`
Props: `icon: string` (emoji), `title: string`, `description?: string`, `action?: { label: string; onClick: () => void }`.
Componente para cuando no hay datos que mostrar.

#### `ConfirmDialog.tsx`
Props: `isOpen: boolean`, `onClose: () => void`, `onConfirm: () => void`, `title: string`, `message: string`, `confirmLabel?: string`, `danger?: boolean`.

### Verificación ✅
Renderiza cada componente en `App.tsx` temporalmente para verificar que se ven correctamente y sin errores de TS.

---

## 🏗️ FASE 5 — Layout Principal

### Objetivo
Construir la estructura visual de la aplicación.

### Archivo: `src/components/layout/Layout.tsx`

La app tiene dos paneles principales:
1. **Sidebar** (izquierda): Lista de grupos + botón crear grupo
2. **Main Content** (derecha): Contenido dinámico según la vista activa

### Vista activa
Crea un estado local o en el store: `activeView: 'dashboard' | 'expenses' | 'people' | 'debts'`

### Archivo: `src/components/layout/Sidebar.tsx`

Debe mostrar:
- Logo / nombre de la app ("SplitEasy" o similar)
- Lista de grupos del store (clickeable para seleccionar)
- Grupo activo resaltado visualmente
- Botón "+ Nuevo Grupo"
- Navegación inferior con íconos: Dashboard, Gastos, Personas, Deudas

### Archivo: `src/components/layout/Header.tsx`

Muestra:
- Nombre del grupo activo
- Cantidad de miembros
- Tabs de navegación (Dashboard / Gastos / Personas / Deudas)

### Reglas de diseño
- Color primario: `#4f46e5` (índigo)
- Sidebar: fondo `#1e1b4b` (índigo oscuro), texto blanco
- Contenido: fondo `#f8fafc`
- Tipografía: usa Google Fonts `Inter` (añadir al `index.html`)
- Responsive: en mobile, sidebar colapsa a un menu hamburguesa

### Verificación ✅
La app muestra el layout completo con sidebar y header, sin errores.

---

## 🏗️ FASE 6 — Gestión de Grupos y Personas

### Objetivo
Implementar el CRUD completo de grupos y personas.

### Componentes en `src/components/groups/`:

#### `GroupList.tsx`
Lista todos los grupos. Cada item muestra: nombre, descripción, cantidad de miembros, fecha de creación. Tiene botones de editar y eliminar (con confirmación).

#### `GroupForm.tsx`
Formulario para crear/editar grupo.
Props: `initialData?: Group`, `onSubmit: (data) => void`, `onCancel: () => void`.
Campos: nombre (requerido, max 50 chars), descripción (opcional, max 200 chars).

#### `GroupModal.tsx`
Modal que envuelve `GroupForm`. Se abre al clickear "+ Nuevo Grupo" o el ícono de editar.

### Componentes en `src/components/people/`:

#### `PersonList.tsx`
Muestra las personas del grupo activo.
Cada persona: avatar circular con sus iniciales y color único, nombre.
Botón para remover del grupo (con confirmación).

#### `PersonForm.tsx`
Input simple: solo nombre. Al hacer submit, llama `addPerson(groupId, name)`.

#### `PersonBadge.tsx`
Componente pequeño: círculo de color + nombre. Usado en listas de participantes.

### Reglas críticas
- Si se intenta eliminar un grupo que tiene gastos registrados, mostrar advertencia: "Este grupo tiene N gastos. ¿Estás seguro?"
- Si no hay grupo activo, mostrar `EmptyState` pidiendo crear uno.

### Verificación ✅
- Crear un grupo → aparece en la sidebar.
- Agregar personas → aparecen en la lista.
- Eliminar persona → desaparece.
- Editar grupo → los datos se actualizan.

---

## 🏗️ FASE 7 — Registro y Lista de Gastos

### Objetivo
Implementar el formulario de gastos y la lista con filtros.

### Componente: `src/components/expenses/ExpenseForm.tsx`

Props: `groupId: string`, `initialData?: Expense`, `onSubmit: (data) => void`, `onCancel: () => void`.

**Campos del formulario:**
1. `description` — Input texto. Requerido. Max 100 chars.
2. `amount` — Input numérico. Requerido. Mayor a 0.
3. `category` — Select con las 6 categorías definidas en tipos.
4. `paidBy` — Select con personas del grupo. Requerido.
5. `participants` — Checkboxes múltiples con personas del grupo. Mínimo 1.
6. `date` — Date picker. Por defecto: hoy.
7. `splitType` — Radio: "Partes iguales" (default) | "Personalizado".
8. Si `splitType === 'custom'`: mostrar inputs numéricos por participante. La suma debe igual al total.

**Validaciones en tiempo real:**
- Mostrar errores bajo cada campo al perder foco (blur).
- El botón "Guardar" debe estar deshabilitado si hay errores.
- Usar `validateExpense` de utils.

### Componente: `src/components/expenses/ExpenseCard.tsx`

Muestra un gasto individual:
- Descripción (truncada si es muy larga)
- Monto formateado
- Badge de categoría (con color)
- "Pagó: [nombre]" con avatar
- "Participantes: [avatares]"
- Fecha formateada
- Botones: editar, eliminar

### Componente: `src/components/expenses/ExpenseList.tsx`

- Lista de `ExpenseCard` ordenada por fecha descendente.
- Si no hay gastos: `EmptyState`.
- Botón flotante "+ Nuevo Gasto" (fijo en esquina inferior derecha en mobile).

### Componente: `src/components/expenses/ExpenseFilters.tsx`

Barra de filtros con:
- Input de búsqueda por descripción (debounced 300ms)
- Select de categoría (todas / categoría específica)
- Select de persona (todos / persona específica)
- Date range: fecha desde / fecha hasta
- Botón "Limpiar filtros" (aparece solo si hay filtros activos)

La lógica de filtrado debe aplicarse dentro del componente que usa la lista, no en el store.

### Verificación ✅
- Agregar gasto → aparece en la lista.
- Filtrar por categoría → lista se actualiza.
- Editar gasto → formulario precargado.
- Eliminar → confirmación → desaparece.

---

## 🏗️ FASE 8 — Vista de Deudas

### Objetivo
Mostrar quién le debe a quién y cuánto, con opción de marcar pagos.

### Componente: `src/components/dashboard/DebtsTable.tsx`

Utiliza `calculateDebts()` de utils para obtener las deudas del grupo activo.

Muestra una tabla / lista de cards con:
- Avatar + nombre de quien debe
- Ícono de flecha →
- Avatar + nombre de a quien le debe
- Monto resaltado en rojo
- Botón "Marcar como pagado" → abre `PaymentModal`

Si no hay deudas: mostrar mensaje positivo "¡Todos están al día! 🎉".

### Componente: `src/components/modals/PaymentModal.tsx`

Confirma el pago entre dos personas.
Al confirmar, **no elimina el gasto** sino que registra un nuevo gasto de tipo "liquidación" con:
- `description`: "Pago: [nombre from] → [nombre to]"
- `amount`: el monto de la deuda
- `category`: 'other'
- `paidBy`: la persona que paga
- `participants`: [from, to]
- `splits`: `{ [to.id]: monto }` (solo le corresponde al receptor)

Esto garantiza que el historial sea inmutable y los balances se recalculen correctamente.

### Verificación ✅
- Con gastos registrados, la tabla muestra las deudas correctas.
- Marcar como pagado → las deudas se recalculan.
- Sin gastos: mensaje "todos al día".

---

## 🏗️ FASE 9 — Dashboard y Gráficos

### Objetivo
Vista resumen con KPIs y gráficos de Recharts.

### Componente: `src/components/dashboard/Dashboard.tsx`

**Sección 1 — Summary Cards**

4 cards en grid 2x2:
1. **Total Gastado** — suma de todos los gastos del grupo
2. **Este Mes** — gastos del mes actual
3. **Deudas Pendientes** — suma total de todas las deudas activas
4. **Miembros** — cantidad de personas en el grupo

**Sección 2 — Gráficos (Recharts)**

Gráfico 1: `PieChart` — Gastos por categoría
- Cada slice = una categoría con su color de `CATEGORY_COLORS`
- Tooltip con monto y porcentaje
- Leyenda abajo

Gráfico 2: `BarChart` — Gastos por persona
- Eje X: nombres de personas
- Eje Y: monto total pagado
- Barras con el color de cada persona

**Sección 3 — Deudas recientes**
Las primeras 3 deudas de la tabla (preview). Enlace "Ver todas".

### Reglas de Recharts
- Todos los gráficos deben ser `ResponsiveContainer` con `width="100%"`.
- Tooltips deben mostrar valores formateados con `formatCurrency`.
- Si no hay datos suficientes para graficar, mostrar `EmptyState` en lugar del gráfico.

### Verificación ✅
- Dashboard muestra datos reales del store.
- Gráficos renderizan sin errores.
- Los montos en los summary cards son correctos.

---

## 🏗️ FASE 10 — Exportación CSV

### Objetivo
Permitir exportar los gastos del grupo activo a CSV.

### Archivo: `src/utils/export.ts`

```typescript
/**
 * Genera y descarga un CSV con los gastos del grupo.
 * Columnas: Fecha, Descripción, Categoría, Monto, Pagado por, Participantes
 */
export function exportExpensesToCSV(
  expenses: Expense[],
  people: Person[],
  groupName: string
): void {
  // Implementar completamente:
  // 1. Construir string CSV con headers y filas
  // 2. Crear Blob con type 'text/csv;charset=utf-8;'
  // 3. Crear URL con URL.createObjectURL
  // 4. Crear <a> temporal, asignar href y download, hacer click
  // 5. Revocar URL con URL.revokeObjectURL
}
```

Agrega un botón "Exportar CSV" en la vista de gastos (cerca de los filtros).

### Verificación ✅
- Click en exportar → se descarga un archivo `.csv` con los datos correctos.
- El CSV se abre correctamente en Excel / Google Sheets.

---

## 🏗️ FASE 11 — Polish y Responsive

### Objetivo
Asegurar que la app se vea bien en todos los tamaños de pantalla y tiene feedback de usuario.

### Checklist obligatorio

**Responsive:**
- [ ] En mobile (< 640px): sidebar se oculta, hay botón hamburguesa para abrirla como overlay
- [ ] En tablet (640-1024px): sidebar colapsada (solo íconos)
- [ ] En desktop (> 1024px): sidebar expandida con texto

**Feedback visual:**
- [ ] Loading spinner en el botón de guardar mientras procesa
- [ ] Toasts / notificaciones para: gasto creado, gasto eliminado, grupo creado, pago registrado
  - Implementa un sistema simple de toasts sin librerías externas (contexto React + posición fixed)
- [ ] Animaciones de entrada para las cards de gastos (fade in + slide up con CSS)
- [ ] Hover states en todos los elementos clickeables

**Accesibilidad básica:**
- [ ] Todos los inputs tienen `label` asociado
- [ ] Los botones de solo ícono tienen `aria-label`
- [ ] Focus visible en todos los elementos interactivos

**Estados de carga inicial:**
- [ ] Si el localStorage está vacío, mostrar pantalla de bienvenida con instrucciones de primeros pasos

### Verificación ✅
- Probar en viewport 375px (iPhone SE), 768px (tablet), 1280px (desktop).
- No hay overflow horizontal en ningún tamaño.

---

## 🏗️ FASE FINAL — Verificación Integral

### Checklist de calidad

Antes de declarar el proyecto completo, verifica **cada punto**:

**Funcionalidad:**
- [ ] Crear grupo → agregar personas → registrar gastos → ver deudas funciona end-to-end
- [ ] Editar y eliminar grupos, personas y gastos funciona sin errores
- [ ] Los cálculos de deudas son matemáticamente correctos (suma de deudas = suma de gastos no liquidados)
- [ ] Marcar pago como liquidado actualiza las deudas inmediatamente
- [ ] Los filtros de gastos funcionan combinados
- [ ] El CSV se exporta con datos correctos
- [ ] Los datos persisten al recargar la página (localStorage)

**Código:**
- [ ] `npx tsc --noEmit` → 0 errores
- [ ] `npm run build` → 0 errores, 0 warnings críticos
- [ ] No hay `console.log` en código de producción
- [ ] No hay `any` en TypeScript
- [ ] No hay `// TODO` sin resolver

**UX:**
- [ ] La app funciona sin datos iniciales (estado vacío)
- [ ] Todos los formularios tienen validación y mensajes de error claros
- [ ] Las acciones destructivas piden confirmación
- [ ] El diseño es consistente en todo el flujo

---

## ⚠️ NOTAS IMPORTANTES PARA EL AGENTE

1. **localStorage tiene límite de ~5MB.** Si el proyecto crece, advierte al usuario sobre migrar a IndexedDB.

2. **El cálculo de deudas es el corazón del app.** Prueba este algoritmo con casos edge:
   - 3 personas, gastos cruzados
   - Una persona que pagó todo
   - Participante que no pagó nada
   - Gastos con splits personalizados

3. **Los IDs siempre se generan con `uuid`**, nunca con `Math.random()` ni `Date.now()`.

4. **Nunca mutar el estado directamente en Zustand.** Siempre usar `set()` con objetos nuevos (spread).

5. **El store no debe tener lógica de UI** (no conoce modales, no maneja navegación). Solo datos y mutaciones de datos.

6. **Los componentes de formulario** son controlados (controlled components). El estado del form vive en el componente, no en el store global. Solo al hacer submit se llama al store.

7. **Orden de implementación es obligatorio.** No saltes fases. Cada fase depende de la anterior.
