# Guía de Instalación del Proyecto Django

Esta guía te llevará paso a paso por el proceso de instalación de **Django** y la configuración del proyecto.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu máquina:

- **Python 3.7 o superior**: Puedes descargar Python desde [python.org](https://www.python.org/downloads/).
- **pip**: El instalador de paquetes de Python, que generalmente viene incluido con Python.
- **virtualenv** (opcional, pero recomendado): Herramienta para crear entornos aislados de Python.

## Pasos de Instalación

### 1. Clonar el Repositorio (si aplica)

Si estás trabajando con un proyecto Django existente que está en un repositorio de Git, clona el repositorio primero:

```bash
bash
Copiar código
git clone https://github.com/tu-repositorio/nombre-del-proyecto.git
cd nombre-del-proyecto

```

### 2. Crear un Entorno Virtual

Se recomienda encarecidamente crear un entorno virtual para aislar las dependencias del proyecto. Puedes crear uno con los siguientes comandos:

- En **Windows**:
    
    ```bash
    bash
    Copiar código
    python -m venv env
    
    ```
    
- En **macOS/Linux**:
    
    ```bash
    bash
    Copiar código
    python3 -m venv env
    
    ```
    

### 3. Activar el Entorno Virtual

Después de crear el entorno virtual, actívalo:

- En **Windows**:
    
    ```bash
    bash
    Copiar código
    .\env\Scripts\activate
    
    ```
    
- En **macOS/Linux**:
    
    ```bash
    bash
    Copiar código
    source env/bin/activate
    
    ```
    

Una vez activado, deberías ver `(env)` antes del cursor en la terminal.

### 4. Instalar Django y las Dependencias

Instala **Django** y las demás dependencias del proyecto usando **pip**. Si hay un archivo **`requirements.txt`** en el directorio del proyecto, ejecuta:

```bash
bash
Copiar código
pip install -r requirements.txt

```

Si estás empezando un proyecto nuevo, puedes instalar Django directamente:

```bash
bash
Copiar código
pip install django

```

### 5. Aplicar Migraciones de Base de Datos

Para inicializar la base de datos, ejecuta el siguiente comando:

```bash
bash
Copiar código
python manage.py migrate

```

Esto creará las tablas necesarias en la base de datos para que el proyecto funcione.

### 6. Crear un Superusuario (Opcional)

Si deseas acceder al panel de administración de Django, crea un superusuario ejecutando:

```bash
bash
Copiar código
python manage.py createsuperuser

```

Sigue las instrucciones para configurar un nombre de usuario, correo electrónico y contraseña para el superusuario.

### 7. Iniciar el Servidor de Desarrollo

Finalmente, ejecuta el servidor de desarrollo para iniciar el proyecto:

```bash
bash
Copiar código
python manage.py runserver

```

Deberías ver una salida indicando que el servidor está corriendo. Abre tu navegador y visita [http://127.0.0.1:8000](http://127.0.0.1:8000/) para acceder al proyecto.

### 8. (Opcional) Recopilar Archivos Estáticos

Si tu proyecto usa archivos estáticos (CSS, JavaScript), ejecuta el siguiente comando para recopilar estos archivos en el directorio **`static`**:

```bash
bash
Copiar código
python manage.py collectstatic

```

### 9. Desactivar el Entorno Virtual

Cuando hayas terminado de trabajar, desactiva el entorno virtual con:

```bash
bash
Copiar código
deactivate

```

## Notas Adicionales

- Si encuentras problemas durante la instalación, asegúrate de tener la versión correcta de Python y todas las dependencias necesarias.
- Para actualizar las dependencias, puedes modificar el archivo **`requirements.txt`** y ejecutar nuevamente `pip install -r requirements.txt`.