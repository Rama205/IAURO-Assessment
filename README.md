IAURO – PROJECT – Assessment
Tech stack: Node Js, express Js, mongo DB
The project is a comprehensive backend system featuring JWT authentication and password encryption. It supports admin and user creation, with varying access levels for managing users and products. Users can create products, while admins have enhanced capabilities for user and product management.

API Security and Validation : All APIs are secured using Joi validation to ensure data integrity and prevent any malformed or incorrect data from being processed at the backend. This provides an extra layer of protection by catching any client-side issues before they can affect the system.

Middleware-based Access Control :
Access to the APIs is further safeguarded through a series of carefully coded middleware checks, which include:
•	Authentication Middleware: Ensures that only authenticated users can access the APIs by verifying valid tokens.
•	Authorization Middleware: Restricts access to specific resources based on user roles (e.g., Admin vs. regular users), ensuring users have the necessary permissions to perform actions.
•	Validation Middleware: All incoming requests are validated to ensure correct data types, formats, and completeness, using Joi schemas for each endpoint.
•	Admin-specific Middleware: Admin-only routes are secured with an additional check to verify that the user has admin privileges.
These measures ensure that the API remains robust, secure, and free from potential vulnerabilities caused by invalid requests or unauthorized access.


List of APIs and purposes:
1.	SIGNUP
POST - http://localhost:8080/user/signup

2.	SIGN IN
POST - http://localhost:8080/user/signin

3.	LIST OF USERS
GET - http://localhost:8080/admin/user/lists


4.	UPDATE USER
PATCH - http://localhost:8080/admin/updateUser/:userId

5.	DELETE USER
PATCH - http://localhost:8080/admin/softDelete/:userId


6.	ADD PRODUCTS
POST - http://localhost:8080/user/createProducts

7.	PRODUCT VISIBILITY
PATCH - http://localhost:8080/admin/product/:productId/visibility


8.	PRODUCT LIST
GET - http://localhost:8080/product/productsList

9.	UPDATE PRODUCT
PATCH - http://localhost:8080/admin/product/update/:productId


10.	DELETE PRODUCT
PATCH - http://localhost:8080/admin/product/softDelete/:productId


EXPLANATION :
1.	POST – SIGNUP 
http://localhost:8080/user/signup
Success Case:
            {
                "name":"Rooby",
                "email":"rooby@gmail.com",
                "password":"1234",
                "mobile":"9480098166"
            }
Output:  1st time it will check for the is_admin :true in whole collection, if not available , it will be created as admin cred.

{
    "message": "Signup successful! Admin account created.",
    "success": true
}

If one is admin available then, rest all the signup will considered as new users.
If we try with same email again it will give below errr

{
    "message": "User already exists in the database, you can login",
    "success": false
}
Or
{
    "message": "This user is an inactive admin and cannot be reactivated.",
    "success": false
}
Or 
{
    "message": "This user is currently inactive. Contact admin to reactivate the account.",
    "success": false
}


If everything is correct then it will create new user
{
    "message": "Signup successful! User account created.",
    "success": true
}




2.POST – SIN IN 
 http://localhost:8080/user/signin
Success Case :
{
   "email":"rooby@gmail.com",
   "password":"1234"
}
200 OK
{
    "message": "Login Success",
    "success": true,
    "jwtToken": "auth -TOKEN",
    "email": "rooby@gmail.com",
    "name": "Rooby"
}



Incorrect Case:
{
   "email":"Taju@gmail.com",
   "password":"1234"

}
403 forbidden
{
    "message": "Authentocation failed,Email or password is incorrect",
    "success": false
}


3. GET  : LIST OF USERS( only admin access)
http://localhost:8080/admin//user/lists?page=1&pageSize=10
The Get List API supports search and pagination to efficiently handle large datasets and return only the relevant results. The following query parameters are available:
•	searchText: Allows partial or complete matching on fields such as name, email, or other searchable attributes to filter the data based on the user's input.
•	page: Specifies the current page number, enabling the API to return results for the requested page. Default is page 1 if not provided.
•	pageSize: Determines the number of items returned per page. This ensures that only a subset of the data is retrieved, improving performance and reducing response size.
•	skip: This option allows skipping a specified number of records, useful for implementing custom pagination or retrieving data in chunks.
And it will only list active users as key is maintained 

