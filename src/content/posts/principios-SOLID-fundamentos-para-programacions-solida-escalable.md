---
title: "Principios SOLID: Fundamentos para una Programación Sólida y Escalable"
description: En esta publicación exploraremos los cinco principios clave de programación SOLID, fundamentales para escribir código limpio, flexible y fácil de mantener.
image: /images/posts/principios-SOLID-fundamentos-para-programacions-solida-escalable.webp
pubDate: 2025-02-25
authorType: self
author: Raúl Salomon Igl
tags: [performance, optimización]
draft: false
---

# SOLID

## S: PRINCIPIO DE RESPONSABILIDAD ÚNICA (SRP)

*"Principio SOLID de Responsabilidad Única **(Single Responsibility Principle, SRP)**"*

El **SRP** establece que:

> *Una clase debe hacer una cosa y, por lo tanto, debe tener una sola razón para cambiar.*
> 

En otras palabras, una clase debe tener una única responsabilidad o tarea. Si una clase tiene más de una responsabilidad, cualquier cambio en una de ellas podría afectar a la otra, lo que hace que el código sea más difícil de mantener y más propenso a errores.

## Ejemplo Práctico

Imagina que estás desarrollando una aplicación para gestionar pedidos en una tienda en línea. Podrías tener una clase `Pedido` que se encarga de varias cosas, como:

1. Calcular el total del pedido.
2. Guardar el pedido en la base de datos.
3. Enviar un correo electrónico de confirmación al cliente.

```typescript
// Ejemplo Incorrecto
export class Pedido {
  items: any[];
  cliente: string;

  public Pedido(items: any[], cliente: string) {
    this.items = items;
    this.cliente = cliente;
  }

  calcular_total() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  guardar_pedido() {
    // Lógica para guardar el pedido en la base de datos
  }
  enviar_confirmacion() {
    // Lógica para enviar un correo electrónico de confirmación
  }
}
```

### Refactorizando para Cumplir con SRP

Para cumplir con el SRP, debemos dividir estas responsabilidades en clases separadas:

1. **`Pedido`**: Se encarga únicamente de representar los datos del pedido y calcular el total.
2. **`PedidoRepository`**: Se encarga de guardar el pedido en la base de datos.
3. **`Notificador`**: Se encarga de enviar notificaciones, como correos electrónicos de confirmación.

```typescript
export class Pedido {
  items: item[];
  cliente: cliente;

  public Pedido(items: item[], cliente: cliente) {
    this.items = items;
    this.cliente = cliente;
  }

  calcular_total() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

export class PedidoRepository {
  guardar(pedido) {
    // Lógica para guardar el pedido en la base de datos
  }
}

export class Notificador {
  enviar_confirmacion(self, pedido) {
    //  Lógica para enviar un correo electrónico de confirmación
  }
```

Ahora, cada clase tiene una única responsabilidad:

- `Pedido` se encarga de los datos y cálculos relacionados con el pedido.
- `PedidoRepository` se encarga de la persistencia de datos.
- `Notificador` se encarga de la comunicación con el cliente.

### Beneficios de SRP

1. **Mantenibilidad**: Si necesitas cambiar la lógica de cómo se guardan los pedidos, solo necesitas modificar la clase `PedidoRepository`, sin afectar a las otras clases.
2. **Reusabilidad**: Las clases con responsabilidades únicas son más fáciles de reutilizar en otros partes del sistema.
3. **Testabilidad**: Es más fácil escribir pruebas unitarias para clases que tienen una única responsabilidad.

---

## O: PRINCIPIO ABIERTO-CERRADO (OCP)

*"Principio SOLID Abierto-Cerrado (Open-Close Principle, OCP)"*

El **OCP** establece que:

> *Las entidades de software (clases, módulos, funciones, etc.) deben estar abiertas para su extensión, pero cerradas para su modificación.*
> 

Modificación significa cambiar el código de una clase existente y extensión significa agregar una nueva funcionalidad.

