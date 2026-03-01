# Estado de Configuración del Dominio - sweetjay.com.mx
Fecha: 2026-03-01

Este documento registra el estado actual de la configuración del dominio tras la sesión de hoy.

## Resumen del Estado
A pesar de que el portal de Akky muestra el servicio como **Activo** y los registros están correctamente guardados, existe un retraso en la sincronización de sus servidores de nombres (NS1, NS2, NS3).

## Configuración Guardada en Akky
Los siguientes registros fueron ingresados manualemente y confirmados en el **Archivo de Zona** (Serial: `1772405757`):

| Tipo | Dominio / Nombre | Valor / Contenido | TTL |
|------|------------------|-------------------|-----|
| A    | sweetjay.com.mx  | 199.36.158.100    | 1 hora |
| A    | sweetjay.com.mx  | 151.101.1.195     | 4 horas |
| TXT  | sweetjay.com.mx  | hosting-site=sweetjay-official | 1 hora |

## Notas Técnicas
- El serial activo en los servidores de nombres externos al momento del último reporte es `1772321450`, el cual es anterior al serial del portal.
- Se intentó forzar la actualización cambiando el TTL de uno de los registros A a 4 horas.
- Se recomendó al usuario contactar a soporte de Akky si la propagación no ocurre en las próximas horas.

## Instrucciones para Firebase
Una vez que Akky propague los registros, Firebase detectará automáticamente el sitio. No se requiere ninguna acción adicional en el panel de Firebase por ahora.
