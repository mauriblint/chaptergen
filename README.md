# YouTube Timestamps

App para generar timestamps de capítulos para videos de YouTube usando IA.

Subís un video, el backend extrae el audio, lo transcribe con OpenAI Whisper y genera capítulos con títulos descriptivos usando GPT-4o-mini.

## Requisitos

- Node.js >= 20
- [ffmpeg](https://ffmpeg.org/) instalado en el sistema
- API key de [OpenAI](https://platform.openai.com)

```bash
# macOS
brew install ffmpeg
```

## Setup

1. Clonar el repositorio e instalar dependencias:

```bash
npm install --prefix backend
npm install --prefix frontend
```

2. Configurar variables de entorno:

```bash
cp backend/.env.example backend/.env
# Editar backend/.env y agregar tu OPENAI_API_KEY
```

3. Iniciar backend y frontend (en terminales separadas):

```bash
npm run dev:backend   # http://localhost:3006
npm run dev:frontend  # http://localhost:5193
```

4. Abrir http://localhost:5193 en el navegador.

## Uso

1. Arrastrá o seleccioná un video o audio (MP4, MOV, MP3, WAV, M4A, etc.).
2. Esperá la transcripción (extracción de audio → Whisper).
3. Los capítulos se generan automáticamente según el contenido.
4. Si querés ajustar: elegí modo automático o cantidad fija y apretá **Regenerar capítulos** (solo vuelve a llamar a GPT, sin re-transcribir).
5. Editá los títulos si querés y copiá el resultado al portapapeles.

Ejemplo de salida:

```
[00:00:00] Introducción a la automatización de comentarios
[00:00:21] Configuración técnica en la página de Absorteos
[00:01:29] Creación y personalización de respuestas públicas
```

## Estructura

```
frontend/   Vue 3 + Vite — UI de upload y resultados
backend/    Express + TypeScript — pipeline de procesamiento
```

## API

- `POST /api/transcribe` — sube video o audio, devuelve segmentos con timestamps (Whisper)
- `POST /api/chapters` — recibe segmentos, devuelve capítulos (GPT). Body: `{ segments, auto?: true, chapterCount?: number }`

## Costos estimados (OpenAI)

~$0.07 USD por video de 10 minutos (Whisper + GPT-4o-mini). Regenerar capítulos cuesta ~$0.001 por intento.

## Limitaciones del MVP

- Solo subida de archivo local (no URL de YouTube).
- Procesamiento síncrono (videos largos pueden tardar).
- Requiere ffmpeg instalado localmente.
