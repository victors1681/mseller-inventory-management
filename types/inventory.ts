// Product interface for product search and details
export interface Product {
  codigo: string;
  codigoBarra: string;
  nombre: string;
  descripcion: string | null;
  area: string;
  iDArea: number;
  grupoId: string;
  departamento: string;
  ultCompra: string | null;
  precio1: number;
  precio2: number;
  precio3: number;
  precio4: number;
  precio5: number;
  costo: number;
  existenciaAlmacen1: number;
  existenciaAlmacen2: number;
  existenciaAlmacen3: number;
  existenciaAlmacen4: number;
  existenciaAlmacen5: number;
  existenciaAlmacen6: number;
  existenciaAlmacen7: number;
  unidad: string;
  empaque: string;
  impuesto: number;
  factor: number;
  iSC: number;
  aDV: number;
  descuento: number;
  tipoImpuesto: string;
  apartado: number;
  status: string;
  promocion: boolean;
  visibleTienda: boolean;
  esServicio: boolean;
  imagenes: any[];
  existencias: {
    id: number;
    codigoProducto: string;
    localidadId: number;
    existencia: number;
    ultimaActualizacion: string;
    businessId: string;
    localidadNombre: string;
  }[];
}
// New response type for contarProducto (matches backend response)
export interface ContarProductoResult {
  businessId: string;
  cantidadContada: number;
  cantidadSistema: number;
  cantidadSnapshot: number;
  codigoProducto: string;
  contadoPor: string;
  conteoId: number;
  diferencia: number;
  diferenciaSnapshot: number;
  dispositivoId: string;
  estado: number;
  estadoDescripcion: string;
  fechaConteo: string;
  fechaVerificacion: string | null;
  id: number;
  latitud: number | null;
  longitud: number | null;
  numeroVerificacion: number;
  observaciones: string | null;
  requiereVerificacion: boolean;
  tieneDiscrepancia: boolean;
  verificadoPor: string | null;
}
// Types for Inventory Management Mobile API Integration

