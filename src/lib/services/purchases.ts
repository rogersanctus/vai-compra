import { Product } from '@/models/product'
import { prismaClient } from '../prisma'
import { getProduct } from './products'

const CACHE_LIKE_SIZE = 20

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

export async function getPurchases(userId: number) {
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
          product_external_id: true
        }
      }
    }
  })

  async function getProductCached(id: number) {
    const cache: Record<number, Product> = {}

    if (id in cache) {
      return Promise.resolve(cache[id])
    }

    const product: Product = await getProduct(id)

    if (Object.keys(cache).length <= CACHE_LIKE_SIZE) {
      cache[id] = product
    }

    return product
  }

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
}
