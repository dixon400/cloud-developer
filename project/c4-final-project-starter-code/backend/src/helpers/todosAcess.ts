import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosByCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Fetching all todos for user ${userId} from ${this.todosTable}`)

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todosByCreatedAtIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items

    logger.info(`${items.length} todos for user ${userId}`)

    return items as TodoItem[]
  }

  async getTodoItem(userId: string, todoId: string): Promise<TodoItem> {
    logger.info(`Fetching todo ${todoId}`)

    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      })
      .promise()

    const item = result.Item

    return item as TodoItem
  }

  async createTodoItem(todoItem: TodoItem) {
    logger.info(`Creating a todo with id: ${todoItem.todoId}`)

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()
  }

  async updateTodo(
    userId: string,
    todoId: string,
    todo: TodoUpdate
  ): Promise<TodoUpdate> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': todo.name,
          ':dueDate': todo.dueDate,
          ':done': todo.done,
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return todo
  }

  async deleteTodoItem(userId: string, todoId: string) {
    logger.info(`Deleting todo item ${todoId}`)

    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      })
      .promise()
  }

  async updateAttachmentUrl(userId: string,todoId: string, attachmentUrl: string) {
    logger.info(`Adding attachment URL for todo ${todoId}`)

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
  }
}
