#!/bin/sh
# Este script garante que o servidor Nginx inicie corretamente no ambiente do Cloud Run.
# 'set -e' faz com que o script pare imediatamente se algum comando falhar.
set -e

# --- MENSAGENS DE DEBUG ---
# Imprime mensagens no log para sabermos que o script começou e qual porta ele recebeu.
echo "Iniciando o entrypoint.sh..."
echo "Variável de ambiente PORT recebida do Cloud Run: ${PORT}"
echo "Substituindo a variável no template do Nginx..."
# -------------------------

# O comando principal:
# 'envsubst' lê o arquivo de template, substitui a variável ${PORT} pelo seu valor real,
# e salva o resultado no arquivo de configuração final do Nginx.
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# --- MENSAGEM DE DEBUG ---
# Mostra o conteúdo do arquivo de configuração final para podermos verificar nos logs se a porta está correta.
echo "Configuração do Nginx criada com sucesso. Conteúdo:"
cat /etc/nginx/conf.d/default.conf
echo "Iniciando o servidor Nginx..."
# -------------------------

# Inicia o servidor Nginx em primeiro plano ('daemon off;') para que o contêiner continue rodando.
exec nginx -g 'daemon off;'