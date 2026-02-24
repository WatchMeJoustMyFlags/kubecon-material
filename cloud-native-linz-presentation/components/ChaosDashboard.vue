<template>
  <div class="grid grid-cols-2 gap-6 h-full p-6">
    <!-- Left column: controls -->
    <div class="flex flex-col gap-4">
      <h2 class="text-2xl font-bold text-white">Chaos Mode</h2>

      <!-- Status badge -->
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-400">Status:</span>
        <span
          class="px-3 py-1 rounded-full text-sm font-semibold"
          :class="statusBadgeClass"
        >
          {{ statusLabel }}
        </span>
        <span v-if="activeFraction !== null" class="text-sm text-gray-400">
          ({{ activeFraction }}% affected)
        </span>
        <span v-if="fetchError" class="text-sm text-red-400">{{ fetchError }}</span>
      </div>

      <!-- Fault buttons -->
      <div class="flex flex-col gap-2">
        <p class="text-xs text-gray-500 uppercase tracking-wider">Inject Fault</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="fault in faults"
            :key="fault.id"
            class="px-3 py-2 rounded text-sm font-medium bg-red-700 hover:bg-red-600 text-white transition-colors"
            @click="injectFault(fault.id)"
          >
            {{ fault.label }}
          </button>
        </div>
      </div>

      <!-- Fraction slider -->
      <div class="flex flex-col gap-1">
        <label class="text-xs text-gray-500 uppercase tracking-wider">
          Fraction: <span class="text-white font-semibold">{{ fraction }}%</span>
        </label>
        <input
          v-model.number="fraction"
          type="range"
          min="1"
          max="100"
          class="w-full accent-teal-400"
        />
      </div>

      <!-- Reset button -->
      <button
        class="mt-auto px-4 py-2 rounded text-sm font-semibold bg-gray-600 hover:bg-gray-500 text-white transition-colors"
        @click="resetChaos"
      >
        Reset All Faults
      </button>
    </div>

    <!-- Right column: raw JSON -->
    <div class="flex flex-col gap-2 min-h-0">
      <p class="text-xs text-gray-500 uppercase tracking-wider">Raw flagd Status</p>
      <pre class="flex-1 bg-gray-900 rounded p-3 text-xs text-green-300 font-mono overflow-auto">{{ rawJson }}</pre>
      <div v-if="lastAction" class="text-xs font-mono">
        <span :class="lastAction.ok ? 'text-green-400' : 'text-red-400'">
          {{ lastAction.method }} {{ lastAction.url }} → {{ lastAction.status }}
        </span>
        <span v-if="lastAction.body" class="text-gray-400 ml-2">{{ lastAction.body }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const faults = [
  { id: "poll-drop", label: "Poll Drop" },
  { id: "accel-spike", label: "Acceleration Spike" },
  { id: "led-failure", label: "LED Flicker" },
  { id: "disconnect", label: "Disconnect" },
];

const fraction = ref(50);
const status = ref({});
const fetchError = ref(null);
const lastAction = ref(null);
let pollInterval = null;

const rawJson = computed(() => {
  return JSON.stringify(status.value, null, 2);
});

const activeFault = computed(() => {
  const targeting = status.value?.targeting?.fractional;
  if (targeting) {
    const pairs = targeting.filter(Array.isArray);
    const nonNone = pairs.find(([variant]) => variant !== "none");
    return nonNone ? nonNone[0] : "none";
  }
  return status.value?.defaultVariant ?? "none";
});

const activeFraction = computed(() => {
  const targeting = status.value?.targeting?.fractional;
  if (!targeting) return null;
  const pairs = targeting.filter(Array.isArray);
  const nonNone = pairs.find(([variant]) => variant !== "none");
  return nonNone ? nonNone[1] : null;
});

const statusBadgeClass = computed(() => {
  if (fetchError.value) return "bg-gray-700 text-gray-400";
  if (activeFault.value === "none") return "bg-green-700 text-green-200";
  return "bg-red-700 text-red-200";
});

const statusLabel = computed(() => {
  if (fetchError.value) return "unknown";
  return activeFault.value === "none" ? "none" : activeFault.value.replace(/_/g, " ");
});

async function fetchStatus() {
  try {
    const res = await fetch("/chaos/status");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    status.value = (await res.json()) ?? {};
    fetchError.value = null;
  } catch (e) {
    fetchError.value = e.message || String(e) || "Connection failed";
  }
}

async function injectFault(faultId) {
  const url = fraction.value < 100
    ? `/chaos/${faultId}?fraction=${fraction.value}`
    : `/chaos/${faultId}`;
  try {
    const res = await fetch(url, { method: "POST" });
    const body = await res.text().catch(() => "");
    lastAction.value = { method: "POST", url, status: res.status, ok: res.ok, body };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await fetchStatus();
  } catch (e) {
    if (!lastAction.value) lastAction.value = { method: "POST", url, error: String(e) };
    fetchError.value = e.message || String(e) || "Connection failed";
  }
}

async function resetChaos() {
  lastAction.value = null;
  try {
    await fetch("/chaos/reset", { method: "POST" });
    await fetchStatus();
  } catch (e) {
    fetchError.value = e.message || String(e) || "Connection failed";
  }
}

onMounted(() => {
  fetchStatus();
  pollInterval = setInterval(fetchStatus, 2000);
});

onUnmounted(() => {
  clearInterval(pollInterval);
});
</script>
