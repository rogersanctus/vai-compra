export function formatPrice(num: number) {
  const formatter = Intl.NumberFormat(undefined, {
    currency: 'USD',
    style: 'currency'
  })

  return formatter.format(num)
}