Entonces, lo que este principio quiere decir es: Deberíamos poder agregar nuevas funciones sin tocar el código existente para la clase. Esto se debe a que cada vez que modificamos el código existente, corremos el riesgo de crear errores potenciales. Por lo tanto, debemos evitar tocar el código de producción probado y confiable (en su mayoría) si es posible.

Pero *¿cómo vamos a agregar una nueva funcionalidad sin tocar la clase?*, puede preguntarse. Por lo general, se hace con la ayuda de **interfaces** y **clases abstractas**.

## Ejemplo Práctico

Imagina que estás desarrollando un sistema de notificaciones que envía mensajes a los usuarios a través de diferentes canales, como correo electrónico, SMS y notificaciones push.

### Violación del OCP

Si implementas todo en una sola clase, cada vez que agregues un nuevo canal de notificación, tendrás que modificar el código existente:

```typescript
export class Notificador {
    enviar(mensaje: string, tipo: string) {
        if (tipo === "email") {
            console.log(`Enviando email: ${mensaje}`);
        } else if (tipo === "sms") {
            console.log(`Enviando SMS: ${mensaje}`);
        } else if (tipo === "push") {
            console.log(`Enviando notificación push: ${mensaje}`);
        }
        // Si agregamos un nuevo tipo, tenemos que modificar esta clase.
    }
}

const notificador = new Notificador();
notificador.enviar("Hola, ¿cómo estás?", "email");
```

### Refactorización para Cumplir con OCP

Para cumplir con el OCP, podemos usar **abstracciones** (como interfaces) y permitir que nuevos canales de notificación se agreguen sin modificar el código existente.

1. **Definir una interfaz común** para todos los tipos de notificaciones.
2. **Implementar clases específicas** para cada canal de notificación.
3. **Extender el sistema** sin modificar el código existente.

### Definir una interfaz común

```typescript
interface CanalNotificacion {
    enviar(mensaje: string): void;
}
```

### Implementar clases específicas para cada canal

```typescript
class EmailNotificacion implements CanalNotificacion {
    enviar(mensaje: string) {
        console.log(`Enviando email: ${mensaje}`);
    }
}

class SMSNotificacion implements CanalNotificacion {
    enviar(mensaje: string) {
        console.log(`Enviando SMS: ${mensaje}`);
    }
}

class PushNotificacion implements CanalNotificacion {
    enviar(mensaje: string) {
        console.log(`Enviando notificación push: ${mensaje}`);
    }
}
```

### Clase Notificador que usa la interfaz
```typescript
class Notificador {
    private canales: CanalNotificacion[] = [];

    agregarCanal(canal: CanalNotificacion) {
        this.canales.push(canal);
    }

    enviarNotificacion(mensaje: string) {
        this.canales.forEach(canal => canal.enviar(mensaje));
    }
}

// Uso del sistema
const notificador = new Notificador();
notificador.agregarCanal(new EmailNotificacion());
notificador.agregarCanal(new SMSNotificacion());
notificador.agregarCanal(new PushNotificacion());

notificador.enviarNotificacion("Hola, ¿cómo estás?");
```

### Beneficios del OCP

1. **Extensibilidad**: Puedes agregar nuevos comportamientos (como un nuevo canal de notificación) sin modificar el código existente.
2. **Mantenibilidad**: Al no modificar el código existente, reduces el riesgo de introducir errores en partes del sistema que ya funcionan.
3. **Reusabilidad**: Las abstracciones (como la interfaz `CanalNotificacion`) pueden ser reutilizadas en otros partes del sistema.

---

## L: PRINCIPIO DE SUSTITUCIÓN DE LISKOV (LSP)

*"Principio SOLID de Sustitución de Liskov (Liskov Substitution Principle, LSP)"*

Este principio es fundamental para garantizar que las jerarquías de herencia funcionen correctamente y que las clases derivadas puedan ser usadas en lugar de las clases base sin alterar el comportamiento del programa.

