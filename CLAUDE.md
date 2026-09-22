# APULSO

App de analítica de gimnasio. Un solo archivo, `index.html`: HTML, CSS y JS vanilla,
sin compilación ni dependencias. Los datos viven en `localStorage` del navegador.
Interfaz en español, para Chile.

## El listón

> **"Somos exitosos y apuntamos a lo más alto."** — Matías

Esa frase manda en cada decisión de diseño. Nada que se vea hecho a medias, genérico
o de relleno: si un icono, una animación o una pantalla no aguanta la comparación con
una app de pago, no entra. Cuando dudes entre "suficiente" y "impecable", impecable.

## Cómo trabajar aquí

- **Pregunta antes de cada cambio de fondo.** Enseña la propuesta renderizada —una
  captura, una lámina comparando lo de ahora con lo nuevo— y espera el visto bueno
  antes de tocar la app. Vale para iconos, animaciones, colores y maquetación.
- **No inventes por tu cuenta.** Un cambio no pedido, aunque parezca mejora, se
  propone; no se aplica.
- **Nunca borres datos del usuario.** Está usando la app de verdad mientras se
  edita. Hay copias automáticas en `localStorage` y exportación a JSON: no las rompas.
- **Mide, no supongas.** Contraste, simetría, memoria de las capas, tiempos: todo
  eso se comprueba con una prueba real en el navegador antes de decir que está bien.

## Rendimiento en iPhone (no lo deshagas)

Safari mata la pestaña por memoria si la página pide texturas grandes, y ampliar con
los dedos multiplica ese coste por el cuadrado del zoom. Por eso:

- **Nada de `filter: blur()` en capas grandes.** Un desenfoque reserva una textura
  del tamaño del elemento más el radio por los cuatro lados. Los resplandores se
  pintan con `radial-gradient`.
- **Nada de `mix-blend-mode` ni `filter` repetidos** en elementos de lista (las
  chapas de ejercicio son decenas). El brillo va dentro del SVG, con degradados.
- **`backdrop-filter` solo donde se note**, y con radio corto.
- Al ampliar, `visualViewport.scale > 1` pone la clase `zoomed` en el `body` y el CSS
  apaga fondos animados y desenfoques hasta que se suelte el pellizco.

## Reloj y descansos

El descanso se guarda como **el instante en que termina** (`session.restEndsAt`), no
como segundos que se restan: un contador por tics se congela cuando el sistema
suspende la pestaña. Todo se calcula contra el reloj del sistema y se resincroniza en
`visibilitychange`, `pageshow` y `focus`.

## Zoom automático

Los campos llevan 16px como mínimo en pantallas táctiles y lo pulsable lleva
`touch-action: manipulation`. **No se toca `user-scalable`:** el pellizco del usuario
tiene que seguir funcionando; lo que se apaga es el zoom que hace iOS solo.

## Pruebas

En el directorio de trabajo de la sesión hay scripts de Playwright (`auditoria.js`,
`extras.js`, `fondo.js`, `intensity.js`, `respaldo.js`, `symmetry.js`…). Se lanzan con
`node <script>.js` y recorren la app de verdad. Antes de subir nada: pasarlos y
comprobar que no hay errores de consola.
