const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

interface User {
  id: string
}

async function cleanup() {
  try {
    // Delete sessions that reference non-existent users
    const deletedSessions = await prisma.session.deleteMany({
      where: {
        userId: {
          notIn: (await prisma.user.findMany()).map((user: User) => user.id)
        }
      }
    })
    console.log(`Deleted ${deletedSessions.count} orphaned sessions`)

    // Delete accounts that reference non-existent users
    const deletedAccounts = await prisma.account.deleteMany({
      where: {
        userId: {
          notIn: (await prisma.user.findMany()).map((user: User) => user.id)
        }
      }
    })
    console.log(`Deleted ${deletedAccounts.count} orphaned accounts`)

    console.log('Cleanup completed successfully')
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanup()