Correct Case :
{
    "message": "List of all the users",
    "users": [
        {
            "_id": "66e6b6ddf1675bc8b0d1e968",
            "name": "Rock",
            "email": "rock@gmail.com",
            "mobile": "9480098166",
            "isDeleted": 0
        },
        {
            "_id": "66e6ba8608241cf8ec36f170",
            "name": "Jia",
            "email": "jiak@gmail.com",
            "mobile": "9480098166",
            "isDeleted": 0
        },
        {
            "_id": "66e6ba9708241cf8ec36f174",
            "name": "Rose",
            "email": "rose@gmail.com",
            "mobile": "9480098166",
            "isDeleted": 0
        }
    ],
    "currentPage": "1",
    "totalPages": 1,
    "totalUsers": 3
}



Incorrect Case:
Response : 401 unauthorized  
{
    "message": "Unauthorized, JWT token wrong or expired"
}



4. PATCH :UPDATE USER
http://localhost:8080/admin/updateUser/66e6b6ddf1675bc8b0d1e968

Correct case:

{
    "name":"Ramya",
    "mobile":"8877887766"
}

200:OK
{
    "message": "User updated successfully"
}

Incorrect  case :

{
    "name":"Ramya",
    "mobile":"8877887766"
}
403 forbidden:
{
    "message": "Access denied. Admins only have access to this operation."
}


5.PATCH :DELETE USER 
http://localhost:8080/admin//softDelete/66e6b6ddf1675bc8b0d1e968
Correct case: isDeleted will be 1 And status key will be :0
200 :OK
{
    "message": "User soft deleted successfully"
}

incorrect case:
401-Unauthorised 
{
    "message": "Unauthorized, JWT token wrong or expired"
}
OR
{
    "message": "Cannot delete admin user"
}


6.  POST: ADD PRODUCTS (only user access)
http://localhost:8080/user/createProducts
Success Case :
{
  "name": "phone",
  "description": "Slim wireless.",
  "price": 100,
  "quantity": 10,
  "category": "Electronics"
}
If it’s a new product adding for the 1st time by the respective user then response will be:
201 :Created
{
    "message": "Product added successfully",
    "product": {
        "name": "phone",
        "description": "Slim wireless.",
        "price": 100,
        "quantity": 10,
        "category": "Electronics",
        "isVisible": true,
        "createdBy": "66e6ba9708241cf8ec36f174",
        "isDeleted": 0,
        "status": 1,
        "_id": "66e6bec4f663a2a87e1fc125",
        "createdAt": "2024-09-15T11:02:28.808Z",
        "updatedAt": "2024-09-15T11:02:28.808Z",
        "__v": 0
    }
}
If a user attempts to add a product with the same specifications (e.g., same name, description, price, and category) as an existing product in the database, instead of creating a new product entry, the system will:
•	Update the existing product's quantity by adding the quantity from the new request to the existing product's quantity.
This ensures that duplicate products are not created, and only the quantity is adjusted for identical products, keeping the product inventory accurate and streamlined.
{
    "message": "Product quantity updated successfully",
    "product": {
        "_id": "66e6bfdef87b3beb4157f9e7",
        "name": "phone",
        "description": "Slim wireless.",
        "price": 100,
        "quantity": 20,
        "category": "Electronics",
        "isVisible": true,
        "createdBy": "66e6ba9708241cf8ec36f174",
        "isDeleted": 0,
        "status": 1,
        "createdAt": "2024-09-15T11:07:10.704Z",
        "updatedAt": "2024-09-15T11:07:19.831Z",
        "__v": 0
    }
}

