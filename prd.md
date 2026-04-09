# Documento de Requisitos de Producto (PRD)
## SplitEasy - Gestión de Gastos Compartidos

**Versión**: 1.0  
**Fecha**: 2026-04-09  
**Estado**: En Desarrollo  

---

## 1. RESUMEN EJECUTIVO

**SplitEasy** es una aplicación web moderna para gestionar gastos compartidos entre grupos de personas. Permite registrar quién pagó qué, calcular automáticamente deudas pendientes y proporcionar visualizaciones claras de cómo se distribuyen los gastos.

### Valor Propuesto
- Elimina cálculos manuales de división de gastos
- Reduce conflictos sobre dinero pendiente
- Proporciona claridad total sobre transacciones pendientes
- Mantiene historial completo y organizado de gastos
- Interfaz intuitiva y responsive

### Público Objetivo
- Grupos de amigos en viajes
- Compañeros de apartamento/casa
- Familias que comparten gastos
- Organizadores de eventos
- Equipos de trabajo compartiendo gastos

---

## 2. DESCRIPCIÓN DEL PRODUCTO

### Visión
Simplificar la gestión de finanzas compartidas mediante una plataforma intuitiva que automatiza cálculos complejos y elimina la ambigüedad en transacciones pendientes.

### Misión
Proporcionar una herramienta confiable, fácil de usar y accesible que permita a grupos de personas mantener una relación económica transparente y libre de conflictos.

### Objetivos del Producto

**Corto Plazo (MVP)**
- ✅ Crear y gestionar grupos
- ✅ Registrar gastos con categorización
- ✅ Calcular deudas automáticamente
- ✅ Visualizar análisis de gastos
- ✅ Exportar reportes

**Mediano Plazo**
- [ ] Autenticación de usuarios
- [ ] Saldo persistente en backend
- [ ] Compartir grupos por enlace
- [ ] Notificaciones
- [ ] Historial de cambios

**Largo Plazo**
- [ ] Aplicación móvil
- [ ] OCR para facturas
- [ ] Integración bancaria
- [ ] Recomendaciones de optimización
- [ ] Integraciones con otros servicios

---

## 3. REQUISITOS FUNCIONALES

### 3.1 Gestión de Grupos

**RF-001: Crear Grupo**
- El usuario puede crear un nuevo grupo especificando nombre y descripción
- Al crear, el grupo se activa automáticamente
- Se genera ID único (UUID)
- Timestamp de creación se registra

**RF-002: Listar Grupos**
- Usuario puede ver todos sus grupos
- Selector en sidebar para cambiar grupo activo
- Indicador visual del grupo actualmente seleccionado

**RF-003: Editar Grupo**
- Usuario puede modificar nombre y descripción
- Los cambios se guardan en tiempo real

**RF-004: Eliminar Grupo**
- Usuario puede eliminar un grupo
- Se elimina también el historial de gastos del grupo
- Confirmación antes de eliminar (diálogo)
- Se activa automáticamente otro grupo si existen

**RF-005: Información del Grupo**
- Vista que muestra:
  - Nombre del grupo
  - Descripción
  - Total de gastos registrados
  - Cantidad de miembros
  - Fecha de creación

### 3.2 Gestión de Participantes

**RF-006: Agregar Persona**
- Especificar nombre de la persona
- Color se asigna automáticamente (de paleta predefinida)
- Persona se vincula al grupo activo
- Validación: nombre no vacío

**RF-007: Listar Personas**
- Ver todos los miembros del grupo actual
- Mostrar nombre, color y balance (cuánto debe/le deben)

**RF-008: Eliminar Persona**
- Remover persona del grupo
- Confirmación antes de eliminar
- Los gastos no se eliminan, solo se marca la persona como inactiva
- Afecta recalculación de deudas

**RF-009: Ver Detalles de Persona**
- Resumen de participante:
  - Gastos en los que participó
  - Total gastado
  - Total adeudado
  - Transacciones pendientes

