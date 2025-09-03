/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 1
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: Leanne Graham
 *         username:
 *           type: string
 *           example: Bret
 *         email:
 *           type: string
 *           format: email
 *           example: Sincere@april.biz
 *
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The post ID.
 *           example: 1
 *         title:
 *           type: string
 *           description: The post title.
 *           example: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
 *         body:
 *           type: string
 *           description: The post content.
 *           example: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
 *         authorId:
 *           type: integer
 *           description: The ID of the author.
 *           example: 1
 *
 *     PostWithAuthor:
 *       allOf:
 *         - $ref: '#/components/schemas/Post'
 *         - type: object
 *           properties:
 *             author:
 *               $ref: '#/components/schemas/User'
 */
