import fastify, { ContextConfigDefault, FastifyInstance, FastifySchema, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteGenericInterface, RouteOptions } from "fastify"
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import z from "zod";

function getPort(): number {
  return Number.parseInt(process.env.PORT || "3000", 10);
}

let app = fastify().withTypeProvider<ZodTypeProvider>()

app.setErrorHandler((error, request, reply) => {
  reply.status(400).send({
    message: "Validation error",
    errors: JSON.parse(error.message),
  });
});


app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.route({
  url: '/fdsa',
  method: 'GET',
  schema: {
    querystring: z.object({
      name: z.string()
    })
  },
  handler: (req, reply) => {
    req.query.name
  }
})

export async function register(fn: (app: FastifyInstance) => Promise<void>) {
  await app.register(fn)

  await app.listen({
    host: '0.0.0.0',
    port: getPort()
  })
}

export async function route<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
  SchemaCompiler extends FastifySchema = FastifySchema,
>(
  opts: RouteOptions<RawServerDefault, RawRequestDefaultExpression<RawServerDefault>, RawReplyDefaultExpression<RawServerDefault>, RouteGeneric, ContextConfig, SchemaCompiler, ZodTypeProvider>
) 
{
  app.route({
    ...opts,
    method: 'GET'
  })

  let info = await app.listen({
    host: '0.0.0.0',
    port: getPort()
  })

  console.log(`server listening on ${info}`)
};

