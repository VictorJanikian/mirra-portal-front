<template>
  <div class="scheduling-form fade-in">
    <h2 class="scheduling-form__title">{{ isEditing ? 'Editar Agendamento' : 'Novo Agendamento' }}</h2>

    <form @submit.prevent="handleSubmit" class="scheduling-form__fields">
      <BaseInput
        v-model="formData.ThemeTitle"
        label="Título do Tema"
        tooltip="O tema geral do blog. Define o assunto principal sobre o qual a IA irá gerar conteúdo."
        placeholder="Ex: Marketing Digital para Pequenas Empresas"
      />

      <BaseTextarea
        v-model="formData.Description"
        label="Descrição"
        tooltip="O guia editorial principal. Pode representar um recorte específico do tema ou o ângulo editorial a ser seguido. É a principal bússola para a geração de conteúdo."
        placeholder="Descreva o foco editorial do conteúdo..."
        :rows="3"
      />

      <BaseInput
        v-model="formData.SearchIntent"
        label="Intenção de Busca"
        tooltip="O que o usuário espera encontrar ao pesquisar sobre o tema. Ajuda a adequar o conteúdo às expectativas de quem busca informações no Google."
        placeholder="Ex: Como aumentar vendas online"
      />

      <BaseInput
        v-model="formData.Keywords"
        label="Palavras-chave"
        tooltip="Termos principais para SEO. A IA usará essas palavras e suas variações semânticas para otimizar o conteúdo para mecanismos de busca."
        placeholder="Ex: marketing digital, vendas online, SEO"
      />

      <BaseInput
        v-model="formData.TargetAudience"
        label="Público-alvo"
        tooltip="Para quem o conteúdo é destinado. Define a linguagem, profundidade e abordagem do texto gerado."
        placeholder="Ex: Empreendedores iniciantes"
      />

      <BaseInput
        v-model="formData.Style"
        label="Estilo"
        tooltip="O tom e estilo de linguagem do texto. Exemplos: formal, irreverente, técnico, acadêmico, descontraído, etc."
        placeholder="Ex: Informativo e acessível"
      />

      <BaseInput
        v-model="formData.Goal"
        label="Objetivo"
        tooltip="O que você deseja alcançar com o conteúdo. Exemplos: converter visitantes em assinantes, educar o leitor, gerar engajamento, etc."
        placeholder="Ex: Gerar leads qualificados"
      />

      <BaseInput
        v-model="formData.CTA"
        label="CTA (Call to Action)"
        tooltip="Chamada para ação opcional. Se informado, será integrado naturalmente ao final do texto como consequência lógica do argumento, sem linguagem promocional excessiva."
        placeholder="Ex: Assine nossa newsletter"
      />

      <BaseInput
        v-model="formData.ApproximatedSize"
        label="Tamanho Aproximado"
        tooltip="Quantidade aproximada de palavras do texto gerado. A IA tentará se aproximar desse número, aceitando pequenas variações naturais."
        placeholder="Ex: 1500"
      />

      <BaseTextarea
        v-model="formData.AdditionalInfo"
        label="Informações Adicionais"
        tooltip="Contexto extra, definições conceituais ou informações específicas que a IA deve considerar ao gerar o conteúdo."
        placeholder="Informações extras para orientar a geração..."
        :rows="3"
      />

      <BaseTextarea
        v-model="formData.SEOAdditionalInformation"
        label="SEO"
        tooltip="Instruções específicas de SEO, como meta descriptions otimizadas, alt texts para imagens, ou outras diretrizes de otimização para buscadores."
        placeholder="Instruções adicionais de SEO..."
        :rows="3"
      />

      <BaseInput
        v-model="formData.Language"
        label="Idioma"
        tooltip="O idioma em que o conteúdo será gerado. Use códigos como pt-BR (português brasileiro) ou en-US (inglês americano)."
        placeholder="Ex: pt-BR"
      />

      <CronBuilder
        v-model="cronExpression"
      />

      <div class="scheduling-form__actions">
        <BaseButton type="submit" :loading="loading">
          Salvar
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CronBuilder from './CronBuilder.vue'

export default {
  name: 'SchedulingForm',
  components: { BaseInput, BaseTextarea, BaseButton, CronBuilder },
  props: {
    scheduling: { type: Object, default: null },
    loading: { type: Boolean, default: false }
  },
  emits: ['submit'],
  data() {
    const params = this.scheduling?.Parameters || {}
    return {
      formData: {
        ThemeTitle: params.ThemeTitle || '',
        Description: params.Description || '',
        SearchIntent: params.SearchIntent || '',
        Keywords: params.Keywords || '',
        TargetAudience: params.TargetAudience || '',
        Style: params.Style || '',
        Goal: params.Goal || '',
        CTA: params.CTA || '',
        ApproximatedSize: params.ApproximatedSize || '',
        AdditionalInfo: params.AdditionalInfo || '',
        SEOAdditionalInformation: params.SEOAdditionalInformation || '',
        Language: params.Language || 'pt-BR'
      },
      cronExpression: this.scheduling?.Interval || '* * * * *'
    }
  },
  computed: {
    isEditing() {
      return !!this.scheduling?.Id
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', {
        ...this.formData,
        cronExpression: this.cronExpression
      })
    }
  },
  watch: {
    scheduling: {
      handler(val) {
        if (val) {
          const params = val.Parameters || {}
          this.formData = {
            ThemeTitle: params.ThemeTitle || '',
            Description: params.Description || '',
            SearchIntent: params.SearchIntent || '',
            Keywords: params.Keywords || '',
            TargetAudience: params.TargetAudience || '',
            Style: params.Style || '',
            Goal: params.Goal || '',
            CTA: params.CTA || '',
            ApproximatedSize: params.ApproximatedSize || '',
            AdditionalInfo: params.AdditionalInfo || '',
            SEOAdditionalInformation: params.SEOAdditionalInformation || '',
            Language: params.Language || 'pt-BR'
          }
          this.cronExpression = val.Interval || '* * * * *'
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.scheduling-form {
  flex: 1;
  padding-left: 32px;
  min-width: 0;
}

.scheduling-form__title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-xl);
  color: var(--color-gray-900);
}

.scheduling-form__fields {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.scheduling-form__actions {
  margin-top: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-sm);
}

@media (max-width: 992px) {
  .scheduling-form {
    padding-left: 0;
    margin-top: var(--spacing-lg);
  }
}
</style>
