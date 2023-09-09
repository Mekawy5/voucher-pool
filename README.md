
## Voucher Pool

  

This is a sample NestJS application that generates and manages voucher codes.

  

### Overview

The app has APIs for:

* Generating voucher codes for users for specific special offer

* Redeeming the voucher code once, and tracking the usage date

* Getting customers all voucher codes

### It uses:

NestJS framework

PostgreSQL database

Prisma for database access

Throttler for API rate limiting

Jest for testing

  ---

### Running the Application:

Copy .env.example to .env and update environment variables

`cp .env.example .env`

Build images and run containers:

`docker-compose up -d --build`

Run migrations:

`docker-compose exec api npx prisma migrate dev --name migrations`

Seed database (customer & special offers):

`docker-compose exec api npx prisma db seed`

The API will be available on `http://localhost:3000`

  ---

### Tests:

To run tests:

`docker-compose exec api npm run test`

  ---
  ---

### API Documentation

> Create Voucher Codes

  

    POST /voucher-codes

  
Request:

    {
    	"special_offer_id": 1,
    	"expiration_date": "2023-09-10"
    }

Response:


    {
    	"message": "Voucher Codes Created."
    }

  ---

> Redeem Voucher Code


    POST /voucher-codes/redeem

Request:  

    {
    	"code": "f5yl7g5w1f",
    	"email": "customer1@test.com"
    }


Response:


    {
    	"message": "Voucher Code Redeemed",
    	"discount": 25
    }

  ---

> List Voucher Codes


    GET /voucher-codes?email={email}
 

Response:

    [
    	{
    		"code": "f5yl7g5w1f",
    		"usedAt": null,
    		"specialOffer": {
    			"name": "special offer 1"
    		}
    	}
    ]
