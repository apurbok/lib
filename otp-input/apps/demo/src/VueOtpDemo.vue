<script setup lang="ts">
import { ref } from "vue";
import { OtpInput } from "@libraries/vue-otp-input";

const code = ref("");
const complete = ref<string | null>(null);
</script>

<template>
  <section class="demo-section">
    <h2>Vue 3</h2>
    <OtpInput
      v-model="code"
      :length="6"
      label="Verification code"
      auto-focus
      @complete="complete = $event"
    />
    <p class="demo-meta">
      Value: <code>{{ code || "—" }}</code>
      <template v-if="complete">
        · Complete: <code>{{ complete }}</code>
      </template>
    </p>
  </section>
</template>
