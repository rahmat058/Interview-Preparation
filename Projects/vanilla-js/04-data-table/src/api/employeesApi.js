const DATA_URL = '/data/employees.json'
const MIN_LATENCY = 250

/** @param {AbortSignal} [signal] */
export async function fetchEmployees(signal) {
  const delay = MIN_LATENCY + Math.random() * 300
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, delay)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })

  const res = await fetch(DATA_URL, { signal })
  if (!res.ok) throw new Error(`Failed to load employees (${res.status})`)
  const json = await res.json()
  return {
    employees: json.data,
    datasetMeta: {
      departments: json.meta.departments,
      roles: json.meta.roles,
      statuses: json.meta.statuses,
      locations: json.meta.locations,
    },
  }
}
