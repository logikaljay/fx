import fastify, { 
  ContextConfigDefault, FastifyInstance, FastifySchema, 
  RawReplyDefaultExpression, RawRequestDefaultExpression, 
  RawServerDefault, RouteGenericInterface, RouteOptions 
} from "fastify"
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import wellKnownPlugin from "./plugins/well-known";
import { loadConfig } from "./config";
import routes from "./plugins/routes";

async function createApp() {
  let app = fastify({
    exposeHeadRoutes: false
  }).withTypeProvider<ZodTypeProvider>()
  
  app.setErrorHandler((error, request, reply) => {
    reply.status(400).send({
      message: "Validation error",
      errors: JSON.parse(error.message),
    });
  });

  app.register(routes)
  app.register(wellKnownPlugin)
  
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  return app
}


export async function register(fn: (app: FastifyInstance) => Promise<void>) {
  const app = await createApp()
  let { data: config } = await loadConfig()

  app.register(wellKnownPlugin)

  let info = await app.listen({
    host: config?.host,
    port: config?.port
  })
  
  console.log(`server listening on ${info}`)
  console.log(app.printRoutes())
}

export async function route<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
  SchemaCompiler extends FastifySchema = FastifySchema,
>(
  opts: RouteOptions<RawServerDefault, RawRequestDefaultExpression<RawServerDefault>, RawReplyDefaultExpression<RawServerDefault>, RouteGeneric, ContextConfig, SchemaCompiler, ZodTypeProvider>
) 
{
  const app = await createApp()
  let { data: config } = await loadConfig()

  const url = [config?.baseUrl, opts.url].filter(Boolean).join('/')
    .replace(/\/\//gi, '/')

  app.route({
    ...opts,
  })

  let info = await app.listen({
    host: config?.host,
    port: config?.port
  })
  
  console.log(`server listening on ${info}`)
  console.log(app.printRoutes())
};