### 3.3 Gestión de Gastos

**RF-010: Crear Gasto**
- Formulario modal con campos:
  - Descripción (texto)
  - Monto (número decimal)
  - Categoría (select de 6 opciones)
  - Pagador (select de personas)
  - Participantes (checkboxes)
  - Tipo de división (igual/personalizada)
  - Fecha (date picker, default: hoy)
- Validación: todos los campos requeridos
- Al crear, se recalculan deudas automáticamente
- Toast de confirmación

**RF-011: Editar Gasto**
- Abrir modal con datos del gasto
- Permitir modificar cualquier campo
- Recalcular deudas al guardar

**RF-012: Eliminar Gasto**
- Confirmación antes de eliminar
- Se recalculan deudas automáticamente
- Log en historial

**RF-013: Listar Gastos**
- Mostrar todos los gastos del grupo en tabla o lista
- Ordenar por:
  - Fecha (descendente, default)
  - Monto (descendente)
  - Categoría
- Filtrar por:
  - Categoría
  - Persona (pagador)
  - Rango de fechas
- Buscar por descripción

**RF-014: Categorización de Gastos**
- Categorías disponibles:
  - 🍽️ Comida
  - 🚗 Transporte
  - 💡 Servicios (utilidades)
  - 🎭 Entretenimiento
  - ⚕️ Salud
  - 📦 Otros
- Color asociado a cada categoría
- Filtro por categoría en listado

**RF-015: División de Gastos**
- **División Igual**: Monto se divide equitativamente entre participantes
- **División Personalizada**: Usuario especifica monto para cada participante

### 3.4 Cálculo y Visualización de Deudas

**RF-016: Calcular Deudas**
- Algoritmo greedy que:
  1. Calcula balance individual (cuánto pagó - cuánto debe)
  2. Identifica pagadores netos y deudores netos
  3. Empareja transacciones minimizando número de transferencias
  4. Genera lista de pagos necesarios
- Actualiza en tiempo real al agregar/editar/eliminar gastos

**RF-017: Vista de Deudas**
- Tabla con columnas:
  - Persona que debe
  - Persona a pagar
  - Monto
  - Estado (pendiente/pagado)
  - Acciones (marcar como pagado)
- Filtro por estado
- Resumen de deudas totales pendientes

**RF-018: Resumen de Panel (Dashboard)**
- Tarjetas de resumen:
  - Total gastado (todos los tiempos)
  - Gasto este mes
  - Deudas pendientes (monto + cantidad)
  - Miembros del grupo
- Gráficos:
  - **Pie Chart**: Gastos por categoría
  - **Bar Chart**: Gastos por persona

### 3.5 Exportación de Datos

**RF-019: Exportar a CSV**
- Generar archivo CSV con:
  - Encabezado con metadatos (grupo, fecha export, etc.)
  - Todas las transacciones
  - Deudas pendientes
- Descarga automática al navegador
- Nombre de archivo: `grupo_[nombre]_[fecha].csv`

---

## 4. REQUISITOS NO FUNCIONALES

### 4.1 Rendimiento
- Carga inicial < 2 segundos
- Interacciones con feedback inmediato (< 200ms)
- Soportar hasta 1000 gastos por grupo sin degradación
- Cálculos de deudas completados en < 100ms

### 4.2 Usabilidad (UX)
- Interfaz intuitiva sin aprendizaje previo
- Responsive: mobile (320px+), tablet, desktop
- Accesibilidad WCAG AA:
  - Contraste suficiente
  - Navegación por teclado
  - Labels en formularios
- Idioma: Español (puede ser multilenguaje)

### 4.3 Confiabilidad
- Persistencia de datos automática en localStorage
- Sin pérdida de datos al cerrar/refrescar navegador
- Recuperación ante errores de sincronización
- Validación de datos en entrada

