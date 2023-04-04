import { prismaClient } from '../prisma'

const resultSelect = {
  product_external_id: true,
  is_favourite: true
}

export async function getFavourites(userId?: number) {
  if (!userId) {
    throw new Error('Missing the userID parameter')
  }

  return await prismaClient.productUser.findMany({
    where: {
      user_id: userId
    },
    select: resultSelect
  })
}

export async function updateFavourite(
  userId: number,
  params: { product_id: number; is_favourite: boolean }
) {
  const existingProductUser = await prismaClient.productUser.findFirst({
    where: {
      product_external_id: params.product_id,
      user_id: userId
    }
  })

  if (existingProductUser) {
    return await prismaClient.productUser.update({
      data: {
        is_favourite: params.is_favourite
      },
      where: {
        id: existingProductUser.id
      },
      select: resultSelect
    })
  }

  return await prismaClient.productUser.create({
    data: {
      is_favourite: params.is_favourite,
      user_id: userId,
      product_external_id: params.product_id
    },
    select: resultSelect
  })
}
