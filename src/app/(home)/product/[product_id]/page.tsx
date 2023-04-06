import { Carousel } from '@/components/Carousel/Carousel'
import { getProduct, getProductsByCategory } from '@/lib/services/products'
import { Product } from '@/models/product'
import { ProductImage } from './ProductImage'
import { Rating } from '@/components/Rating'
import { formatPrice } from '@/lib/number'
import { ProductInfo } from './ProductInfo'
import { ProductDetailsActions } from './ProductDetailsActions'

export default async function ProductPage({
  params
}: {
  params: { product_id: string }
}) {
  const productIdParam = params.product_id
  const productId = Number(productIdParam)
  let categoryProducts: Product[] = []

  if (isNaN(productId)) {
    return <span>Oops, impossível obter detalhes desse produto.</span>
  }

  try {
    const product: Product = await getProduct(productId)
    const price = formatPrice(product.price)

    try {
      categoryProducts = await getProductsByCategory(product.category)
    } catch (error) {
      categoryProducts = []
    }

    return (
      <div className="px-20 pt-12 pb-20">
        <div className="py-8 border-b border-gray-300 shadow-lg">
          <div className="flex flex-grow">
            <div className="flex-grow mr-8">
              <ProductImage product={product} />
            </div>
            <div className="flex flex-grow flex-col border-l border-gray-300 p-8">
              <span className="text-lg font-semibold">{product.title}</span>
              <div className="flex items-center mt-3">
                <Rating rate={product.rating.rate} className="mr-2" />
                <span className="text-base font-semibold">
                  ({product.rating.count})
                </span>
              </div>
              <div className="mt-6">
                <span className="text-3xl text-sky-500 font-semibold">
                  {price}
                </span>
                <p className="mt-8">{product.description}</p>
              </div>
              <ProductDetailsActions product={product} />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-center">
          <span className="text-3xl text-amber-500 font-bold uppercase">
            Compre também
          </span>
          <Carousel
            items={categoryProducts.map((categoryProduct) => (
              <ProductInfo key={categoryProduct.id} product={categoryProduct} />
            ))}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.info(error)

    return (
      <div>
        <span>{productId}</span>
      </div>
    )
  }
}