### 4.4 Seguridad (Consideraciones Futuras)
- Encriptación de datos en localStorage
- Autenticación de usuarios (futuro)
- RBAC para grupo (futuro)
- Auditoría de cambios (futuro)

### 4.5 Mantenibilidad
- Código TypeScript con tipos estrictos
- Componentes reutilizables
- Separación de concerns (UI, lógica, datos)
- Buena cobertura de pruebas (futuro)
- Documentación de código

### 4.6 Escalabilidad
- Arquitectura preparada para backend
- Store centralizado (Zustand) fácil de migrar a API
- Paginación para grandes listas (futuro)
- Caching de cálculos (futuro)

---

## 5. ARQUITECTURA DEL PRODUCTO

### 5.1 Stack Tecnológico

```
Frontend:
├── React 19.2.4 (Framework UI)
├── TypeScript 6.0.2 (Type Safety)
├── Vite 8.0.4 (Build Tool)
├── Zustand 5.0.12 (State Management)
├── Tailwind CSS 4.2.2 (Styling)
├── Recharts 3.8.1 (Charts)
├── date-fns 4.1.0 (Date Utilities)
└── uuid 13.0.0 (ID Generation)

Storage:
└── localStorage (Persistencia local con Zustand persist)

Build & Dev:
├── Babel Compiler (React optimizations)
├── React Compiler (Experimental)
└── ESLint (Code quality)
```

### 5.2 Estructura de Carpetas

```
src/
├── components/
│   ├── common/              ← Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── Loading.tsx
│   │
│   ├── layout/              ← Layout principal
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── WelcomeScreen.tsx
│   │
│   ├── dashboard/           ← Dashboard y análisis
│   │   ├── DashboardView.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── CategoryChart.tsx
│   │   ├── PersonChart.tsx
│   │   ├── DebtsList.tsx
│   │   └── GroupInfo.tsx
│   │
│   ├── expenses/            ← Gestión de gastos
│   │   ├── ExpensesView.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   └── ExpenseFilters.tsx
│   │
│   ├── groups/              ← Gestión de grupos
│   │   ├── GroupsView.tsx
│   │   └── GroupForm.tsx
│   │
│   └── people/              ← Gestión de personas
│       ├── PeopleView.tsx
│       └── PersonForm.tsx
│
├── store/
│   └── expenseStore.ts      ← Zustand store (estado global)
│
├── contexts/
│   └── ToastContext.tsx     ← Sistema de notificaciones
│
├── types/
│   └── index.ts             ← Definiciones de tipos
│
├── utils/
│   ├── calculations.ts      ← Lógica de cálculos (deudas, totales)
│   ├── formatting.ts        ← Formateo (moneda, fechas)
│   ├── helpers.ts           ← Funciones utilitarias
│   ├── validation.ts        ← Validación de datos
│   ├── export.ts            ← Exportación a CSV
│   └── colors.ts            ← Paleta de colores
│
├── assets/                  ← Imágenes, iconos, fuentes
├── App.tsx                  ← Componente raíz
├── main.tsx                 ← Entry point
└── index.css                ← Estilos globales
```

### 5.3 Flujo de Datos

```
┌─────────────────────────────────────────┐
│          React Components               │
│  (UI - DashboardView, ExpenseForm, ...) │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│         Zustand Store                   │
│  (expenseStore - Estado Global)         │
│  - groups                               │
│  - people                               │
│  - expenses                             │
│  - activeGroupId                        │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│      Utilidades & Cálculos              │
│  - calculateDebts()                     │
│  - calculateByCategory()                │
│  - validateExpense()                    │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│       localStorage (Persistencia)       │
│  - Serialización automática             │
│  - Recuperación al cargar               │
└─────────────────────────────────────────┘
```

---

## 6. MODELOS DE DATOS

### 6.1 Esquema de Datos

