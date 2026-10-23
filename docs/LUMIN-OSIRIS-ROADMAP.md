# LUMIN OSIRIS — O Olho do Mundo

Esta adaptação mantém o OSIRIS original (Next.js, MapLibre, camadas OSINT e OI). Não substituir o frontend nem remover as APIs existentes.

## Portugal — primeira integração

- Fonte IPMA: https://api.ipma.pt/ (verificar licença, limites e cobertura antes de consumir)
- Sismos: preservar USGS existente; acrescentar fonte portuguesa como enriquecimento, sem duplicar eventos
- Câmaras: integrar apenas transmissões oficialmente públicas com permissão de incorporação; nunca enumerar câmaras privadas ou vulneráveis
- Tráfego e incêndios: acrescentar fontes oficiais quando endpoints e direitos de reutilização estiverem verificados
- Cada registo deverá conter: source, sourceUrl, observedAt, fetchedAt, geometry, confidence e attribution

## Lumin Intelligence

Correlacionar acontecimentos por proximidade espacial e temporal; apresentar fontes e incerteza. Evitar inferir identidades de pessoas em vídeo ou localização individual. Não confundir simulações com previsões validadas.

## Publicação

Manter Next.js com rotas API. Para Netlify, testar suporte Next.js e funções server-side, build e limites antes de ligar ao domínio. Não usar exportação estática enquanto existirem rotas API dinâmicas.

## Próximos passos

1. Criar adaptador IPMA com validação e cache.
2. Acrescentar seletor Portugal ao mapa existente.
3. Validar catálogo de webcams públicas.
4. Criar normalização geoespacial e histórico.
5. Integrar Lumin AI sem exigir chaves individuais ao utilizador.
