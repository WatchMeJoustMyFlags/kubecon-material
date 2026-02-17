import { ref, computed } from 'vue'

// Global state - shared across all slides
const hostReachable = ref(null)
const manualOverride = ref(null)
const isChecking = ref(false)

// Toggle between iframe and fallback manually
function toggleFallback() {
  manualOverride.value = manualOverride.value === null
    ? false
    : !manualOverride.value
}

// Keyboard shortcut handler: press 'v' to toggle fallback/view
function handleKeydown(e) {
  if (e.key === 'v' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    const target = e.target
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      toggleFallback()
    }
  }
}

// Register keyboard listener globally once (outside composable function)
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}

export function useDemoHost() {
  // Check if demo host is reachable
  async function checkReachability(demoHost) {
    if (isChecking.value || hostReachable.value !== null) {
      return hostReachable.value
    }

    isChecking.value = true

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      await fetch(`http://${demoHost}/`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      hostReachable.value = true
    } catch {
      hostReachable.value = false
    } finally {
      isChecking.value = false
    }

    return hostReachable.value
  }

  // Show iframe if: manually overridden to true, OR (no override AND host is reachable)
  const showIframe = computed(() => {
    if (manualOverride.value !== null) {
      return manualOverride.value
    }
    return hostReachable.value === true
  })

  return {
    checkReachability,
    showIframe,
    toggleFallback,
    isChecking,
    manualOverride
  }
}
