# Progress - Mirra AI Portal Front

## Resumo do Sistema

Front-end Vue 3 para o **Mirra AI**, sistema de geração automática de conteúdo para plataformas como WordPress e Instagram. Comunica-se com a API REST em `https://mirra-portal-api-dev.azurewebsites.net`.

**Hierarquia principal:** Plataforma → Configuração → Agendamento (relação N:N).

## PlatformId - IMPORTANTE

Os IDs de plataforma usados pela API são:
- **1 = WordPress**
- **2 = Instagram** (back-end ainda não implementado)

Isso foi corrigido nesta sessão. O código original usava 0 e 1, mas a API retorna 1 e 2.

## O que foi feito na sessão anterior (sessão 1)

### 1. Dashboard (HomeView.vue) - Redesenhado
- Removido o card "Sites WordPress" (era redundante)
- Card **"Configurações"**: clicável, faz scroll suave até a lista de configurações abaixo
- Card **"Agendamentos Ativos"**: clicável, navega para `/schedulings` (view dedicada)
- Abaixo dos cards: lista de todas as configurações com cards expansíveis
  - Cada config mostra: ícone da plataforma, URL, usuário, badge com contagem de agendamentos
  - Ao expandir: lista de agendamentos clicáveis (router-link para edição) + botão "Novo Agendamento"
- Botão "+ Nova Configuração" abre o modal (via provide/inject do AppLayout)
- Estado vazio com CTA para criar primeira configuração
- `expandedConfigs` é um **array** (permite múltiplas configs abertas simultaneamente)

### 2. SchedulingsView.vue - NOVA VIEW (src/views/SchedulingsView.vue)
- Rota: `/schedulings` (name: 'Schedulings')
- Lista flat de **todos os agendamentos de todas as configurações**
- Cada card mostra: título, descrição, tags (plataforma, URL da config, cron)
- Cada card é link para o formulário de edição
- Link "Dashboard" no topo para voltar
- Estado vazio tratado

### 3. Sidebar (AppSidebar.vue)
- **Logo substituído** por texto "MIRRA AI" (negrito, caixa alta, `<router-link to="/">`)
- Removido `import logo` e referência à imagem
- **PlatformIds corrigidos**: WordPress=1, Instagram=2 (antes era 0 e 1)
- WordPress já vem expandido no mount (`expandedPlatform = 1`)
- Agora as configurações existentes aparecem corretamente sob WordPress

### 4. Nomenclatura desambiguada
- "Configurações" no footer da sidebar e dropdown do header → renomeado para **"Preferências"**
- Isso evita confusão entre "configurações de plataforma" e "preferências do sistema"
- SettingsView.vue atualizado com título "Preferências"

### 5. PlatformIcon.vue - IDs corrigidos
- SVG WordPress: `v-if="platformId === 1"` (antes era 0)
- SVG Instagram: `v-else-if="platformId === 2"` (antes era 1)
- Computed `platformName` já estava correto (foi alterado antes desta sessão)

### 6. AppLayout.vue - Provide/Inject
- Adicionado `provide()` com `openNewConfigurationModal` para que views filhas (HomeView) possam abrir o modal de nova configuração sem precisar de event bus

## Arquivos modificados nesta sessão

- `src/views/HomeView.vue` - Redesenhado completamente
- `src/views/SchedulingsView.vue` - **NOVO**
- `src/components/layout/AppSidebar.vue` - Logo, PlatformIds, nomenclatura
- `src/components/layout/AppLayout.vue` - provide/inject
- `src/components/layout/AppHeader.vue` - "Configurações" → "Preferências"
- `src/components/configuration/PlatformIcon.vue` - PlatformIds corrigidos
- `src/views/SettingsView.vue` - Título "Preferências"
- `src/router/index.js` - Rota `/schedulings` adicionada

## Arquivos NÃO modificados (mas relevantes)

- `src/components/configuration/ConfigurationForm.vue` - Já estava com IDs corretos (1, 2)
- `src/components/configuration/ConfigurationCard.vue` - Já estava com IDs corretos
- `src/composables/useConfigurations.js` - Estado global compartilhado (ref reativa)
- `src/composables/useSchedulings.js` - CRUD de agendamentos por configuração
- `src/services/configurationService.js` - Chamadas API de configuração
- `src/services/schedulingService.js` - Chamadas API de agendamentos

## Funcionalidades ainda placeholder/pendentes

- **SettingsView** (Preferências): mostra "em breve"
- **ProfileView**: mostra dados do usuário, mas edição é "em breve"
- **Instagram**: marcado como "Em breve" no sidebar, desabilitado
- **Logout**: funcional (limpa localStorage, redireciona para login)
- **Auth completo**: Login, Register, Activate - tudo funcional

## O que foi feito na sessão atual (sessão 2)

### 1. Dashboard - Cards como Tabs/Filtros (HomeView.vue)
- Cards "Configurações" e "Agendamentos" agora funcionam como **tabs** que alternam a visualização abaixo
- **Antes**: "Configurações" fazia scroll, "Agendamentos" navegava para `/schedulings`
- **Agora**: ambos mudam o `activeTab` (data) e a seção abaixo exibe o conteúdo correspondente
- Estado `activeTab: 'configurations'` (default) ou `'schedulings'`
- Card ativo recebe destaque visual (`stat-card--active`: borda azul + label colorido)
- Setas de navegação removidas dos cards (não fazem mais sentido como tabs)
- **Tab Configurações**: mesma lista expansível de antes
- **Tab Agendamentos**: lista flat de todos os agendamentos (inline, sem sair do dashboard)
  - Cada card mostra: título, descrição, tags (plataforma, URL, cron), seta de navegação
  - Estado vazio tratado ("Nenhum agendamento encontrado")
- Transição **fade** suave entre tabs (`<transition name="fade" mode="out-in">`)
- Computed `allSchedulings` adicionado (mesma lógica do `SchedulingsView.vue`)
- Método `scrollToConfigurations()` removido (não mais necessário)

### Arquivos modificados nesta sessão
- `src/views/HomeView.vue` - Tabs no dashboard + seção agendamentos inline
- `progress.md` - Atualizado

### Notas
- A rota `/schedulings` e `SchedulingsView.vue` continuam existindo e funcionais (acesso direto)
- Nenhuma nova dependência adicionada

## Estado do build

- Lint: OK (sem erros)
- Build: pendente de teste manual
- Nenhum commit foi feito nesta sessão
