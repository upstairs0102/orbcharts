import type { ExampleDatum } from '../types'

/**
 * NetworkPlot 共用資料 — 微服務依賴圖
 * 節點：value = 每分鐘請求量；series = 服務分群
 * 邊：source → target 表示「呼叫」關係；value = 呼叫頻率
 * → Force Graph / Network Bubble
 */
export const networkData: ExampleDatum[] = [
  // 節點
  { id: 'gateway', name: 'API Gateway', value: 12000, series: 'Gateway' },
  { id: 'auth', name: 'Auth Service', value: 8500, series: 'Core' },
  { id: 'user', name: 'User Service', value: 5200, series: 'Core' },
  { id: 'product', name: 'Product Service', value: 7800, series: 'Commerce' },
  { id: 'search', name: 'Search Service', value: 6400, series: 'Commerce' },
  { id: 'cart', name: 'Cart Service', value: 4100, series: 'Commerce' },
  { id: 'order', name: 'Order Service', value: 3600, series: 'Commerce' },
  { id: 'payment', name: 'Payment Service', value: 2900, series: 'Commerce' },
  { id: 'inventory', name: 'Inventory Service', value: 3300, series: 'Commerce' },
  { id: 'shipping', name: 'Shipping Service', value: 1800, series: 'Commerce' },
  { id: 'notify', name: 'Notification Service', value: 2400, series: 'Infra' },
  { id: 'analytics', name: 'Analytics', value: 5600, series: 'Infra' },
  { id: 'cache', name: 'Cache (Redis)', value: 9800, series: 'Infra' },
  { id: 'mq', name: 'Message Queue', value: 4700, series: 'Infra' },
  // 邊（依賴關係）
  { id: 'e1', source: 'gateway', target: 'auth', value: 80, series: 'Gateway' },
  { id: 'e2', source: 'gateway', target: 'product', value: 70, series: 'Gateway' },
  { id: 'e3', source: 'gateway', target: 'search', value: 60, series: 'Gateway' },
  { id: 'e4', source: 'gateway', target: 'cart', value: 45, series: 'Gateway' },
  { id: 'e5', source: 'gateway', target: 'order', value: 35, series: 'Gateway' },
  { id: 'e6', source: 'auth', target: 'user', value: 55, series: 'Core' },
  { id: 'e7', source: 'auth', target: 'cache', value: 65, series: 'Core' },
  { id: 'e8', source: 'search', target: 'product', value: 50, series: 'Commerce' },
  { id: 'e9', source: 'cart', target: 'product', value: 40, series: 'Commerce' },
  { id: 'e10', source: 'cart', target: 'inventory', value: 30, series: 'Commerce' },
  { id: 'e11', source: 'order', target: 'payment', value: 28, series: 'Commerce' },
  { id: 'e12', source: 'order', target: 'inventory', value: 26, series: 'Commerce' },
  { id: 'e13', source: 'order', target: 'shipping', value: 22, series: 'Commerce' },
  { id: 'e14', source: 'order', target: 'mq', value: 32, series: 'Commerce' },
  { id: 'e15', source: 'payment', target: 'mq', value: 18, series: 'Commerce' },
  { id: 'e16', source: 'mq', target: 'notify', value: 38, series: 'Infra' },
  { id: 'e17', source: 'mq', target: 'analytics', value: 42, series: 'Infra' },
  { id: 'e18', source: 'product', target: 'cache', value: 58, series: 'Commerce' },
]
