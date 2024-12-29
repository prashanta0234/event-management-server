import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function generateAdmin() {
  try {
    const adminDetails = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'ADMIN',
    };

    const hashedPassword = await bcrypt.hash(adminDetails.password, 10);

    const admin = await prisma.admin.create({
      data: {
        id: uuidv4(),
        name: adminDetails.name,
        email: adminDetails.email,
        password: hashedPassword,
        role: adminDetails.role,
      },
    });

    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateAdmin();