Incorrect case :
{
  "name": "phone",
  "description": "Slim wireless.",
  "price": 100,
  "quantity": 10,
  "category": "Electronics"
}

403: Forbidden
{
    "message": "Access denied.Admin dont have access to ceate the products, Only non-admin users can insert the products."
}

7.PATCH :PRODUCT VISIBILITY (Admin only)
http://localhost:8080/admin/product/66e6bfdef87b3beb4157f9e7/visibility
Success case: isVisible key is maintained  for visibility of any product
{
    "isVisible":false
}
200 :OK
{
    "message": "Product visibility updated successfully",
    "product": {
        "_id": "66e6bfdef87b3beb4157f9e7",
        "name": "phone",
        "description": "Slim wireless.",
        "price": 100,
        "quantity": 20,
        "category": "Electronics",
        "isVisible": false,
        "createdBy": "66e6ba9708241cf8ec36f174",
        "isDeleted": 0,
        "status": 1,
        "createdAt": "2024-09-15T11:07:10.704Z",
        "updatedAt": "2024-09-15T11:25:29.504Z",
        "__v": 0
    }
}

Incorrect case:
{
    "isVisible":false
}
403:Forbidden
{
    "message": "Access denied. Admins only have access to this operation."
}

8.GET :PRODUCT LIST :
http://localhost:8080/product/productsList?page=1&pageSize=10
Success Case: 
•  If the user is an admin, they will be able to see all the products that are marked as visible (isVisible: true and is Deleted:0,status:1), including those they have set.
•  If the user (non-admin) accesses the product list, they will only be able to see the products 
(isVisible: true and active products), they have added.
200:OK
{
    "message": "All Products Listed successfully",
    "currentPage": "1",
    "totalPages": 1,
    "totalProducts": 5,
    "products": [
        {
            "_id": "66e6c00df87b3beb4157f9ec",
            "name": "mobile",
            "description": "Slim wireless.",
            "price": 100,
            "quantity": 10,
            "category": "Electronics",
            "createdBy": "66e6ba9708241cf8ec36f174"
        },
        {
            "_id": "66e6c0c8f87b3beb4157f9f2",
            "name": "mobile",
            "description": "Slim wireless.",
            "price": 100,
            "quantity": 20,
            "category": "Electronics",
            "createdBy": "66e6ba8608241cf8ec36f170"
        },
        {
            "_id": "66e6c0cdf87b3beb4157f9f5",
            "name": "mobile",
            "description": "Slim wireless.",
            "price": 100,
            "quantity": 10,
            "category": "Electronics",
            "createdBy": "66e6ba8608241cf8ec36f170"
        },
        {
            "_id": "66e6c1178753f0f41a5f1694",
            "name": "mobile",
            "description": "Slim wireless.",
            "price": 100,
            "quantity": 10,
            "category": "Electronics",
            "createdBy": "66e6ba8608241cf8ec36f170"
        },
        {
            "_id": "66e6c21add15a7d8db30451c",
            "name": "mobile",
            "description": "Slim wireless.",
            "price": 100,
            "quantity": 10,
            "category": "Electronics",
            "createdBy": "66e6ba8608241cf8ec36f170"
        }
    ]
}


9.PATCH:UPDATE PRODUCT(admin only)
http://localhost:8080/admin/product/update/66e6c00df87b3beb4157f9ec
Success case:
{
    "category":"Electronics",
    "price" :1070,
    "description":"testing testing testing"
}
200 OK
{
    "message": "Product updated successfully"
}

Incorrect case:
{
    "category":"Electronics",
    "price" :1070,
    "description":"testing testing testing"
}

{
    "message": "Unauthorized, JWT token wrong or expired"
}



10.PATCH: PRODUCT SOFT DELETE (admin only)
http://localhost:8080/admin/product/softDelete/66e6c00df87b3beb4157f9ec
Success case:
200:OK
{
    "message": "Product soft deleted successfully"
}

Incorrect Case:
{
    "message": "Unauthorized, JWT token is require"
}


