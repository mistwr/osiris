# LUMIN AI VISION — Telecom e dados de clientes

## Camada pública
- GEO.ANACOM: coberturas fixas e móveis, com atualização trimestral e atribuição da fonte.
- Localidades, tecnologias e operadores cobertos, nunca inferir operadora contratada.
- Consultas geográficas por ponto e comparação de coberturas.

## Camada privada (somente opt-in)
- Conta autenticada, consentimento explícito, finalidade definida, revogação e eliminação.
- Faturas submetidas pelo titular ou integração oficial autorizada; não procurar faturas de terceiros.
- Dados privados: operadora declarada, contrato, mensalidade, período de fidelização, endereço e alertas.
- Pin privado visível apenas ao titular ou à equipa com acesso autorizado, nunca num mapa público.
- Número de cliente, NIF, IBAN, número de telefone e morada não podem ser expostos em endpoints públicos.

## API de operadores
- Open Gateway/CAMARA fornece funcionalidades de rede específicas, não um diretório de clientes e moradas.
- Usar OAuth/consentimento e contratos comerciais quando exigidos.
- Sem scraping de áreas autenticadas, enumeração de números ou inferência de identidade a partir de cobertura.

## Próximas implementações
1. Confirmar camadas e capacidades reais de GEO.ANACOM em testes.
2. Criar consulta pública de cobertura por coordenadas, com limites e cache.
3. Definir esquema privado de clientes com controlo de acesso por organização e utilizador.
4. Integrar faturas submetidas voluntariamente e mostrar os pins apenas na sessão autenticada.
5. Rever direitos de reutilização, RGPD, retenção e segurança antes de ativar dados reais.

## Identidade
Marca pública: LUMIN AI VISION.
Atribuição: baseado no projeto open-source OSIRIS; preservar avisos e licenças do projeto original.
