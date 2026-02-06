<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Decorative panel -->
      <div class="auth-panel">
        <div class="auth-panel__bg">
          <!-- Animated floating nodes -->
          <div class="node node--1"></div>
          <div class="node node--2"></div>
          <div class="node node--3"></div>
          <div class="node node--4"></div>
          <div class="node node--5"></div>
          <div class="node node--6"></div>
          <div class="node node--7"></div>

          <!-- Connection lines (SVG) -->
          <svg class="connections" viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line class="conn conn--1" x1="80" y1="120" x2="260" y2="200" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
            <line class="conn conn--2" x1="260" y1="200" x2="400" y2="150" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
            <line class="conn conn--3" x1="260" y1="200" x2="180" y2="380" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
            <line class="conn conn--4" x1="180" y1="380" x2="380" y2="420" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
            <line class="conn conn--5" x1="380" y1="420" x2="320" y2="520" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
            <line class="conn conn--6" x1="80" y1="120" x2="120" y2="300" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
            <line class="conn conn--7" x1="400" y1="150" x2="380" y2="420" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
          </svg>

          <!-- Soft radial glow -->
          <div class="glow glow--1"></div>
          <div class="glow glow--2"></div>
        </div>

        <div class="auth-panel__content">
          <img :src="logo" alt="Mirra AI" class="auth-panel__logo" />
          <p class="auth-panel__tagline">AI for the ambitious.</p>
        </div>
      </div>

      <!-- Form card -->
      <div class="auth-card">
        <div class="auth-card__logo-mobile">
          <img :src="logo" alt="Mirra AI" class="auth-card__logo-img" />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/mirra-logo.png'

export default {
  name: 'AuthCard',
  data() {
    return { logo }
  }
}
</script>

<style scoped>
/* ── Page ── */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-50);
  padding: var(--spacing-md);
}

.auth-container {
  display: flex;
  width: 100%;
  max-width: 960px;
  min-height: 580px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06);
  animation: containerIn 0.5s ease both;
}

/* ── Decorative Panel ── */
.auth-panel {
  position: relative;
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.auth-panel__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Floating nodes */
.node {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.node--1 {
  width: 18px;
  height: 18px;
  top: 18%;
  left: 16%;
  animation: float 6s ease-in-out infinite;
}

.node--2 {
  width: 24px;
  height: 24px;
  top: 32%;
  left: 52%;
  background: rgba(96, 165, 250, 0.3);
  border-color: rgba(96, 165, 250, 0.4);
  animation: float 8s ease-in-out infinite 1s;
}

.node--3 {
  width: 14px;
  height: 14px;
  top: 22%;
  right: 18%;
  animation: float 7s ease-in-out infinite 0.5s;
}

.node--4 {
  width: 20px;
  height: 20px;
  bottom: 36%;
  left: 34%;
  background: rgba(147, 197, 253, 0.25);
  border-color: rgba(147, 197, 253, 0.3);
  animation: float 9s ease-in-out infinite 2s;
}

.node--5 {
  width: 16px;
  height: 16px;
  bottom: 28%;
  right: 22%;
  animation: float 7s ease-in-out infinite 1.5s;
}

.node--6 {
  width: 10px;
  height: 10px;
  bottom: 15%;
  left: 22%;
  animation: float 6s ease-in-out infinite 3s;
}

.node--7 {
  width: 12px;
  height: 12px;
  bottom: 12%;
  right: 34%;
  background: rgba(96, 165, 250, 0.2);
  animation: float 8s ease-in-out infinite 2.5s;
}

/* SVG connection lines */
.connections {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.conn {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawLine 2s ease forwards;
}

.conn--1 { animation-delay: 0.2s; }
.conn--2 { animation-delay: 0.5s; }
.conn--3 { animation-delay: 0.8s; }
.conn--4 { animation-delay: 1.1s; }
.conn--5 { animation-delay: 1.4s; }
.conn--6 { animation-delay: 1.7s; }
.conn--7 { animation-delay: 2.0s; }

/* Soft glows */
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.glow--1 {
  width: 260px;
  height: 260px;
  background: rgba(59, 130, 246, 0.35);
  top: 10%;
  left: -10%;
  animation: pulse 8s ease-in-out infinite;
}

.glow--2 {
  width: 200px;
  height: 200px;
  background: rgba(99, 102, 241, 0.3);
  bottom: 5%;
  right: -5%;
  animation: pulse 10s ease-in-out infinite 3s;
}

/* Panel content */
.auth-panel__content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: var(--spacing-2xl);
  animation: panelContentIn 0.7s ease 0.2s both;
}

.auth-panel__logo {
  height: 220px;
  filter: brightness(0) invert(1);
  margin-bottom: var(--spacing-lg);
  drop-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
}

.auth-panel__tagline {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-lg);
  line-height: 1.6;
  font-weight: 400;
  margin-top: -30px;
  letter-spacing: 0.01em;
}

/* ── Form Card ── */
.auth-card {
  background: var(--color-white);
  flex: 0 0 440px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-2xl);
  animation: cardIn 0.5s ease 0.15s both;
}

.auth-card__logo-mobile {
  display: none;
}

.auth-card__logo-img {
  height: 100px;
  margin: 0 auto var(--spacing-lg);
  display: block;
}

/* ── Animations ── */
@keyframes containerIn {
  from {
    opacity: 0;
    transform: scale(0.97) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes panelContentIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-12px) translateX(6px);
  }
  50% {
    transform: translateY(-6px) translateX(-4px);
  }
  75% {
    transform: translateY(-14px) translateX(8px);
  }
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.15);
  }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .auth-page {
    padding: 0;
    align-items: stretch;
  }

  .auth-container {
    flex-direction: column;
    max-width: 100%;
    min-height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }

  .auth-panel {
    flex: 0 0 auto;
    min-height: 200px;
  }

  .auth-panel__logo {
    height: 80px;
  }

  .auth-panel__tagline {
    font-size: var(--font-size-base);
  }

  .auth-card {
    flex: 1;
    padding: var(--spacing-xl) var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .auth-panel {
    display: none;
  }

  .auth-card__logo-mobile {
    display: block;
    text-align: center;
    margin-bottom: var(--spacing-lg);
  }
}
</style>
