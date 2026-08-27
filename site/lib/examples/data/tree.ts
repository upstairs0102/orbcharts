import type { ExampleDatum } from '../types'

/**
 * HierarchyPlot 共用資料 — 公司營收組成（單位：萬美元）
 * 三層結構：公司 → 產品線 → 產品（以 parent 欄位表達層級）
 * → TreeMap
 */
export const treeData: ExampleDatum[] = [
  { id: 'acme', name: 'Acme Corp', value: null, series: '' },
  // 產品線
  { id: 'software', name: 'Software', parent: 'acme', value: null, series: 'Software' },
  { id: 'hardware', name: 'Hardware', parent: 'acme', value: null, series: 'Hardware' },
  { id: 'services', name: 'Services', parent: 'acme', value: null, series: 'Services' },
  { id: 'subscriptions', name: 'Subscriptions', parent: 'acme', value: null, series: 'Subscriptions' },
  // Software
  { id: 'crm', name: 'CRM Suite', parent: 'software', value: 480, series: 'Software' },
  { id: 'analytics-platform', name: 'Analytics Platform', parent: 'software', value: 350, series: 'Software' },
  { id: 'mobile-sdk', name: 'Mobile SDK', parent: 'software', value: 120, series: 'Software' },
  { id: 'api-tools', name: 'API Tools', parent: 'software', value: 95, series: 'Software' },
  // Hardware
  { id: 'edge-server', name: 'Edge Server', parent: 'hardware', value: 410, series: 'Hardware' },
  { id: 'iot-sensor', name: 'IoT Sensor', parent: 'hardware', value: 260, series: 'Hardware' },
  { id: 'gateway-device', name: 'Gateway Device', parent: 'hardware', value: 180, series: 'Hardware' },
  // Services
  { id: 'consulting', name: 'Consulting', parent: 'services', value: 300, series: 'Services' },
  { id: 'support', name: 'Support Plans', parent: 'services', value: 220, series: 'Services' },
  { id: 'training', name: 'Training', parent: 'services', value: 90, series: 'Services' },
  // Subscriptions
  { id: 'cloud-enterprise', name: 'Enterprise', parent: 'subscriptions', value: 520, series: 'Subscriptions' },
  { id: 'cloud-pro', name: 'Cloud Pro', parent: 'subscriptions', value: 380, series: 'Subscriptions' },
  { id: 'cloud-basic', name: 'Cloud Basic', parent: 'subscriptions', value: 150, series: 'Subscriptions' },
]