```typescript
// Grupo de gastos compartidos
interface Group {
  id: string              // UUID
  name: string            // Nombre del grupo
  description?: string    // Descripción opcional
  members: string[]       // Array de IDs de personas
  createdAt: string       // ISO Date string
}

// Persona participante
interface Person {
  id: string              // UUID
  name: string            // Nombre
  color: string           // Color hexadecimal (#RRGGBB)
  groupId: string         // ID del grupo al que pertenece
}

// Gasto registrado
interface Expense {
  id: string              // UUID
  groupId: string         // ID del grupo
  description: string     // Descripción del gasto
  amount: number          // Monto en pesos (decimal)
  category: ExpenseCategory
  paidBy: string          // ID de persona que pagó
  participants: string[]  // IDs de personas que participan
  date: string            // ISO Date string
  createdAt: string       // ISO Date string
  splits?: Record<string, number> // División personalizada (opcional)
}

// Deuda pendiente
interface Debt {
  from: string            // ID de persona que debe
  to: string              // ID de persona a pagar
  amount: number          // Monto adeudado
}

// Categorías de gastos
type ExpenseCategory = 
  | 'food'           // 🍽️ Comida
  | 'transport'      // 🚗 Transporte
  | 'utilities'      // 💡 Servicios
  | 'entertainment'  // 🎭 Entretenimiento
  | 'health'         // ⚕️ Salud
  | 'other'          // 📦 Otros
```

### 6.2 Relaciones

```
Group (1) ──────── (*) Person
  │
  └──────── (*) Expense
  
Expense (*) ──────── (1) Person (paidBy)
  │
  └──────── (*) Person (participants)
```

---

## 7. FLUJOS DE USUARIO PRINCIPALES

### 7.1 Primer Acceso - Crear Grupo

```
1. Usuario accede a la app
2. Ve WelcomeScreen
3. Ingresa nombre del grupo
4. Sistema crea grupo y lo activa
5. Usuario es llevado a Layout principal
6. Sistema sugiere agregar personas
```

### 7.2 Agregar Gasto

```
1. Usuario en ExpensesView
2. Hace clic en "Nuevo Gasto"
3. Modal se abre con ExpenseForm
4. Usuario completa:
   - Descripción
   - Monto
   - Categoría
   - Quién pagó
   - Quiénes participan
   - Tipo de división
   - Fecha
5. Validación en tiempo real
6. Usuario confirma
7. Sistema:
   - Crea gasto
   - Recalcula deudas
   - Muestra toast de éxito
   - Actualiza lista
```

### 7.3 Ver Deudas Pendientes

```
1. Usuario accede a DebtsView
2. Sistema calcula deudas (algoritmo greedy)
3. Usuario ve tabla con:
   - Quién debe a quién
   - Montos
   - Estado
4. Opción de marcar como pagado
5. Opción de registrar pago nuevo
6. Exportar reporte
```

### 7.4 Exportar Datos

```
1. Usuario en cualquier vista
2. Hace clic en "Exportar"
3. Sistema genera CSV con:
   - Metadatos
   - Todos los gastos
   - Deudas pendientes
4. Navegador descarga archivo
```

---

## 8. CRITERIOS DE ACEPTACIÓN

### Por Característica

**Crear Grupo:**
- [x] Se puede crear grupo con nombre
- [x] Descripción es opcional
- [x] Se genera ID único
- [x] Grupo se activa automáticamente
- [x] Se persiste en localStorage

**Agregar Gasto:**
- [x] Todos los campos son requeridos
- [x] Validación muestra errores claros
- [x] Deudas se recalculan automáticamente
- [x] Toast muestra confirmación
- [x] Lista se actualiza en tiempo real

**Cálculo de Deudas:**
- [x] Algoritmo greedy minimiza transacciones
- [x] No hay ciclos de pagos
- [x] Cálculo es correcto math-wise
- [x] Manejo de decimales correcto

