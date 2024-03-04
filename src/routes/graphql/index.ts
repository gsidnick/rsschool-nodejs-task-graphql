import depthLimit from 'graphql-depth-limit';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import schema from './schema/schema.js';
import { Context } from './types/context.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const source = req.body.query;
      const variableValues = req.body.variables;
      const validateErrors = validate(schema, parse(source), [depthLimit(5)]);

      if (validateErrors.length > 0) {
        return { errors: validateErrors };
      }

      const contextValue: Context = {
        prisma: fastify.prisma,
        dataloaders: new WeakMap<WeakKey, []>(),
      };

      const { data, errors } = await graphql({
        schema,
        source,
        variableValues,
        contextValue,
      });

      if (errors) {
        return { errors };
      }

      return { data };
    },
  });
};

export default plugin;
