# Sistema de Gestión de Inventario con Captura Móvil

## Descripción General

Este sistema proporciona una solución completa para la gestión de inventario con capacidades de captura móvil, diseñado específicamente para personal de almacén, tienda y campo. El sistema implementa un flujo optimizado que incluye:

- **Snapshots de inventario** para establecer líneas base
- **Captura móvil en tiempo real** con sincronización
- **Gestión administrativa** desde portal web
- **Reconciliación automática** con trazabilidad completa
- **Reportes y analytics** avanzados

## Arquitectura del Sistema

### Componentes Principales

1. **Common (Núcleo)**

   - DTOs compartidos
   - Servicio base de inventario
   - Configuración de Entity Framework

2. **Consumo.Api (Móvil)**

   - Controlador optimizado para dispositivos móviles
   - Servicio especializado para operaciones de campo
   - Sincronización offline/online

3. **Portal.Api (Administración)**
   - Controlador para gestión administrativa
   - Servicio con capacidades avanzadas de análisis
   - Dashboard de control y reportes

### Estructura de Tablas (Español)

```sql
-- Snapshots del inventario
InventarioSnapshot
InventarioSnapshotDetalle

-- Sesiones de conteo
InventarioConteo
InventarioConteoDetalle

-- Reconciliación y ajustes
InventarioReconciliacion
InventarioReconciliacionDetalle

-- Sistema de Stock Moderno
ProductoStocks (reemplaza campos legacy existenciaAlmacen1-7)
```

**💡 Migración de Stock:** El sistema utiliza la tabla moderna `ProductoStocks` con soporte multi-localidad, manteniendo compatibilidad hacia atrás con campos legacy mediante helper methods en `ProductoDTO`.

## Flujo de Trabajo

### 1. Planificación (Portal)

```
Administrador → Planifica Conteo → Crea Snapshot → Asigna Personal
```

### 2. Ejecución (Móvil)

```
Personal → Inicia Sesión → Cuenta Productos → Sincroniza → Completa
```

### 3. Reconciliación (Portal)

```
Supervisor → Revisa Discrepancias → Aprueba Ajustes → Aplica Cambios
```

## APIs Disponibles

### Consumo.Api (Móvil)

#### Endpoints Principales

- `GET /consumo/inventariomovil/conteos-activos/{localidadId}`
- `GET /consumo/inventariomovil/conteo-activo/{localidadId}`
- `GET /consumo/inventariomovil/conteo/{conteoId}/productos`
- `POST /consumo/inventariomovil/contar-producto`
- `POST /consumo/inventariomovil/sincronizar-conteo/{conteoId}`
- `GET /consumo/inventariomovil/conteo/{conteoId}/resumen`

#### Endpoints para Código de Barras 📱

- `GET /consumo/inventariomovil/buscar-por-codigo-barra/{codigoBarra}/localidad/{localidadId}`
- `GET /consumo/inventariomovil/validar-codigo-barra/{codigoBarra}/localidad/{localidadId}`
- `POST /consumo/inventariomovil/contar-por-codigo-barra`

#### Ejemplo de Uso - Contar Producto

```json
POST /consumo/inventariomovil/contar-producto
{
  "ConteoId": 123,
  "CodigoProducto": "PROD001",
  "CantidadContada": 45.5,
  "ContadoPor": "juan.perez",
  "DispositivoId": "TABLET_001",
  "Observaciones": "Producto en buen estado",
  "Latitud": 18.4861,
  "Longitud": -69.9312
}
```

#### Ejemplo de Uso - Contar por Código de Barras 🔧

```json
POST /consumo/inventariomovil/contar-por-codigo-barra
{
  "ConteoId": 123,
  "CodigoBarra": "7890123456789",
  "LocalidadId": 1,
  "CantidadContada": 45.5,
  "ContadoPor": "juan.perez",
  "DispositivoId": "SCANNER_001",
  "Observaciones": "Escaneado con pistola láser",
  "Latitud": 18.4861,
  "Longitud": -69.9312
}
```

### Portal.Api (Administración)

#### Endpoints Principales

- `POST /portal/inventario/snapshot`
- `POST /portal/inventario/conteo/planificar`
- `POST /portal/inventario/conteo/{conteoId}/iniciar`
- `GET /portal/inventario/conteo/{conteoId}/analytics`
- `POST /portal/inventario/conteo/{conteoId}/reconciliar`
- `GET /portal/inventario/reconciliacion/{reconciliacionId}/resumen`

#### Ejemplo de Uso - Planificar Conteo

```json
POST /portal/inventario/conteo/planificar
{
  "TipoConteo": "ConteoCompleto",
  "LocalidadId": 1,
  "FechaInicio": "2025-08-01T08:00:00Z",
  "Descripcion": "Conteo mensual agosto 2025",
  "PlanificadoPor": "admin.usuario",
  "CrearSnapshot": true,
  "Observaciones": "Incluir todas las áreas del almacén"
}
```

## Estados del Sistema

### Estados de Inventario