**Persistencia:**
- [x] Datos se guardan en localStorage
- [x] Datos persisten al refrescar página
- [x] Sincronización en múltiples tabs

**Responsive:**
- [x] Mobile (320px): Todas características funcionan
- [x] Tablet (768px): Layout optimizado
- [x] Desktop (1024px+): Full experience

---

## 9. DEFINICIÓN DE VISTAS

### 9.1 Vista: Dashboard (Inicio)

**Componentes:**
- SummaryCards (4 tarjetas: Total, Este mes, Deudas, Miembros)
- CategoryChart (Pie chart)
- PersonChart (Bar chart)
- DebtsList (Top 3 deudas)
- GroupInfo (Detalles del grupo)

**Acciones:**
- Ver análisis
- Navegar a otras vistas
- Ver más deudas (link)

### 9.2 Vista: Gastos (Expenses)

**Componentes:**
- ExpenseFilters (Búsqueda, filtros, sorting)
- ExpenseList (Tabla de gastos)
- Botón "Nuevo Gasto"

**Acciones:**
- Crear gasto (modal)
- Editar gasto
- Eliminar gasto
- Filtrar y buscar
- Ordenar

### 9.3 Vista: Personas (People)

**Componentes:**
- PeopleList (Lista de miembros)
- PersonForm (Modal para agregar)
- Resumen por persona (expandible)

**Acciones:**
- Agregar persona
- Ver balance
- Eliminar persona

### 9.4 Vista: Deudas (Debts)

**Componentes:**
- DebtsList (Tabla de deudas)
- Filtro por estado
- Resumen de deudas totales

**Acciones:**
- Marcar como pagado
- Ver detalles
- Exportar reporte

### 9.5 Vista: Bienvenida (Welcome)

**Componentes:**
- Logo/Branding
- Descripción del app
- Formulario para primer grupo

**Acciones:**
- Crear primer grupo

---

## 10. CASOS DE USO AVANZADOS

### 10.1 Gasto de Viaje Complicado

**Escenario:**
- Grupo de 4 amigos en viaje
- Uno pagó hotel ($200), los otros pagaron comida
- División no es igual (2 desayunos vs 4 almuerzos)

**Solución:**
- Crear gasto hotel: pagador = Persona A, participantes = todos, tipo = personalizado
- Especificar splits: Persona A = $50, B = $50, C = $50, D = $50
- Sistema calcula deuda automáticamente

### 10.2 Auditoría de Gastos

**Necesidad:**
- Verificar quién pagó qué en el mes

**Solución:**
- Filtrar por mes en ExpensesList
- Ver totales por persona
- Exportar CSV con metadatos

### 10.3 Liquidación Parcial

**Escenario:**
- Persona A debe $250 a Persona B
- Solo puede pagar $100 ahora

**Solución (Futuro):**
- Registrar pago de $100
- Sistema actualiza deuda a $150
- Mantiene historial de pagos

---

## 11. MÉTRICAS Y ANALÍTICA

### Métricas de Negocio (Futuro)
- Usuarios activos
- Grupos creados
- Gastos registrados
- Deudas resueltas
- Tasa de retención

### Métricas Técnicas
- Tiempo de carga
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- Errores en tiempo real
- Performance de cálculos

---

## 12. ROADMAP DEL PRODUCTO

### Fase 1: MVP (Actual) ✅
- [x] CRUD de grupos
- [x] CRUD de personas
- [x] CRUD de gastos
- [x] Cálculo de deudas
- [x] Dashboard con gráficos
- [x] Exportación CSV
- [x] Persistencia local
- [x] UI responsive

### Fase 2: Autenticación & Backend (2-3 meses)
- [ ] Autenticación de usuarios
- [ ] Base de datos
- [ ] API REST
- [ ] Sincronización en cloud
- [ ] Multi-device support

### Fase 3: Social Features (3-4 meses)
- [ ] Compartir grupos por enlace
- [ ] Invitaciones por email/QR
- [ ] Notificaciones
- [ ] Comentarios en gastos
- [ ] Perfiles de usuario

