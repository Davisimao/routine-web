# Projeto Minha Rotina

## Regras de UI

- A interface usa shadcn/ui como design system principal.
- Antes de criar um controle visual, procurar primeiro um componente shadcn existente ou montar o padrão oficial dele.
- Para datas, não usar `<input type="date">` diretamente. Usar o padrão shadcn `Popover` + `Calendar` + botão de seleção formatado.
- Para modais, usar `Dialog` do shadcn.
- Para ações, usar `Button`; para blocos, usar `Card`; para estados curtos, usar `Badge`; para progresso, usar `Progress`.
- Preferir tokens semânticos (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`) em vez de cores fixas como `bg-white`, `bg-gray-*`, `text-gray-*` ou `indigo-*`.
- Todo componente novo deve funcionar nos temas claro e escuro.
- O modo claro/escuro deve ser testado após recarregar a página.
- Usar ícones Lucide em controles; não usar emojis como ícones de interface, exceto quando o emoji for o conteúdo escolhido pelo usuário.

## Fluxo de implementação

- Identificar primeiro o componente ativo e o caminho real usado pelo entrypoint antes de editar.
- Reaproveitar componentes existentes em `src/components/ui` e `src/lib/utils.ts`.
- Após cada alteração significativa, executar `npm run build`.
- Testar visualmente os estados claro e escuro quando a alteração envolver UI.
- Não executar deploy na Vercel automaticamente. Só fazer deploy quando o usuário pedir explicitamente.
- Não alterar dados do Firestore durante testes sem avisar e sem limpar registros de teste quando possível.

## Dados e histórico

- A data inicial escolhida no cadastro é `startDate` no formato local `YYYY-MM-DD`.
- Rotinas não devem aparecer nem contar em tarefas ou métricas antes de `startDate`.
- Rotinas antigas sem `startDate` usam `createdAt` como fallback.