El **LSP** establece que:

> *Los objetos de una clase derivada deben poder sustituirse por objetos de la clase base sin alterar el comportamiento correcto del programa.*
> 

En otras palabras, si tienes una clase base y una clase derivada, deberías poder usar un objeto de la clase derivada en cualquier lugar donde se espera un objeto de la clase base, y el programa debería seguir funcionando correctamente.

## Ejemplo Práctico

Imagina que estás desarrollando un sistema de figuras geométricas, donde tienes una clase base `Rectangulo` y una clase derivada `Cuadrado`.

### Violación del LSP

En este ejemplo, `Cuadrado` hereda de `Rectangulo`, pero cambia el comportamiento de los métodos `setAncho` y `setAlto`, lo que viola el LSP:

```typescript
class Rectangulo {
    protected ancho: number;
    protected alto: number;

    constructor(ancho: number, alto: number) {
        this.ancho = ancho;
        this.alto = alto;
    }

    setAncho(ancho: number) {
        this.ancho = ancho;
    }

    setAlto(alto: number) {
        this.alto = alto;
    }

    calcularArea(): number {
        return this.ancho * this.alto;
    }
}

class Cuadrado extends Rectangulo {
    setAncho(ancho: number) {
        this.ancho = ancho;
        this.alto = ancho; // En un cuadrado, el ancho y el alto son iguales.
    }

    setAlto(alto: number) {
        this.alto = alto;
        this.ancho = alto; // En un cuadrado, el ancho y el alto son iguales.
    }
}

// Función que usa la clase base Rectangulo
function imprimirArea(rectangulo: Rectangulo) {
    rectangulo.setAncho(4);
    rectangulo.setAlto(5);
    console.log(`Área: ${rectangulo.calcularArea()}`);
}

const rectangulo = new Rectangulo(2, 3);
imprimirArea(rectangulo); // Área: 20 (correcto)

const cuadrado = new Cuadrado(2, 2);
imprimirArea(cuadrado); // Área: 25 (incorrecto, debería ser 20)
```

En este caso, `Cuadrado` no puede sustituir a `Rectangulo` sin alterar el comportamiento esperado, lo que viola el LSP.

---

### Refactorización para Cumplir con LSP

Para cumplir con el LSP, debemos asegurarnos de que `Cuadrado` no altere el comportamiento de `Rectangulo`. Una solución es no usar herencia en este caso, ya que un cuadrado no es un tipo de rectángulo en términos de comportamiento.

En su lugar, podemos usar una interfaz común para ambas figuras:

```typescript
interface Figura {
    calcularArea(): number;
}

class Rectangulo implements Figura {
    private ancho: number;
    private alto: number;

    constructor(ancho: number, alto: number) {
        this.ancho = ancho;
        this.alto = alto;
    }

    calcularArea(): number {
        return this.ancho * this.alto;
    }
}

class Cuadrado implements Figura {
    private lado: number;

    constructor(lado: number) {
        this.lado = lado;
    }

    calcularArea(): number {
        return this.lado * this.lado;
    }
}
```

### Función que usa la interfaz Figura

```typescript
function imprimirArea(figura: Figura) {
    console.log(`Área: ${figura.calcularArea()}`);
}

const rectangulo = new Rectangulo(4, 5);
imprimirArea(rectangulo); // Área: 20

const cuadrado = new Cuadrado(4);
imprimirArea(cuadrado); // Área: 16
```

Ahora, tanto `Rectangulo` como `Cuadrado` implementan la interfaz `Figura`, y cada uno tiene su propia lógica para calcular el área. Esto cumple con el LSP, ya que ambas clases pueden ser usadas de manera intercambiable sin alterar el comportamiento del programa.

### Beneficios del LSP

1. **Consistencia**: Garantiza que las clases derivadas no alteren el comportamiento esperado de la clase base.
2. **Reusabilidad**: Facilita la reutilización de código, ya que las clases derivadas pueden usarse en cualquier lugar donde se espera la clase base.
3. **Mantenibilidad**: Reduce la posibilidad de introducir errores al extender el sistema.

