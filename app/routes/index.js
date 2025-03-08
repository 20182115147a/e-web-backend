import userRoutes from './users.js'
import productRoutes from './products.js'
import orderRouters from './orders.js'
function route(app) {
  app.use('/products',productRoutes)
  app.use('/orders',orderRouters)
  app.use('/',userRoutes)
  app.get('/', (req, res) => {
        res.send('Hello World!')
      })
}

export default route