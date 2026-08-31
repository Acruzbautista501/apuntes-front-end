# Módulo 28: Firmas GPG/SSH y Seguridad en Commits

Cualquiera puede configurar `user.name`/`user.email` (Módulo 2.2) con el nombre de otra persona — nada en Git, por defecto, verifica que un commit realmente provenga de quien dice ser su autor. Este módulo cubre cómo firmar commits criptográficamente para resolver ese problema.

## 28.1 El Problema: la Identidad de Autor no está Verificada

```bash
git config user.name "Linus Torvalds"
git config user.email "torvalds@ejemplo.com"
git commit -m "Este commit PARECE venir de Linus Torvalds, pero no es así"
```

Sin firma, el campo "Author" de un commit es simplemente texto configurado localmente, sin ninguna verificación criptográfica — cualquiera con acceso de escritura al repositorio (o incluso solo generando un parche) puede atribuir un commit a cualquier identidad arbitraria.

## 28.2 Firmar Commits con GPG

```bash
gpg --full-generate-key                # Genera un par de claves GPG
gpg --list-secret-keys --keyid-format=long # Obtener el ID de la clave generada
```

```bash
git config --global user.signingkey TU_KEY_ID
git config --global commit.gpgsign true   # Firmar TODOS los commits automáticamente
```

```bash
git commit -m "Este commit está firmado criptográficamente"
```

```text
git log --show-signature
# gpg: Good signature from "Alex <alex@ejemplo.com>"
```

Un commit firmado incluye una firma digital verificable contra la clave pública del autor — GitHub/GitLab verifican automáticamente estas firmas y muestran una insignia "Verified" junto al commit cuando la firma es válida.

## 28.3 Firmar con Claves SSH (Alternativa Moderna)

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

Desde Git 2.34, es posible firmar commits usando el mismo par de claves SSH ya configurado para autenticación (Módulo 7.3), evitando la necesidad de gestionar un sistema GPG completamente separado — GitHub acepta claves SSH tanto para autenticación como para firma, configurables de forma independiente en la misma cuenta.

## 28.4 Subir la Clave Pública a GitHub para Verificación

```text
GitHub → Settings → SSH and GPG Keys → New GPG key (o New SSH key, marcada como "Signing Key")
```

Sin registrar la clave pública correspondiente en la plataforma, los commits firmados localmente no mostrarán la insignia "Verified" — la firma sigue siendo criptográficamente válida, pero la plataforma no tiene forma de asociarla con tu cuenta sin la clave pública registrada.

## 28.5 Firmar Tags También

```bash
git tag -s v1.0.0 -m "Versión estable firmada"
```

Igual que los commits, los tags (Módulo 14) pueden firmarse — particularmente relevante para releases de software, donde verificar que una versión publicada realmente proviene del mantenedor oficial del proyecto es una garantía de seguridad significativa para quien la descarga.

## 28.6 Exigir Firmas a Nivel de Repositorio

```text
Configuración de protección de ramas (Módulo 25.7):
☑ Require signed commits
```

Sin esta política activada, la firma de commits es puramente opcional y depende de que cada persona la configure voluntariamente — activarla en la protección de la rama principal convierte la firma en un requisito técnico, rechazando cualquier commit sin firma válida.

## 28.7 Otras Prácticas de Seguridad en el Flujo de Git

- **Nunca confirmar secretos** (`.env`, claves de API, contraseñas) — cubierto en el Módulo 13.7, incluyendo por qué eliminarlos en un commit posterior no los borra del historial.
- **Revisar el contenido de un Pull Request externo antes de fusionarlo**, especialmente en proyectos de código abierto — un PR malicioso podría intentar introducir código dañino disfrazado de una contribución legítima.
- **Usar autenticación de dos factores (2FA)** en la cuenta de GitHub/GitLab — protege contra que alguien más suba commits (firmados o no) usando credenciales comprometidas de tu cuenta.

## 28.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Firmar commits con GPG | `git config --global commit.gpgsign true` + clave GPG configurada |
| Firmar commits con SSH (más simple si ya usas SSH) | `git config --global gpg.format ssh` |
| Verificar la firma de un commit | `git log --show-signature` |
| Firmar un tag | `git tag -s <nombre> -m "mensaje"` |
| Exigir firma a nivel de repositorio | "Require signed commits" en protección de ramas |

## 28.9 Errores Comunes

- **Confundir "Verified" en GitHub con "el código es seguro"**: la insignia solo confirma que el commit fue firmado por la clave asociada a esa cuenta — no garantiza nada sobre la calidad, intención o seguridad del código en sí mismo.
- **Firmar commits sin registrar la clave pública en la plataforma**: la firma es válida criptográficamente pero no se muestra verificada, generando confusión sobre si la configuración realmente funcionó.
- **Perder la clave privada de firma sin ningún respaldo**: sin la clave privada original, no es posible generar nuevas firmas válidas con esa identidad, y los commits históricos firmados con ella permanecen verificables pero ninguno nuevo podrá firmarse de la misma forma hasta configurar una clave de reemplazo.