- **Planificado**: Conteo creado pero no iniciado
- **EnProgreso**: Personal realizando conteos
- **Completado**: Conteo finalizado, pendiente reconciliación
- **Reconciliado**: Ajustes aplicados al sistema
- **Cancelado**: Conteo cancelado

### Estados de Conteo Detalle

- **Pendiente**: Producto no contado
- **Contado**: Producto contado sin discrepancias
- **Verificado**: Producto recontado/verificado
- **Discrepancia**: Diferencias encontradas

## Características Técnicas

### Optimizaciones para Móvil

- Endpoints optimizados para conexiones lentas
- Sincronización por lotes
- Caching local de datos frecuentes
- Validación en tiempo real
- Captura de geolocalización
- **Soporte completo para código de barras 📱**
  - Validación de códigos de barras en tiempo real
  - Búsqueda de productos por barcode
  - Integración con scanners móviles y pistolas láser
  - Fallback automático a código de producto

### Seguridad y Trazabilidad

- Autenticación por tenant (multiempresa)
- Trazabilidad completa de acciones
- Registro de dispositivos móviles
- Timestamps UTC para consistencia global
- Logs detallados de operaciones

### Analytics y Reportes

- Estadísticas en tiempo real
- Reportes de discrepancias
- Análisis de productividad por usuario
- Métricas de exactitud y velocidad
- Dashboards interactivos

## Configuración e Instalación

### 1. Base de Datos

```csharp
// Las tablas se crean automáticamente via Entity Framework migrations
// Configuración incluida en AppDbContext.cs
```

### 2. Servicios (Program.cs)

```csharp
// Portal.Api
builder.Services.AddScoped<IProductoStockService, ProductoStockService>();
builder.Services.AddScoped<IInventarioService, InventarioService>();
builder.Services.AddScoped<IInventarioPortalService, InventarioPortalService>();

// Consumo.Api
builder.Services.AddScoped<IProductoStockService, ProductoStockService>();
builder.Services.AddScoped<IInventarioService, InventarioService>();
builder.Services.AddScoped<IInventarioMovilService, InventarioMovilService>();
```

### 3. Permisos y Roles

- **Administrador**: Planificación, reconciliación, reportes
- **Supervisor**: Revisión, aprobación de ajustes
- **Operario**: Captura móvil, consulta de estado

## Casos de Uso Típicos

### Conteo Completo Mensual

1. Admin planifica conteo con snapshot
2. Personal recibe notificación
3. Operarios usan tablets para contar
4. Sistema detecta discrepancias automáticamente
5. Supervisor revisa y aprueba ajustes
6. Cambios se aplican al inventario

### Conteo Cíclico Semanal

1. Sistema sugiere productos por contar
2. Conteo focalizado en productos específicos
3. Comparación con snapshot reciente
4. Ajustes menores automáticos

### Auditoría Externa

1. Snapshot completo del inventario
2. Conteo independiente por auditores
3. Reporte de discrepancias detallado
4. Proceso de reconciliación documentado

## Mejores Prácticas

### Para Administradores

- Crear snapshots antes de conteos importantes
- Revisar patrones de discrepancias
- Capacitar personal en uso de dispositivos móviles
- Programar conteos durante horarios de menor actividad

### Para Personal de Campo

- Sincronizar dispositivos antes de iniciar
- Verificar códigos de productos dudosos
- Documentar observaciones detalladas
- Reportar problemas técnicos inmediatamente

### Para Desarrollo

- Implementar validaciones robustas
- Monitorear rendimiento de sincronización
- Mantener logs detallados para debugging
- Realizar pruebas con volúmenes reales

## Métricas y Monitoreo

### KPIs Clave

- Tiempo promedio de conteo por producto
- Tasa de exactitud por operario
- Frecuencia de discrepancias por categoría
- Velocidad de sincronización móvil

### Alertas Automáticas

- Discrepancias superiores al 10%
- Conteos sin actividad por más de 2 horas
- Fallos de sincronización repetidos
- Dispositivos desconectados

## Roadmap Futuro

### Versión 2.0

- [x] **Integración con lectores de código de barras** ✅ IMPLEMENTADO
  - Soporte completo para scanners móviles y pistolas láser
  - Endpoints específicos para búsqueda y validación por código de barras
  - API optimizada: `/contar-por-codigo-barra`
  - Validación en tiempo real de códigos de barras
  - Integración transparente con el flujo de conteo existente
- [ ] Soporte offline completo
- [ ] ML para predicción de discrepancias
- [ ] Integración con sistemas de WMS

### Versión 3.0

- [ ] App móvil nativa
- [ ] Captura por voz
- [ ] Realidad aumentada para ubicación
- [ ] Blockchain para auditoría inmutable

## Soporte y Contacto

Para soporte técnico o consultas sobre implementación, contactar al equipo de desarrollo.

**Documentación técnica**: Ver comentarios en código fuente  
**API Documentation**: Swagger UI disponible en endpoints /swagger  
**Testing**: Suite de pruebas unitarias en MSeller.UnitTests  
**📖 Guía Paso a Paso**: [Tutorial completo con ejemplos prácticos](./INVENTORY_MANAGEMENT_STEP_BY_STEP_GUIDE.md)
