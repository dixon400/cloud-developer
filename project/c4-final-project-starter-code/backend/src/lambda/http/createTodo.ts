import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import * as AWS  from 'aws-sdk'


const doClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODOS_TABLE;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const itemId = uuid.v4();
    const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

    return undefined
)

handler.use(
  cors({
    credentials: true
  })
)