### Fase 4: Inteligencia (4-6 meses)
- [ ] OCR para facturas
- [ ] Reconocimiento de moneda
- [ ] Sugerencias automáticas
- [ ] Análisis de gastos
- [ ] Predicciones

### Fase 5: Extensiones (6+ meses)
- [ ] App móvil (React Native)
- [ ] Integración bancaria
- [ ] Pagos integrados
- [ ] Marketplace de categorías
- [ ] Webhooks

---

## 13. CONSIDERACIONES DE DISEÑO

### 13.1 Paleta de Colores

**Tema Principal:**
- Primario: #4F46E5 (Indigo)
- Secundario: #10B981 (Emerald)
- Acento: #F59E0B (Amber)
- Éxito: #10B981
- Error: #EF4444
- Advertencia: #F59E0B
- Info: #3B82F6

**Escala de Grises:**
- 50: #F9FAFB
- 100: #F3F4F6
- 500: #6B7280
- 900: #111827

### 13.2 Tipografía

- **Títulos**: Nunito (bold, sizes: 24px, 20px, 18px)
- **Body**: Mulish (regular, 16px)
- **Small**: Mulish (regular, 14px)
- **Labels**: Mulish (medium, 12px)

### 13.3 Componentes Visuales

**Buttons:**
- Primary (Indigo)
- Secondary (Gray)
- Danger (Red)
- Sizes: sm, md, lg

**Cards:**
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Radius: 8px
- Padding: 16px

**Inputs:**
- Radius: 6px
- Border: 1px solid #E5E7EB
- Focus: Indigo outline

---

## 14. RESTRICCIONES Y LIMITACIONES

### Limitaciones Técnicas
- Almacenamiento limitado a capacidad de localStorage (~5-10MB)
- Sin sincronización en tiempo real (local-first)
- Sin autenticación actual (datos públicos en navegador)

### Limitaciones de Funcionalidad
- No soporta múltiples divisas
- Cálculos en una sola moneda (COP)
- Sin historial de cambios (futuro)
- Sin pagos integrados (futuro)

### Consideraciones de Seguridad
- ⚠️ Datos no encriptados en localStorage
- ⚠️ Sin autenticación de usuario
- ⚠️ Accesible a cualquiera con acceso al navegador
- ⚠️ Sin validación de servidor (futuro)

---

## 15. TÉRMINOS Y DEFINICIONES

| Término | Definición |
|---------|-----------|
| **Grupo** | Colección de personas que comparten gastos |
| **Gasto** | Transacción registrada entre participantes |
| **Deuda** | Monto que una persona debe a otra |
| **Participante** | Persona que es parte de un gasto |
| **Pagador** | Persona que originalmente pagó un gasto |
| **Split** | División del monto entre participantes |
| **Balance** | Diferencia entre lo que alguien pagó vs. debe |
| **Liquidación** | Proceso de pagar deudas pendientes |

---

## 16. REFERENCIAS Y DOCUMENTACIÓN

### Documento Relacionados
- ARCHITECTURE.md (en desarrollo)
- CONTRIBUTING.md (en desarrollo)
- API_SPEC.md (futuro)
- USER_GUIDE.md (futuro)

### Herramientas Utilizadas
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Recharts Docs](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [date-fns](https://date-fns.org/)

---

## 17. APROBACIONES Y SIGN-OFF

| Rol | Nombre | Fecha | Firma |
|-----|--------|-------|-------|
| Product Owner | - | - | - |
| Tech Lead | - | - | - |
| Designer | - | - | - |

---

## 18. HISTORIAL DE CAMBIOS

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-04-09 | Documento inicial - MVP completo |
| 0.9 | 2026-03-15 | Borrador del PRD |

---

**Documento Confidencial**  
*Última actualización: 2026-04-09*
