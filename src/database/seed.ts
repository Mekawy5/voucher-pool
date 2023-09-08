import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

// seed customers
  await prisma.customer.upsert({
    where: { email: 'customer1@test.com' },
    update: {},
    create: {
      email: 'customer1@test.com',
      name: 'customer 1'
    },
  });

  await prisma.customer.upsert({
    where: { email: 'customer2@test.com' },
    update: {},
    create: {
      email: 'customer2@test.com',
      name: 'customer 2'
    },
  });

  await prisma.customer.upsert({
    where: { email: 'customer3@test.com' },
    update: {},
    create: {
      email: 'customer3@test.com',
      name: 'customer 3'
    },
  });

  // seed special offers
  await prisma.specialOffer.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'special offer 1',
      discount: 25.0
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })