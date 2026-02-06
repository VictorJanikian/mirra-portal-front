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

## Arquivos NÃO modificados na sessão 1 (mas relevantes)

- `src/components/configuration/ConfigurationForm.vue` - Já estava com IDs corretos (1, 2)
- `src/components/configuration/ConfigurationCard.vue` - Já estava com IDs corretos
- `src/composables/useConfigurations.ts` - Estado global compartilhado (ref reativa)
- `src/composables/useSchedulings.ts` - CRUD de agendamentos por configuração
- `src/services/configurationService.ts` - Chamadas API de configuração
- `src/services/schedulingService.ts` - Chamadas API de agendamentos

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

### 2. Migração completa JavaScript → TypeScript

**Todo o projeto foi migrado de JavaScript para TypeScript.**

#### O que mudou:
- **Linguagem**: JavaScript → TypeScript com `strict: true`
- **Tooling**: Adicionado `@vue/cli-plugin-typescript`, `typescript`, `@vue/eslint-config-typescript`
- **Config**: `jsconfig.json` substituído por `tsconfig.json`
- **ESLint**: Parser trocado de `@babel/eslint-parser` para `@typescript-eslint/parser`

#### Novos arquivos criados:
- `tsconfig.json` — configuração TypeScript
- `src/shims-vue.d.ts` — declaração de módulos .vue
- `src/shims-assets.d.ts` — declaração de módulos de imagem (png, jpg, svg)
- `src/types/index.ts` — interfaces centrais do sistema

#### Interfaces definidas em `src/types/index.ts`:
- `User`, `AuthResponse`, `AuthToken`
- `Configuration`, `ConfigurationCreatePayload`
- `Scheduling`, `SchedulingParameters`, `SchedulingPayload`
- `Toast`, `ToastType`
- `SelectOption`, `CronFields`
- Augmentação de `RouteMeta` do vue-router (`requiresAuth`, `guest`)

#### Arquivos JS convertidos para TS (12):
- `src/main.js` → `src/main.ts`
- `src/router/index.js` → `src/router/index.ts`
- `src/utils/validators.js` → `.ts`
- `src/utils/cronParser.js` → `.ts`
- `src/services/api.js` → `.ts`
- `src/services/authService.js` → `.ts`
- `src/services/configurationService.js` → `.ts`
- `src/services/schedulingService.js` → `.ts`
- `src/composables/useAuth.js` → `.ts`
- `src/composables/useToast.js` → `.ts`
- `src/composables/useConfigurations.js` → `.ts`
- `src/composables/useSchedulings.js` → `.ts`

#### Componentes Vue convertidos (29):
Todos os `.vue` receberam `<script lang="ts">`, `defineComponent()` wrapper e tipagem adequada:
- **UI base (8):** BaseTooltip, BaseButton, BaseModal, BaseInput, BaseTextarea, BaseSelect, BaseMultiSelect, ToastContainer
- **Configuration (3):** PlatformIcon, ConfigurationCard, ConfigurationForm
- **Scheduling (5):** CronFieldSelect, CronPreview, CronBuilder, SchedulingList, SchedulingForm
- **Auth (1):** AuthCard
- **Layout (3):** AppHeader, AppSidebar, AppLayout
- **Views (8):** LoginView, RegisterView, ActivateView, SettingsView, ProfileView, SchedulingsView, SchedulingFormView, HomeView
- **Root (1):** App.vue

#### Arquivos deletados:
- `jsconfig.json` — substituído por tsconfig.json
- Todos os `.js` em `src/` — substituídos por `.ts`

#### Padrões TypeScript adotados:
- `defineComponent()` em todos os componentes Vue (Options API mantida)
- `PropType<T>` para props de array/object
- `Ref<T>` tipados nos composables
- `AxiosResponse<T>` nos retornos dos services
- `catch (e: unknown)` com assertions para erros
- Computed `api` wrapper em SchedulingFormView para evitar non-null assertions

## Stack Atual

- **Framework:** Vue 3 + Vue Router 4
- **Linguagem:** TypeScript (strict mode)
- **HTTP:** Axios
- **Tooling:** Vue CLI 5 (Webpack), Babel, ESLint + @typescript-eslint
- **Sem:** Vuex/Pinia (usa composables), CSS framework, testes

### 3. Rename "Configuração" → "Conexão" (user-facing)

Todos os textos visíveis ao usuário que diziam "configuração/configurações" foram alterados para "conexão/conexões". Identificadores de código (nomes de componentes, tipos, variáveis) foram mantidos como `Configuration` para manter alinhamento com a API.

#### Arquivos alterados:
- `src/views/HomeView.vue` — labels dos stat cards, títulos de seção, CTAs, empty states
- `src/views/SchedulingsView.vue` — subtítulo e empty state
- `src/components/layout/AppLayout.vue` — título do modal "Nova Conexão", toast "Conexão criada com sucesso!"
- `src/components/configuration/ConfigurationForm.vue` — labels internos (se existiam referências)
- `src/composables/useConfigurations.ts` — mensagem de erro "Erro ao carregar conexões"

### 4. Bug fix: formulário não limpava ao criar novo agendamento

**Problema:** Ao visualizar um agendamento existente e depois clicar em "+ Criar novo" (dentro do SchedulingList), o formulário mantinha os dados do agendamento anterior.

**Causa:** O watcher de `scheduling` no `SchedulingForm.vue` só tratava o caso `if (val)` (agendamento existente) mas não tinha um `else` para resetar os campos quando `scheduling` se tornava `null` (novo agendamento).

**Fix:** Adicionado branch `else` no watcher que reseta todos os campos do `formData` para vazio e o `cronExpression` para `'* * * * *'`.

**Arquivo:** `src/components/scheduling/SchedulingForm.vue` — watcher `scheduling.handler()`

### 5. Bug fix: botão "+ Novo Agendamento" no sidebar não funcionava

**Problema:** Estando na tela de edição de um agendamento (`SchedulingFormView`), clicar no link "+ Novo Agendamento" no sidebar (AppSidebar) não fazia nada — o formulário permanecia com os dados do agendamento atual.

**Causa (raiz — duas camadas):**
1. **Componente não recarregava:** O sidebar usa `<router-link :to="/configurations/${config.Id}/schedulings/new">`. Quando já se está no `SchedulingFormView`, o Vue Router muda a rota mas **não re-renderiza o componente** (mesmo componente, params diferentes). **Fix:** Adicionado watcher em `schedulingId` que chama `this.loadData()`.
2. **`loadData()` não resetava o form:** A rota `SchedulingCreate` tem path fixo `.../schedulings/new` (sem `:schedulingId`), então com `props: true` o prop `schedulingId` chega como `null` (default). O código tinha `else if (this.schedulingId === 'new')` que nunca matchava `null`. **Fix:** Trocado `else if (this.schedulingId === 'new')` por `else` simples.
3. **Componente não recriava:** Mesmo com as correções acima, o Vue poderia não recriar o `SchedulingForm` filho. **Fix:** Adicionado `:key="currentSchedulingId ?? 'new'"` no `SchedulingForm` para forçar recriação quando muda de edição para criação.

**Arquivos:** `src/views/SchedulingFormView.vue` — watcher `schedulingId`, condição `else` no `loadData()`, `:key` no template

### Armadilha importante do router (para referência futura)

As rotas `SchedulingCreate` e `SchedulingEdit` usam o **mesmo componente** mas paths diferentes:
```
configurations/:configId/schedulings/new            → SchedulingCreate (NÃO tem :schedulingId)
configurations/:configId/schedulings/:schedulingId  → SchedulingEdit (TEM :schedulingId)
```
Com `props: true`, na rota `SchedulingCreate` o prop `schedulingId` fica `null`, NÃO `'new'`. Qualquer lógica que dependa de `schedulingId === 'new'` não funciona — precisa tratar `null` também.

## Nomenclatura: código vs UI

| Conceito | No código (tipos, variáveis, componentes) | Na UI (textos visíveis ao usuário) |
|----------|--------------------------------------------|------------------------------------|
| Plataforma + credenciais | `Configuration`, `ConfigurationForm`, etc. | **Conexão / Conexões** |
| Preferências do sistema | `SettingsView` | **Preferências** |

## Funcionalidades ainda placeholder/pendentes

- **SettingsView** (Preferências): mostra "em breve"
- **ProfileView**: mostra dados do usuário, mas edição é "em breve"
- **Instagram**: marcado como "Em breve" no sidebar, desabilitado
- **Nenhum commit foi feito** — todas as mudanças das sessões 2 e 3 estão unstaged

## Estado do build

- Lint: OK (sem erros)
- Build: OK (compilado com sucesso)
- **Nenhum commit foi feito nas sessões 2 e 3** — considerar commitar no início da próxima sessão
