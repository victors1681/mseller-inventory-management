# Guía Paso a Paso: Sistema de Gestión de Inventario con Captura Móvil

## 📋 Índice

1. [Configuración Inicial](#configuración-inicial)
2. [Escenario Completo: Conteo Mensual](#escenario-completo-conteo-mensual)
3. [Escenario Móvil: Uso con Código de Barras](#escenario-móvil-uso-con-código-de-barras)
4. [Escenario Avanzado: Reconciliación de Discrepancias](#escenario-avanzado-reconciliación-de-discrepancias)
5. [Casos de Uso Comunes](#casos-de-uso-comunes)
6. [Optimizaciones del Sistema (Agosto 2025)](#optimizaciones-del-sistema-agosto-2025)
7. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Optimizaciones del Sistema (Agosto 2025)

### ✅ Mejoras Implementadas

**1. Eliminación del Sistema Duplicado basado en Rutas**

- Removido `InventarioSistematicoService.cs` (funcionalidad duplicada)
- Removido `InventarioSistematicoController.cs` (endpoints duplicados)
- Removido `InventarioRutaDTO.cs` (reemplazado por enfoque de zonas)

**2. Simplificación de Campos de Ubicación**

- Eliminados campos individuales: `Pasillo`, `Estante`, `Nivel`
- Simplificado a campos esenciales: `Zona`, `Ubicacion`, `UbicacionDetallada`
- Removidos métodos helper complejos: `GenerarUbicacionCombinada`, `ParsearUbicacion`

**3. Optimización del Sistema de Zonas**

- Removido campo `Prioridad` innecesario de `InventarioZonaDTO`
- Enfoque unificado basado en zonas sin complejidad de rutas
- Todas las funcionalidades core preservadas

**4. Impacto de las Optimizaciones**

- **Reducción de código**: 800+ líneas de código duplicado eliminadas
- **DTOs simplificados**: 6 campos redundantes eliminados
- **Build exitoso**: Sin errores de compilación
- **Funcionalidad preservada**: Todas las características principales mantenidas

### 🏆 Resultado Final

- Sistema más limpio y mantenible
- Enfoque unificado basado en zonas
- Compatibilidad hacia atrás preservada
- Jerarquía de almacén clara (Localidad vs. ubicación física)

---

## 🎯 Sistema de Conteo Sistemático

### ¿Cómo funciona el conteo sistemático para evitar productos perdidos?

**1. Secuencia Garantizada** 🔢

- Cada zona tiene productos ordenados por `Ubicacion` y `codigo`
- Sistema asigna secuencia numerada: 1, 2, 3, 4...
- **Imposible saltarse productos** - cada operario debe completar secuencia

**2. Ubicación Específica** 📍

- Cada producto tiene ubicación exacta: "Zona A, Ubicación B2-N1"
- Operario recibe ubicación precisa para encontrar producto
- No hay confusión sobre dónde buscar

**3. Progreso Visual** 📊

- "Producto 15 de 85" - operario sabe exactamente su avance
- Porcentaje de completitud en tiempo real
- Supervisor monitorea progreso por zona

**4. Flujo Automático** ⚡

- Al completar producto → sistema automáticamente muestra siguiente
- Sin pasos manuales para "buscar siguiente producto"
- Flujo natural: Contar → Ver siguiente → Contar → Ver siguiente

**5. Garantía de Cobertura 100%** ✅

- Sistema marca cada producto como "Completado"
- Zona no se puede cerrar hasta completar todos los productos
- **Resultado: CERO productos perdidos en el conteo**

### Ejemplo Práctico del Flujo Sistemático

```
Operario inicia Zona A (85 productos):

Paso 1: Sistema muestra "Producto 1 de 85: Laptop Dell en Zona A, Ubicación B2-N1"
Paso 2: Operario va a B2-N1, cuenta laptops, registra resultado
Paso 3: Sistema automáticamente muestra "Producto 2 de 85: Mouse en Zona A, Ubicación B3-N1"
Paso 4: Operario va a B3-N1, cuenta mouse, registra resultado
...
Paso 85: "Producto 85 de 85: Cable HDMI en Zona A, Ubicación F10-N3"
Final: "✅ Zona A completada - 85/85 productos contados"
```

**Ventaja clave:** El sistema guía paso a paso - operario nunca tiene que "decidir" cuál producto contar siguiente.

---

## 🚀 Configuración Inicial

### Paso 0: Verificar Prerrequisitos

**Datos necesarios:**

- Una localidad activa (ej: Almacén Principal, ID: 1)
- Productos con stock en el sistema usando la nueva tabla `ProductoStocks`
- Usuarios asignados con roles apropiados

**⚡ Nota Importante: Migración de Sistema de Stock**

Este sistema utiliza la nueva tabla `ProductoStocks` en lugar de los campos legacy `existenciaAlmacen1-7`. La API mantiene compatibilidad hacia atrás mediante helper methods en `ProductoDTO`:

- `GetStockForWarehouse(localidadId)` - Obtiene stock por localidad
- `SetStockForWarehouse(localidadId, cantidad)` - Actualiza stock por localidad
- `SyncLegacyStockFields()` - Sincroniza campos legacy con nueva tabla

**🏢 Diferencia entre Localidad y Ubicación Física:**

- **Localidad (LocalidadId):** El almacén completo (ej: "Almacén Principal", "Sucursal Norte")
- **Ubicación Física:** Posición específica DENTRO del almacén (ej: "Zona A, Pasillo 1, Estante B, Nivel 2")

**Jerarquía completa:**

```
Almacén Principal (LocalidadId=1)
├── Zona A
│   ├── Pasillo 1
│   │   ├── Estante B → Nivel 2 → PROD001 (25 unidades)
│   │   └── Estante C → Nivel 1 → PROD002 (150 unidades)
│   └── Pasillo 2
└── Zona B
```

**Verificar productos existentes:**

```http
GET /api/productos?localidadId=1
```

**Respuesta esperada:**

```json
[
  {
    "codigo": "PROD001",
    "codigoBarra": "7890123456789",
    "nombre": "Laptop Dell Inspiron",
    "existencias": [
      {
        "localidadId": 1,
        "existencia": 25.0,
        "ultimaActualizacion": "2025-08-01T07:30:00Z"
      }
    ],
    "zona": "A",
    "pasillo": "1",
    "estante": "B",
    "nivel": "2",
    "ubicacion": "A-1-B-2",
    "ubicacionDetallada": "Zona A, Pasillo 1, Estante B, Nivel 2"
  },
  {
    "codigo": "PROD002",
    "codigoBarra": "7890123456790",
    "nombre": "Mouse Inalámbrico",
    "existencias": [
      {
        "localidadId": 1,
        "existencia": 150.0,
        "ultimaActualizacion": "2025-08-01T07:30:00Z"
      }
    ]
  }
]
```

---

## 📊 Escenario Completo: Conteo Mensual

### Paso 1: Crear Snapshot (Portal Web - Administrador)

**Objetivo:** Establecer línea base antes del conteo

```http
POST /portal/inventario/snapshot
Content-Type: application/json

{
  "LocalidadId": 1,
  "Descripcion": "Snapshot mensual Agosto 2025 - Almacén Principal",
  "CreadoPor": "admin.sistema"
}
```

**Respuesta:**

```json
{
  "id": 101,
  "codigoSnapshot": "SNAP-2025-08-001",
  "localidadId": 1,
  "descripcion": "Snapshot mensual Agosto 2025 - Almacén Principal",
  "fechaCreacion": "2025-08-01T08:00:00Z",
  "creadoPor": "admin.sistema",
  "totalProductos": 250,
  "valorTotal": 125000.5,
  "detalles": [
    {
      "codigoProducto": "PROD001",
      "cantidadSistema": 25.0,
      "valorUnitario": 850.0
    },
    {
      "codigoProducto": "PROD002",
      "cantidadSistema": 150.0,
      "valorUnitario": 35.0
    }
  ]
}
```

### Paso 2: Planificar Conteo (Portal Web - Administrador)

**Objetivo:** Programar sesión de conteo basada en el snapshot

```http
POST /portal/inventario/conteo/planificar
Content-Type: application/json

{
  "TipoConteo": "ConteoCompleto",
  "LocalidadId": 1,
  "SnapshotId": 101,
  "FechaInicio": "2025-08-01T09:00:00Z",
  "FechaLimite": "2025-08-01T17:00:00Z",
  "Descripcion": "Conteo mensual agosto 2025",
  "PlanificadoPor": "admin.sistema",
  "CrearSnapshot": false,
  "Observaciones": "Incluir todas las áreas del almacén"
}
```

**Respuesta:**

```json
{
  "id": 201,
  "codigoConteo": "CNT-2025-08-001",
  "tipoConteo": "ConteoCompleto",
  "estado": "Planificado",
  "localidadId": 1,
  "snapshotId": 101,
  "fechaInicio": "2025-08-01T09:00:00Z",
  "fechaLimite": "2025-08-01T17:00:00Z",
  "planificadoPor": "admin.sistema",
  "inventarioSnapshot": {
    "codigoSnapshot": "SNAP-2025-08-001",
    "totalProductos": 250
  }
}
```

### Paso 3: Iniciar Conteo (Portal Web - Supervisor)

**Objetivo:** Activar la sesión para que el personal móvil pueda comenzar

```http
POST /portal/inventario/conteo/201/iniciar
Content-Type: application/json

{
  "Usuario": "supervisor.almacen"
}
```

**Respuesta:**

```json
{
  "id": 201,
  "codigoConteo": "CNT-2025-08-001",
  "estado": "EnProgreso",
  "fechaInicio": "2025-08-01T09:15:00Z",
  "iniciadoPor": "supervisor.almacen"
}
```

---

## 📱 Escenario Móvil: Uso con Código de Barras

### Paso 4: Verificar Conteos Activos (Dispositivo Móvil)

**Objetivo:** El operario verifica qué conteos puede realizar

```http
GET /consumo/inventariomovil/conteos-activos/1
```

**Respuesta:**

```json
[
  {
    "id": 201,
    "codigoConteo": "CNT-2025-08-001",
    "estado": "EnProgreso",
    "descripcion": "Conteo mensual agosto 2025",
    "fechaInicio": "2025-08-01T09:15:00Z",
    "fechaLimite": "2025-08-01T17:00:00Z"
  }
]
```

### Paso 5A: Contar Producto por Código (Método Manual)

**Objetivo:** Contar producto ingresando código manualmente

```http
POST /consumo/inventariomovil/contar-producto
Content-Type: application/json

{
  "ConteoId": 201,
  "CodigoProducto": "PROD001",
  "CantidadContada": 24.0,
  "ContadoPor": "operario.juan",
  "DispositivoId": "TABLET_001",
  "Observaciones": "Falta 1 unidad, posible venta no registrada",
  "Latitud": 18.4861,
  "Longitud": -69.9312
}
```

### Paso 5B: Contar Producto por Código de Barras (Método Scanner) 🔧

**Objetivo:** Contar producto escaneando código de barras

**Primero, validar el código de barras:**

```http
GET /consumo/inventariomovil/validar-codigo-barra/7890123456790/localidad/1
```

**Respuesta:**

```json
{
  "esValido": true,
  "codigoBarra": "7890123456790"
}
```

**Buscar información del producto:**

```http
GET /consumo/inventariomovil/buscar-por-codigo-barra/7890123456790/localidad/1
```

**Respuesta:**

```json
{
  "codigo": "PROD002",
  "codigoBarra": "7890123456790",
  "nombre": "Mouse Inalámbrico",
  "descripcion": "Mouse óptico inalámbrico USB",
  "precio1": 35.0,
  "existencias": [
    {
      "localidadId": 1,
      "existencia": 150.0,
      "ultimaActualizacion": "2025-08-01T07:30:00Z"
    }
  ],
  "zona": "A",
  "pasillo": "2",
  "estante": "C",
  "nivel": "1",
  "ubicacion": "A-2-C-1",
  "ubicacionDetallada": "Zona A, Pasillo 2, Estante C, Nivel 1"
}
```

**Contar usando código de barras:**

```http
POST /consumo/inventariomovil/contar-por-codigo-barra
Content-Type: application/json

{
  "ConteoId": 201,
  "CodigoBarra": "7890123456790",
  "LocalidadId": 1,
  "CantidadContada": 148.0,
  "ContadoPor": "operario.juan",
  "DispositivoId": "SCANNER_001",
  "Observaciones": "Escaneado con pistola láser - 2 unidades faltantes",
  "Latitud": 18.4861,
  "Longitud": -69.9312
}
```

**Respuesta de ambos métodos:**

```json
{
  "id": 301,
  "conteoId": 201,
  "codigoProducto": "PROD002",
  "cantidadContada": 148.0,
  "cantidadSistema": 150.0,
  "diferencia": -2.0,
  "estado": "Discrepancia",
  "fechaConteo": "2025-08-01T10:30:00Z",
  "contadoPor": "operario.juan",
  "observaciones": "Escaneado con pistola láser - 2 unidades faltantes",
  "dispositivoId": "SCANNER_001",
  "producto": {
    "codigo": "PROD002",
    "nombre": "Mouse Inalámbrico"
  }
}
```

### Paso 6: Sincronizar Múltiples Conteos (Modo Batch)

**Objetivo:** Enviar varios conteos realizados offline

```http
POST /consumo/inventariomovil/sincronizar-conteo/201
Content-Type: application/json

[
  {
    "ConteoId": 201,
    "CodigoProducto": "PROD003",
    "CantidadContada": 75.0,
    "ContadoPor": "operario.juan",
    "DispositivoId": "TABLET_001"
  },
  {
    "ConteoId": 201,
    "CodigoProducto": "PROD004",
    "CantidadContada": 32.0,
    "ContadoPor": "operario.juan",
    "DispositivoId": "TABLET_001"
  }
]
```

**Respuesta:**

```json
true
```

### Paso 7: Verificar Progreso (Dispositivo Móvil)

**Objetivo:** Ver resumen del progreso actual

```http
GET /consumo/inventariomovil/conteo/201/resumen
```

**Respuesta:**

```json
{
  "conteoId": 201,
  "codigoConteo": "CNT-2025-08-001",
  "estado": "EnProgreso",
  "totalProductosContados": 4,
  "productosPendientes": 246,
  "discrepanciasEncontradas": 2,
  "porcentajeCompletado": 1.6,
  "ultimaActualizacion": "2025-08-01T10:30:00Z"
}
```

---

## � Escenario Avanzado: Conteo Sistemático por Zonas

### Paso 7A: Generar Zonas de Conteo (Portal Web - Administrador)

**Objetivo:** Organizar el conteo por zonas físicas del almacén para optimizar el recorrido

```http
POST /api/inventariozonas/generar-zonas/201
Content-Type: application/json

{
  "usuarios": ["operario.juan", "operario.maria", "operario.carlos"]
}
```

**Respuesta:**

```json
[
  {
    "id": 301,
    "conteoId": 201,
    "nombreZona": "Zona A",
    "codigoZona": "A",
    "usuarioAsignado": "operario.juan",
    "descripcion": "Zona: A",
    "totalProductos": 85,
    "tiempoEstimado": 127,
    "estado": "Asignada"
  },
  {
    "id": 302,
    "conteoId": 201,
    "nombreZona": "Zona B",
    "codigoZona": "B",
    "usuarioAsignado": "operario.maria",
    "descripcion": "Zona: B",
    "totalProductos": 92,
    "tiempoEstimado": 138,
    "estado": "Asignada"
  },
  {
    "id": 303,
    "conteoId": 201,
    "nombreZona": "Zona C",
    "codigoZona": "C",
    "usuarioAsignado": "operario.carlos",
    "descripcion": "Zona: C",
    "totalProductos": 73,
    "tiempoEstimado": 109,
    "estado": "Asignada"
  }
]
```

### Paso 7B: Obtener Mi Zona Asignada (Dispositivo Móvil)

**Objetivo:** El operario consulta su zona de trabajo asignada

```http
GET /api/inventariozonas/mi-zona/201
```

**Respuesta:**

```json
{
  "id": 301,
  "nombreZona": "Zona A",
  "codigoZona": "A",
  "descripcion": "Zona: A",
  "totalProductos": 85,
  "productosCompletados": 0,
  "estado": "Asignada",
  "tiempoEstimado": 127,
  "mensaje": "Tienes 85 productos asignados en Zona A. ¡Comienza cuando estés listo!"
}
```

### Paso 7C: Obtener Siguiente Producto en Zona (Dispositivo Móvil) ⭐

**Objetivo:** El sistema guía al operario por la secuencia óptima - **EVITA PRODUCTOS PERDIDOS**

```http
GET /api/inventariozonas/siguiente-producto-zona/301
```

**¿Cómo funciona la secuencia?**

1. **Ordenamiento inteligente** por `Ubicacion` y `codigo` del producto
2. **Secuencia numerada** (1, 2, 3...) para seguimiento claro
3. **Ubicación específica** para encontrar el producto rápidamente
4. **Estado de progreso** para saber cuántos faltan

**Respuesta:**

```json
{
  "zonaCompletada": false,
  "asignacion": {
    "id": 501,
    "codigoProducto": "PROD001",
    "secuencia": 1,
    "ubicacionEspecifica": "Zona A, Ubicación B2-N1"
  },
  "producto": {
    "codigo": "PROD001",
    "nombre": "Laptop Dell Inspiron",
    "codigoBarra": "7890123456789",
    "existencias": [
      {
        "localidadId": 1,
        "existencia": 25.0
      }
    ]
  },
  "ubicacionSugerida": "Zona A, Ubicación B2-N1",
  "mensaje": "Producto 1 de 85: Laptop Dell Inspiron en Zona A, Ubicación B2-N1",
  "progreso": {
    "completados": 0,
    "totales": 85,
    "porcentaje": 0.0
  }
}
```

### Paso 7D: Contar Producto en Zona (Dispositivo Móvil) ⚡

**Objetivo:** Registrar conteo con ubicación específica - **AVANCE AUTOMÁTICO AL SIGUIENTE**

```http
POST /api/inventariozonas/contar-producto-zona
Content-Type: application/json

{
  "conteoId": 201,
  "asignacionId": 501,
  "codigoProducto": "PROD001",
  "cantidadContada": 24.0,
  "observaciones": "Falta 1 unidad",
  "esCodigoBarra": true
}
```

**Respuesta con Secuencia Automática:**

```json
{
  "productoContado": true,
  "conteoRegistrado": true,
  "zonaCompletada": false,
  "siguienteAsignacion": {
    "id": 502,
    "codigoProducto": "PROD002",
    "secuencia": 2,
    "ubicacionEspecifica": "Zona A, Ubicación B3-N1"
  },
  "siguienteProducto": {
    "codigo": "PROD002",
    "nombre": "Mouse Inalámbrico",
    "codigoBarra": "7890123456790"
  },
  "siguienteUbicacion": "Zona A, Ubicación B3-N1",
  "mensaje": "✅ Producto 1 completado. 📍 Siguiente: Producto 2 de 85 en Zona A, Ubicación B3-N1",
  "progreso": {
    "completados": 1,
    "totales": 85,
    "porcentaje": 1.18
  }
}
```

**🎯 Ventajas del conteo sistemático:**

- **Imposible saltarse productos** - secuencia garantizada 1→2→3...
- **Ubicación exacta** para cada producto siguiente
- **Progreso visual** en tiempo real
- **Sin duplicados** - cada producto se cuenta una sola vez

````

### Paso 7E: Ver Progreso por Zonas (Portal Web - Supervisor) 📊

**Objetivo:** Monitorear el avance del conteo sistemático por zona en tiempo real

```http
GET /api/inventariozonas/progreso-zonas/201
````

**Respuesta con Estado de Conteo Sistemático:**

```json
{
  "totalZonas": 3,
  "zonasCompletadas": 1,
  "totalProductos": 250,
  "productosContados": 165,
  "porcentajeAvance": 66.0,
  "zonasPorEstado": {
    "Completada": 1,
    "EnProgreso": 2,
    "Asignada": 0
  },
  "detalleZonas": [
    {
      "nombreZona": "Zona A",
      "codigoZona": "A",
      "usuarioAsignado": "operario.juan",
      "estado": "Completada",
      "progreso": 100.0,
      "tiempoEstimado": 127,
      "fechaInicio": "2025-08-01T10:00:00Z",
      "fechaFinalizacion": "2025-08-01T12:05:00Z",
      "secuenciaCompletada": "✅ 85/85 productos contados en orden secuencial"
    },
    {
      "nombreZona": "Zona B",
      "codigoZona": "B",
      "usuarioAsignado": "operario.maria",
      "estado": "EnProgreso",
      "progreso": 75.0,
      "tiempoEstimado": 138,
      "fechaInicio": "2025-08-01T10:15:00Z",
      "fechaFinalizacion": null,
      "secuenciaActual": "⏳ Producto 63 de 84 - siguiendo secuencia sistemática"
    },
    {
      "nombreZona": "Zona C",
      "codigoZona": "C",
      "usuarioAsignado": "operario.carlos",
      "estado": "EnProgreso",
      "progreso": 42.5,
      "tiempoEstimado": "01:49:30",
      "fechaInicio": "2025-08-01T10:30:00Z",
      "fechaFinalizacion": null
    }
  ]
}
```

---

## �🔍 Escenario Avanzado: Reconciliación de Discrepancias

### Paso 8: Completar Conteo (Portal Web - Supervisor)

**Objetivo:** Finalizar la sesión de conteo cuando esté completa

```http
POST /portal/inventario/conteo/201/completar
Content-Type: application/json

{
  "Usuario": "supervisor.almacen"
}
```

**Respuesta:**

```json
{
  "id": 201,
  "estado": "Completado",
  "fechaFinalizacion": "2025-08-01T16:45:00Z",
  "completadoPor": "supervisor.almacen",
  "estadisticas": {
    "totalProductosContados": 250,
    "discrepanciasEncontradas": 15,
    "valorTotalDiscrepancias": 2450.75
  }
}
```

### Paso 9: Ver Analytics del Conteo (Portal Web)

**Objetivo:** Analizar resultados antes de la reconciliación

```http
GET /portal/inventario/conteo/201/analytics
```

**Respuesta:**

```json
{
  "conteoId": 201,
  "resumenGeneral": {
    "totalProductos": 250,
    "productosContados": 250,
    "discrepanciasEncontradas": 15,
    "porcentajeExactitud": 94.0
  },
  "discrepanciasPorTipo": {
    "faltantes": 8,
    "sobrantes": 7
  },
  "valorMonetario": {
    "valorTotalInventario": 125000.5,
    "valorDiscrepancias": -2450.75,
    "impactoFinanciero": -1.96
  },
  "productividad": {
    "tiempoTotalHoras": 7.5,
    "productosContadosPorHora": 33.3,
    "operariosParticipantes": 3
  }
}
```

### Paso 10: Ver Reporte de Discrepancias (Portal Web)

**Objetivo:** Revisar detalles de productos con diferencias

```http
GET /portal/inventario/conteo/201/reporte-discrepancias
```

**Respuesta:**

```json
[
  {
    "codigoProducto": "PROD001",
    "nombreProducto": "Laptop Dell Inspiron",
    "cantidadSistema": 25.0,
    "cantidadContada": 24.0,
    "diferencia": -1.0,
    "valorUnitario": 850.0,
    "impactoValor": -850.0,
    "contadoPor": "operario.juan",
    "observaciones": "Falta 1 unidad, posible venta no registrada"
  },
  {
    "codigoProducto": "PROD002",
    "nombreProducto": "Mouse Inalámbrico",
    "cantidadSistema": 150.0,
    "cantidadContada": 148.0,
    "diferencia": -2.0,
    "valorUnitario": 35.0,
    "impactoValor": -70.0,
    "contadoPor": "operario.juan",
    "observaciones": "Escaneado con pistola láser - 2 unidades faltantes"
  }
]
```

### Paso 11: Crear Reconciliación (Portal Web - Supervisor)

**Objetivo:** Generar propuesta de ajustes automática

```http
POST /portal/inventario/conteo/201/reconciliar
Content-Type: application/json

{
  "ReconciliadoPor": "supervisor.almacen",
  "Observaciones": "Revisión completa - ajustes menores por diferencias operacionales"
}
```

**Respuesta:**

```json
{
  "id": 401,
  "codigoReconciliacion": "REC-2025-08-001",
  "conteoId": 201,
  "estado": "Pendiente",
  "fechaCreacion": "2025-08-01T17:00:00Z",
  "reconciliadoPor": "supervisor.almacen",
  "ajustesCalculados": [
    {
      "codigoProducto": "PROD001",
      "ajusteCantidad": -1.0,
      "ajusteValor": -850.0
    },
    {
      "codigoProducto": "PROD002",
      "ajusteCantidad": -2.0,
      "ajusteValor": -70.0
    }
  ],
  "totalAjustes": 15,
  "valorTotalAjustes": -2450.75
}
```

### Paso 12: Ver Resumen de Reconciliación (Portal Web)

**Objetivo:** Revisar detalles antes de aprobar

```http
GET /portal/inventario/reconciliacion/401/resumen
```

**Respuesta:**

```json
{
  "reconciliacionId": 401,
  "codigoReconciliacion": "REC-2025-08-001",
  "estado": "Pendiente",
  "resumen": {
    "totalAjustes": 15,
    "ajustesPositivos": 7,
    "ajustesNegativos": 8,
    "valorTotalAjustes": -2450.75
  },
  "impactoFinanciero": {
    "inventarioActual": 125000.5,
    "inventarioAjustado": 122549.75,
    "diferenciaPorcentaje": -1.96
  },
  "requiereAprobacion": true,
  "observaciones": "Revisión completa - ajustes menores por diferencias operacionales"
}
```

### Paso 13: Aprobar Reconciliación (Portal Web - Gerente)

**Objetivo:** Aplicar los ajustes al inventario del sistema

```http
POST /portal/inventario/reconciliacion/401/aprobar
Content-Type: application/json

{
  "Usuario": "gerente.general"
}
```

**Respuesta:**

```json
true
```

**El sistema automáticamente:**

- ✅ Actualiza las existencias de productos
- ✅ Genera asientos contables
- ✅ Registra trazabilidad completa
- ✅ Envía notificaciones a stakeholders

---

## 📋 Casos de Uso Comunes

### Caso 1: Conteo Rápido de Producto Específico

**Escenario:** Verificar stock de un producto antes de una venta grande

```http
# 1. Crear snapshot focalizado
POST /portal/inventario/snapshot
{
  "LocalidadId": 1,
  "Descripcion": "Verificación rápida - PROD001",
  "CreadoPor": "vendedor.maria",
  "ProductosEspecificos": ["PROD001"]
}

# 2. Contar directamente con scanner
POST /consumo/inventariomovil/contar-por-codigo-barra
{
  "ConteoId": 202,
  "CodigoBarra": "7890123456789",
  "LocalidadId": 1,
  "CantidadContada": 23.0,
  "ContadoPor": "vendedor.maria"
}
```

### Caso 2: Conteo Cíclico Semanal

**Escenario:** Contar categoría específica cada semana

```http
# 1. Obtener productos sugeridos para conteo cíclico
GET /portal/inventario/productos-sugeridos?categoria=electrodomesticos&ultimosDias=7

# 2. Planificar conteo parcial
POST /portal/inventario/conteo/planificar
{
  "TipoConteo": "ConteoCiclico",
  "LocalidadId": 1,
  "Categoria": "electrodomesticos",
  "FechaInicio": "2025-08-07T14:00:00Z"
}
```

### Caso 3: Auditoría Externa

**Escenario:** Preparar datos para auditores externos

```http
# 1. Crear snapshot completo con detalles
POST /portal/inventario/snapshot
{
  "LocalidadId": 1,
  "Descripcion": "Snapshot para auditoría externa Q3-2025",
  "CreadoPor": "contador.principal",
  "IncluirDetallesValoracion": true,
  "IncluirHistorialMovimientos": true
}

# 2. Exportar datos para auditores
GET /portal/inventario/snapshot/103/exportar?formato=excel&incluirImagenes=true
```

---

## 🔧 Solución de Problemas

### Problema 1: Código de Barras No Reconocido

**Síntomas:**

```json
{
  "esValido": false,
  "codigoBarra": "1234567890123"
}
```

**Soluciones:**

1. Verificar que el producto esté registrado en el sistema
2. Confirmar que el campo `codigoBarra` no esté vacío
3. Usar búsqueda manual por código de producto como fallback

```http
# Fallback manual
GET /consumo/inventariomovil/conteo/201/productos?filtro=1234567890123
```

### Problema 2: Discrepancias Altas

**Síntomas:**

```json
{
  "porcentajeExactitud": 75.0,
  "discrepanciasEncontradas": 62
}
```

**Soluciones:**

1. Verificar procesos de conteo del personal
2. Revisar movimientos de inventario no registrados
3. Realizar segundo conteo de productos con discrepancias

```http
# Obtener productos para reconteo
GET /portal/inventario/conteo/201/productos-reconteo?umbralDiscrepancia=10
```

### Problema 3: Sincronización Fallida

**Síntomas:**

```http
POST /consumo/inventariomovil/sincronizar-conteo/201
Response: 500 Internal Server Error
```

**Soluciones:**

1. Verificar conectividad de red
2. Enviar conteos uno por uno
3. Verificar que el conteo esté en estado "EnProgreso"

```http
# Verificar estado del conteo
GET /consumo/inventariomovil/conteo-activo/1

# Enviar conteos individuales
POST /consumo/inventariomovil/contar-producto
{
  "ConteoId": 201,
  "CodigoProducto": "PROD001",
  "CantidadContada": 24.0,
  "ContadoPor": "operario.juan"
}
```

### Problema 4: Reconciliación Bloqueada

**Síntomas:**

```json
{
  "requiereAprobacion": true,
  "valorTotalAjustes": -25000.0,
  "estado": "RequiereAprobacionGerencial"
}
```

**Soluciones:**

1. Contactar gerencia para aprobación
2. Revisar y documentar causas de discrepancias
3. Considerar conteo adicional si las diferencias son muy altas

```http
# Obtener justificación detallada
GET /portal/inventario/reconciliacion/401/analisis-causas
```

---

## 📊 Métricas de Éxito

### KPIs a Monitorear

1. **Exactitud de Conteo:** > 95%
2. **Tiempo por Producto:** < 30 segundos
3. **Discrepancias Monetarias:** < 2% del valor total
4. **Tiempo de Reconciliación:** < 24 horas post-conteo

### Dashboard de Monitoreo

```http
GET /portal/inventario/dashboard/metricas?periodo=mesActual
```

**Respuesta esperada:**

```json
{
  "exactitudPromedio": 96.5,
  "tiempoPromedioConteo": 25.8,
  "discrepanciasMonetarias": 1.2,
  "reconciacionesCompletadas": 8,
  "reconciacionesPendientes": 1
}
```

---

## 🎯 Conclusión

Este sistema de inventario proporciona:

- ✅ **Trazabilidad completa** de todos los movimientos
- ✅ **Flexibilidad** para diferentes tipos de conteo
- ✅ **Optimización móvil** con soporte de código de barras
- ✅ **Reconciliación automática** con controles de aprobación
- ✅ **Analytics avanzados** para toma de decisiones

**Próximos Pasos:**

1. Implementar capacitación del personal
2. Configurar alertas automáticas
3. Integrar con sistemas contables existentes
4. Personalizar dashboards según necesidades

Para más información técnica, consultar el [README principal](./INVENTORY_MANAGEMENT_README.md) y la documentación de código fuente.
