import { CartProduct } from '@/models/cart'
import { prismaClient } from '../prisma'
import { getProduct } from './products'
import { Product } from '@/models/product'
import { CartProduct as CartProductModelFull } from '@prisma/client'

const cartSelect = {
  id: true,
  user_id: true,
  open: true,
  products: {
    select: {
      amount: true,
      product_external_id: true
    }
  }
}

type CartProductModel = Pick<
  CartProductModelFull,
  'product_external_id' | 'amount'
>

async function mapCartProductWithProduct(
  cartProduct: CartProductModel,
  product?: Product
): Promise<CartProduct> {
  if (product) {
    delete (cartProduct as Partial<typeof cartProduct>).product_external_id

    const mappedProduct = {
      ...product,
      ...cartProduct
    }

    return mappedProduct
  }

  const productPromise = async () => {
    const product = await getProduct(cartProduct.product_external_id)

    delete (cartProduct as Partial<typeof cartProduct>).product_external_id

    return {
      ...product,
      ...cartProduct
    }
  }

  return await productPromise()
}

export async function getCart(userId: number) {
  const cart = await prismaClient.cart.findUnique({
    where: {
      user_id: userId
    },
    select: cartSelect
  })

  if (!cart) {
    return undefined
  }

  const productsPromises = cart.products.map((cartProduct) =>
    mapCartProductWithProduct(cartProduct)
  )

  return {
    ...cart,
    products: await Promise.all(productsPromises)
  }
}

export async function updateCartProduct(
  userId: number,
  product: CartProduct,
  getNewAmount?: (existingProduct: CartProductModel) => number | undefined
) {
  let cart = await prismaClient.cart.findUnique({
    where: {
      user_id: userId
    },
    select: cartSelect
  })

  if (!cart) {
    cart = await prismaClient.cart.create({
      data: {
        products: {
          create: {
            product_external_id: product.id,
            amount: 1
          }
        },
        user_id: userId
      },
      select: cartSelect
    })

    return cart
  }

  const existingProduct = cart.products.find(
    (cartProduct) => cartProduct.product_external_id == product.id
  )

  let amount = 1

  if (existingProduct) {
    if (getNewAmount && typeof getNewAmount === 'function') {
      const newAmount = getNewAmount(existingProduct)

      if (newAmount) {
        amount = newAmount
      }
    } else {
      amount = product.amount
    }
  }

  cart = await prismaClient.cart.update({
    where: {
      id: cart.id
    },
    data: {
      products: {
        upsert:
          amount > 0
            ? {
                where: {
                  product_external_id: product.id
                },
                create: { product_external_id: product.id, amount },
                update: { product_external_id: product.id, amount }
              }
            : undefined,
        delete:
          amount === 0
            ? {
                product_external_id: product.id
              }
            : undefined
      }
    },
    select: cartSelect
  })

  return cart
}

export async function addToCart(userId: number, product: CartProduct) {
  function getNewAmount(existingProduct: CartProductModel) {
    return existingProduct.amount + 1
  }

  return updateCartProduct(userId, product, getNewAmount)
}

export async function removeFromCart(userId: number, product: CartProduct) {
  function getNewAmount(existingProduct: CartProductModel) {
    return existingProduct.amount - 1
  }

  return updateCartProduct(userId, product, getNewAmount)
}
