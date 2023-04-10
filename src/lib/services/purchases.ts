import { Product } from '@/models/product'
import { prismaClient } from '../prisma'
import { getProduct } from './products'
import { CartProduct } from '@/models/cart'
import { connect, disconect, redis } from '../redis'

async function getProductCached(product_id: number) {
  const existing = await redis.get(`ext_product:${product_id}`)

  if (existing) {
    return JSON.parse(existing)
  }

  const product = await getProduct(product_id)
  redis.set(`ext_product:${product_id}`, JSON.stringify(product))

  return product
}

export async function createPurchase(userId: number) {
  const cart = await prismaClient.cart.findUnique({
    where: {
      user_id: userId
    },
    select: {
      id: true,
      products: true
    }
  })

  if (!cart) {
    throw new Error('no_cart_found')
  }

  if (cart.products.length === 0) {
    throw new Error('cart_is_empty')
  }

  prismaClient.$transaction(async (transaction) => {
    await transaction.userPurchase.create({
      data: {
        user_id: userId,
        products: {
          createMany: {
            data: cart.products.map((cartProduct) => ({
              product_external_id: cartProduct.product_external_id,
              amount: cartProduct.amount
            }))
          }
        }
      }
    })

    await transaction.cartProduct.deleteMany({
      where: {
        cart_id: cart.id
      }
    })
  })
}

export async function createPurchaseFromProductsList(
  userId: number,
  products: CartProduct[]
) {
  await prismaClient.userPurchase.create({
    data: {
      user_id: userId,
      products: {
        createMany: {
          data: products.map((product) => ({
            product_external_id: product.id,
            amount: product.amount
          }))
        }
      }
    }
  })
}

export async function getPurchase(purchase_id: number) {
  await connect()

  const existingPurchase = await redis.get(`purchase:${purchase_id}`)

  if (existingPurchase) {
    disconect()
    return JSON.parse(existingPurchase)
  }

  const purchase = await prismaClient.userPurchase.findUnique({
    where: {
      id: purchase_id
    },
    select: {
      products: {
        select: {
          amount: true,
          product_external_id: true
        }
      }
    }
  })

  if (!purchase) {
    disconect()
    return null
  }

  const mappedProductsPromises = purchase.products.map(
    async (purchaseProduct) => {
      const product = await getProductCached(
        purchaseProduct.product_external_id
      )

      delete (purchaseProduct as Partial<typeof purchaseProduct>)
        .product_external_id

      return {
        ...product,
        ...purchaseProduct
      }
    }
  )

  const products = await Promise.all(mappedProductsPromises)

  const mappedPurchase = {
    ...purchase,
    products
  }

  redis.set(`purchase:${purchase_id}`, JSON.stringify(mappedPurchase))
  disconect()
  return mappedPurchase
}

export async function getPurchases(userId: number) {
  connect()
  const purchases = await prismaClient.userPurchase.findMany({
    where: {
      user_id: userId
    },
    select: {
      id: true,
      created_at: true,
      products: {
        select: {
          is_billed: true,
          is_missing: true,
          amount: true,
          product_external_id: true
        }
      }
    }
  })

  const purchasesPromises = purchases.map(async (purchase) => {
    const mappedProductsPromises = purchase.products.map(
      async (purchaseProduct) => {
        const product = await getProductCached(
          purchaseProduct.product_external_id
        )

        delete (purchaseProduct as Partial<typeof purchaseProduct>)
          .product_external_id

        return {
          ...product,
          ...purchaseProduct
        }
      }
    )

    const products = await Promise.all(mappedProductsPromises)

    return {
      ...purchase,
      products
    }
  })

  const allPurchases = await Promise.all(purchasesPromises)
  disconect()

  return allPurchases
}