export interface InventarioConteo {
  id: number;
  tipoConteo: TipoConteo;
  localidadId: number;
  fechaInicio: string;
  fechaFin?: string;
  descripcion: string;
  estado: EstadoConteo;
  planificadoPor: string;
  iniciadoPor?: string;
  completadoPor?: string;
  observaciones?: string;
  snapshotId?: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface InventarioConteoDetalle {
  id: number;
  conteoId: number;
  codigoProducto: string;
  nombreProducto: string;
  cantidadSnapshot?: number;
  cantidadContada?: number;
  cantidadFinal?: number;
  estado: EstadoConteoDetalle;
  contadoPor?: string;
  fechaConteo?: string;
  ubicacion?: string;
  zona?: string;
  ubicacionDetallada?: string;
  observaciones?: string;
  discrepancia: number;
  codigoBarra?: string;
  unidadMedida?: string;
  precio?: number;
}

export interface ProductoExistencia {
  id: number;
  codigoProducto: string;
  localidadId: number;
  existencia: number;
  ultimaActualizacion: string;
  businessId: string;
}

export interface ProductoConteo {
  codigo: string;
  codigoBarra: string;
  nombre: string;
  descripcion: string | null;
  area: string | null;
  iDArea: number | null;
  grupoId: string | null;
  zona: string | null;
  zonaId: number | null;
  zonaEntity: any | null;
  ubicacion: string | null;
  ubicacionDetallada: string | null;
  departamento: string | null;
  ultCompra: string | null;
  precio1: number;
  precio2: number;
  precio3: number;
  precio4: number;
  precio5: number;
  costo: number;
  existenciaAlmacen1: number;
  existenciaAlmacen2: number;
  existenciaAlmacen3: number;
  existenciaAlmacen4: number;
  existenciaAlmacen5: number;
  existenciaAlmacen6: number;
  existenciaAlmacen7: number;
  unidad: string | null;
  empaque: string | null;
  impuesto: number;
  factor: number;
  iSC: number;
  aDV: number;
  descuento: number;
  tipoImpuesto: string | null;
  apartado: number;
  status: string;
  promocion: boolean;
  businessId: string;
  esServicio: boolean;
  visibleTienda: boolean;
  imagenes: any[] | null;
  existencias: ProductoExistencia[] | null;
}

export interface ContarProductoRequest {
  conteoId: number;
  codigoProducto: string;
  cantidadContada: number;
  contadoPor: string;
  dispositivoId: string;
  observaciones?: string;
  latitud?: number;
  longitud?: number;
}

export interface ContarProductoPorCodigoBarraRequest {
  conteoId: number;
  codigoBarra: string;
  localidadId: number;
  cantidadContada: number;
  contadoPor: string;
  dispositivoId: string;
  observaciones?: string;
  latitud?: number;
  longitud?: number;
}

export interface SincronizarConteoRequest {
  conteoId: number;
  codigoProducto: string;
  cantidadContada: number;
  contadoPor: string;
  dispositivoId: string;
  observaciones?: string;
  latitud?: number;
  longitud?: number;
  fechaConteo: string;
}

export interface ResumenConteo {
  conteoId: number;
  totalProductos: number;
  productosContados: number;
  productosPendientes: number;
  porcentajeCompletado: number;
  discrepanciasEncontradas: number;
  valorTotalDiscrepancias: number;
  ultimaActualizacion: string;
  estado: EstadoConteo;
}

export interface BuscarProductoPorCodigoBarraResponse {
  encontrado: boolean;
  codigo: string;
  nombre: string;
  codigoBarra: string;
  cantidadSnapshot?: number;
  ubicacion?: string;
  zona?: string;
  ubicacionDetallada?: string;
  unidadMedida?: string;
  precio?: number;
}

export interface ValidarCodigoBarraResponse {
  esValido: boolean;
  codigoBarra: string;
  mensaje?: string;
}

export interface ContarProductoResponse {
  id: number;
  exito: boolean;
  mensaje: string;
  discrepancia?: number;
  cantidadAnterior?: number;
  cantidadNueva: number;
  requiereVerificacion: boolean;
}

// Zone Management Types
export interface InventarioZona {
  id: number;
  conteoId: number;
  zona: string;
  descripcion?: string;
  asignadoA?: string;
  estado: EstadoZona;
  totalProductos: number;
  productosCompletados: number;
  porcentajeCompletado: number;
  fechaAsignacion?: string;
  fechaCompletada?: string;
}

export interface SiguienteProductoZonaResponse {
  zonaCompletada: boolean;
  producto?: {
    codigoProducto: string;
    nombreProducto: string;
    cantidadSnapshot: number;
    ubicacion: string;
    zona: string;
    ubicacionDetallada?: string;
    secuencia: number;
    totalSecuencia: number;
    codigoBarra?: string;
    unidadMedida?: string;
    precio?: number;
  };
  mensaje: string;
}

export interface ContarProductoZonaRequest {
  conteoId: number;
  zonaId: number;
  codigoProducto?: string;
  codigoBarra?: string;
  cantidadContada: number;
  contadoPor: string;
  dispositivoId: string;
  observaciones?: string;
  latitud?: number;
  longitud?: number;
  esCodigoBarra?: boolean;
}

export interface ProgresoZonas {
  conteoId: number;
  totalZonas: number;
  zonasCompletadas: number;
  porcentajeGeneral: number;
  zonas: {
    id: number;
    zona: string;
    asignadoA?: string;
    estado: EstadoZona;
    porcentajeCompletado: number;
    productosCompletados: number;
    totalProductos: number;
  }[];
}

// Enums
export enum TipoConteo {
  ConteoCompleto = "ConteoCompleto",
  ConteoCiclico = "ConteoCiclico",
  ConteoEspecifico = "ConteoEspecifico",
  AuditoriaExterna = "AuditoriaExterna",
}

export enum EstadoConteo {
  Planificado = "Planificado",
  EnProgreso = "EnProgreso",
  Completado = "Completado",
  Reconciliado = "Reconciliado",
  Cancelado = "Cancelado",
}

export enum EstadoConteoDetalle {
  Pendiente = "Pendiente",
  Contado = "Contado",
  Verificado = "Verificado",
  Discrepancia = "Discrepancia",
}

export enum EstadoZona {
  Asignada = "Asignada",
  EnProgreso = "EnProgreso",
  Completada = "Completada",
  Suspendida = "Suspendida",
}

// Location and Device Types
export interface DispositivoInfo {
  id: string;
  nombre: string;
  tipo: TipoDispositivo;
  sistemaOperativo?: string;
  version?: string;
}

export enum TipoDispositivo {
  Tablet = "Tablet",
  Telefono = "Telefono",
  Scanner = "Scanner",
  Terminal = "Terminal",
}

export interface GeoLocation {
  latitud: number;
  longitud: number;
  precision?: number;
  timestamp: string;
}

// Error handling
export interface InventoryApiError {
  codigo: string;
  mensaje: string;
  detalles?: any;
  timestamp: string;
}

// Offline sync types
export interface OperacionOffline {
  id: string;
  tipo: TipoOperacion;
  datos: any;
  timestamp: string;
  sincronizado: boolean;
  intentos: number;
  ultimoError?: string;
}

export enum TipoOperacion {
  ContarProducto = "ContarProducto",
  ContarPorCodigoBarra = "ContarPorCodigoBarra",
  SincronizarConteo = "SincronizarConteo",
}
