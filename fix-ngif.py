#!/usr/bin/env python3
import re

# Ler o arquivo
with open('src/app/modules/employee/components/employee-form/employee-form.component.html', 'r') as f:
    content = f.read()

# Corrigir diretivas *ngIf quebradas em múltiplas linhas
# Padrão: *ngIf=" seguido de quebras de linha e espaços, depois o conteúdo, depois " fechando
pattern = r'\*ngIf="\s*\n\s*([^"]*?)\s*\n\s*"'
replacement = r'*ngIf="\1"'

content = re.sub(pattern, replacement, content, flags=re.MULTILINE | re.DOTALL)

# Corrigir outros padrões problemáticos
content = re.sub(r'\*ngIf="\s+', '*ngIf="', content)
content = re.sub(r'\s+"\s*>', '">', content)

# Escrever o arquivo corrigido
with open('src/app/modules/employee/components/employee-form/employee-form.component.html', 'w') as f:
    f.write(content)

print("Arquivo corrigido!")