---

## I: PRINCIPIO DE SEGREGACIÓN DE INTERFACES

*“Principio SOLID de Segregación de Interfaces (Interface Segregation Principle, ISP)”*

Este principio se enfoca en diseñar interfaces cohesivas y específicas, evitando que las clases dependan de métodos que no necesitan.

El **ISP** establece que:

> *Ningún cliente debería verse obligado a depender de métodos que no usa.*
> 

En otras palabras, es mejor tener muchas interfaces pequeñas y específicas que una sola interfaz grande y general. Esto evita que las clases implementen métodos que no son relevantes para su funcionalidad, lo que reduce la complejidad y mejora la mantenibilidad del código.

## Ejemplo Práctico

Imagina que estás desarrollando un sistema para gestionar dispositivos electrónicos, como impresoras y escáneres. Podrías tener una interfaz `Dispositivo` que incluye métodos para imprimir, escanear y enviar faxes.

### Violación del ISP

En este ejemplo, la interfaz `Dispositivo` es demasiado general, lo que obliga a las clases a implementar métodos que no necesitan:

```typescript
interface Dispositivo {
    imprimir(documento: string): void;
    escanear(documento: string): void;
    enviarFax(documento: string): void;
}

class Impresora implements Dispositivo {
    imprimir(documento: string) {
        console.log(`Imprimiendo: ${documento}`);
    }

    escanear(documento: string) {
        throw new Error("Método no implementado");
    }

    enviarFax(documento: string) {
        throw new Error("Método no implementado");
    }
}

class Escaner implements Dispositivo {
    imprimir(documento: string) {
        throw new Error("Método no implementado");
    }

    escanear(documento: string) {
        console.log(`Escaneando: ${documento}`);
    }

    enviarFax(documento: string) {
        throw new Error("Método no implementado");
    }
}
```

Aquí, tanto `Impresora` como `Escaner` están obligadas a implementar métodos que no necesitan (`escanear` y `enviarFax` para `Impresora`, e `imprimir` y `enviarFax` para `Escaner`). Esto viola el ISP.

### Refactorización para Cumplir con ISP

Para cumplir con el ISP, dividimos la interfaz `Dispositivo` en interfaces más pequeñas y específicas:

```typescript
interface Imprimible {
    imprimir(documento: string): void;
}

interface Escaneable {
    escanear(documento: string): void;
}

interface Faxable {
    enviarFax(documento: string): void;
}

class Impresora implements Imprimible {
    imprimir(documento: string) {
        console.log(`Imprimiendo: ${documento}`);
    }
}

class Escaner implements Escaneable {
    escanear(documento: string) {
        console.log(`Escaneando: ${documento}`);
    }
}

class ImpresoraMultifuncional implements Imprimible, Escaneable, Faxable {
    imprimir(documento: string) {
        console.log(`Imprimiendo: ${documento}`);
    }

    escanear(documento: string) {
        console.log(`Escaneando: ${documento}`);
    }

    enviarFax(documento: string) {
        console.log(`Enviando fax: ${documento}`);
    }
}
```

Ahora, cada clase implementa solo las interfaces que necesita:

- `Impresora` implementa `Imprimible`.
- `Escaner` implementa `Escaneable`.
- `ImpresoraMultifuncional` implementa `Imprimible`, `Escaneable` y `Faxable`.

### Beneficios del ISP

1. **Cohesión**: Las interfaces son más específicas y cohesivas, lo que facilita su comprensión y uso.
2. **Flexibilidad**: Las clases solo dependen de las interfaces que necesitan, lo que hace que el sistema sea más flexible y fácil de extender.
3. **Mantenibilidad**: Al evitar métodos innecesarios, reduces la complejidad del código y el riesgo de errores.

---

## D: PRINCIPIO DE INVERSIÓN DE DEPENDENCIAS

