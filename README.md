# Pharmacy Inventory API

API para el sistema de inventario de farmacia, desarrollada con NestJS.

## Requisitos Previos

- Node.js (v18 o superior)
- pnpm (o npm/yarn)
- Una instancia de base de datos MySQL en ejecución

## Instalación

1.  **Clonar el repositorio (si es necesario):**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd pharmacy-inventory-api
    ```

2.  **Instalar dependencias:**
    Se recomienda usar `pnpm`.
    ```bash
    pnpm install
    ```
    Si prefieres `npm` o `yarn`:
    ```bash
    npm install
    # o
    yarn install
    ```

## Configuración

1.  **Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto (`pharmacy-inventory-api/.env`) a partir del archivo `.env.example` que se encuentra en la raíz del proyecto o créalo desde cero. El contenido debe ser similar a este:

    ```env
    # Configuración de la Base de Datos
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=tu_contraseña_de_mysql
    DB_DATABASE=pharmacy_inventory

    # Configuración de la Base de Datos Root
    DB_ROOT_USERNAME=root
    DB_ROOT_PASSWORD=tu_contraseña_de_mysql_root

    # Secreto para JSON Web Token (JWT)
    JWT_SECRET=tu_secreto_super_secreto
    JWT_EXPIRES_IN=12h

    # Puerto de la Aplicación
    PORT=3001
    ```

2.  **Crear la Base de Datos:**
    Asegúrate de que tu servidor de MySQL esté corriendo. El siguiente comando creará la base de datos especificada en tu archivo `.env`, la poblara y creara el usuario administrador.

    ```bash
    pnpm run init
    ```

## Ejecutando la Aplicación

Una vez completada la instalación y configuración, puedes iniciar la aplicación en modo de desarrollo:

```bash
pnpm run start:dev
```

El servidor se iniciará y quedará escuchando los cambios en los archivos. Por defecto, la API estará disponible en `http://localhost:3001`.

## Login

El usuario administrador se creara con los siguientes datos:

-   **Nombre:** Eddy Urbina Obando
-   **Identificación:** 777-250700-1100P
-   **Teléfono:** 77675646
-   **Email:** admin@admin.com
-   **Contraseña:** 12345678

para loguearte por primera vez y tener maximos privilegios deberas usar la identificacion: 777-250700-1100P y la contraseña: 12345678

### Otros Scripts Útiles

-   **Iniciar en modo producción:**
    ```bash
    pnpm run build
    pnpm run start:prod
    ```