const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function deleteItem(itemName: string): Promise<{ success: boolean; itemName: string }> {
  await delay(700 + Math.random() * 500)
  return { success: true, itemName }
}

export async function saveProfile(data: {
  name: string
  email: string
}): Promise<{ id: string; name: string; email: string }> {
  await delay(600 + Math.random() * 400)
  return { id: `usr_${crypto.randomUUID().slice(0, 8)}`, ...data }
}