*"Principio SOLID de Inversión de Dependencias (Dependency Inversion Principle, DIP)"*

El principio de inversión de dependencia establece que nuestras clases deben depender de interfaces o clases abstractas en lugar de clases y funciones concretas.

El **DIP** establece que:

> *Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones.*
> 

> *Las abstracciones no deben depender de los detalles. Los detalles deben depender de las abstracciones.*
> 
1. Las clases de alto nivel *(que contienen la lógica de negocio)* **no** deben depender directamente de clases de bajo nivel *(que realizan tareas específicas, como acceso a bases de datos o llamadas a APIs)*. En su lugar, ambas deben depender de abstracciones *(como interfaces o clases abstractas)*.
2. Las abstracciones no deben estar influenciadas por los detalles de implementación, sino que los detalles deben depender de las abstracciones.

## Ejemplo Práctico

Imagina que estás desarrollando un sistema de notificaciones que envía mensajes a los usuarios a través de diferentes canales, como correo electrónico y SMS.

### Violación del DIP

En este ejemplo, la clase `Notificador` depende directamente de las clases `EmailService` y `SMSService`, lo que viola el DIP:

```typescript
class EmailService {
    enviarEmail(mensaje: string) {
        console.log(`Enviando email: ${mensaje}`);
    }
}

class SMSService {
    enviarSMS(mensaje: string) {
        console.log(`Enviando SMS: ${mensaje}`);
    }
}

class Notificador {
    private emailService: EmailService;
    private smsService: SMSService;

    constructor() {
        this.emailService = new EmailService();
        this.smsService = new SMSService();
    }

    enviarNotificacion(mensaje: string, tipo: string) {
        if (tipo === "email") {
            this.emailService.enviarEmail(mensaje);
        } else if (tipo === "sms") {
            this.smsService.enviarSMS(mensaje);
        }
    }
}

const notificador = new Notificador();
notificador.enviarNotificacion("Hola, ¿cómo estás?", "email");
```

Aquí, `Notificador` depende directamente de `EmailService` y `SMSService`, lo que hace que el sistema sea rígido y difícil de extender. Si queremos agregar un nuevo canal de notificación, tendríamos que modificar la clase `Notificador`.

### Refactorización para Cumplir con DIP

Para cumplir con el DIP, introducimos una abstracción (interfaz) que represente el concepto de un servicio de notificación. Luego, hacemos que `Notificador` dependa de esta abstracción en lugar de las implementaciones concretas.

### Definir una abstracción (interfaz)

```typescript
interface ServicioNotificacion {
    enviar(mensaje: string): void;
}
```

### Implementar las clases concretas

```typescript
class EmailService implements ServicioNotificacion {
    enviar(mensaje: string) {
        console.log(`Enviando email: ${mensaje}`);
    }
}

class SMSService implements ServicioNotificacion {
    enviar(mensaje: string) {
        console.log(`Enviando SMS: ${mensaje}`);
    }
}
```

### Hacer que Notificador dependa de la abstracción
```typescript
class Notificador {
    private servicios: ServicioNotificacion[];

    constructor(servicios: ServicioNotificacion[]) {
        this.servicios = servicios;
    }

    enviarNotificacion(mensaje: string) {
        this.servicios.forEach(servicio => servicio.enviar(mensaje));
    }
}

// Uso del sistema
const emailService = new EmailService();
const smsService = new SMSService();

const notificador = new Notificador([emailService, smsService]);
notificador.enviarNotificacion("Hola, ¿cómo estás?");
```

### Beneficios del DIP

1. **Desacoplamiento**: Las clases de alto nivel no dependen de clases de bajo nivel, lo que facilita la modificación y extensión del sistema.
2. **Flexibilidad**: Puedes agregar nuevas implementaciones (como un nuevo canal de notificación) sin modificar el código existente.
3. **Testabilidad**: Al depender de abstracciones, es más fácil realizar pruebas unitarias usando mocks o stubs.