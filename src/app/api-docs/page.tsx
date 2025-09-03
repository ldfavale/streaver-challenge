import { getSwaggerSpec } from '@/lib/get-swagger-spec'
import Swagger from './swagger'

export default async function ApiDocsPage() {
  const spec = await getSwaggerSpec()
  return (
    <section className="container">
      <Swagger spec={spec} />
    </section>
  )
}
