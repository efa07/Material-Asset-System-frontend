import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Roles
  const roles = await Promise.all([
    prisma.role.upsert({ where: { name: 'ADMIN' }, update: {}, create: { name: 'ADMIN', description: 'Administrator' } }),
    prisma.role.upsert({ where: { name: 'STORE_MANAGER' }, update: {}, create: { name: 'STORE_MANAGER', description: 'Store Manager' } }),
    prisma.role.upsert({ where: { name: 'ASSET_MANAGER' }, update: {}, create: { name: 'ASSET_MANAGER', description: 'Asset Manager' } }),
    prisma.role.upsert({ where: { name: 'TECHNICIAN' }, update: {}, create: { name: 'TECHNICIAN', description: 'Technician' } }),
    prisma.role.upsert({ where: { name: 'EMPLOYEE' }, update: {}, create: { name: 'EMPLOYEE', description: 'Employee' } }),
    prisma.role.upsert({ where: { name: 'AUDITOR' }, update: {}, create: { name: 'AUDITOR', description: 'Auditor' } }),
  ]);

  const roleMap = Object.fromEntries(roles.map((r: any) => [r.name, r]));

  // Users
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: 'admin@example.com' }, update: {}, create: { email: 'admin@example.com', firstName: 'Admin', lastName: 'User', roleId: roleMap.ADMIN.id } }),
    prisma.user.upsert({ where: { email: 'storemgr@example.com' }, update: {}, create: { email: 'storemgr@example.com', firstName: 'Store', lastName: 'Manager', roleId: roleMap.STORE_MANAGER.id } }),
    prisma.user.upsert({ where: { email: 'assetmgr@example.com' }, update: {}, create: { email: 'assetmgr@example.com', firstName: 'Asset', lastName: 'Manager', roleId: roleMap.ASSET_MANAGER.id } }),
    prisma.user.upsert({ where: { email: 'tech@example.com' }, update: {}, create: { email: 'tech@example.com', firstName: 'Tech', lastName: 'User', roleId: roleMap.TECHNICIAN.id } }),
    prisma.user.upsert({ where: { email: 'employee@example.com' }, update: {}, create: { email: 'employee@example.com', firstName: 'Regular', lastName: 'Employee', roleId: roleMap.EMPLOYEE.id } }),
    prisma.user.upsert({ where: { email: 'auditor@example.com' }, update: {}, create: { email: 'auditor@example.com', firstName: 'Auditor', lastName: 'User', roleId: roleMap.AUDITOR.id } }),
  ]);

  const userMap = Object.fromEntries(users.map((u: any) => [u.email, u]));

  // Stores
  const storeA = await prisma.store.upsert({ where: { name: 'Main Warehouse' }, update: {}, create: { name: 'Main Warehouse', location: 'Building A' } });
  const storeB = await prisma.store.upsert({ where: { name: 'Secondary Warehouse' }, update: {}, create: { name: 'Secondary Warehouse', location: 'Building B' } });

  // Shelves
  const shelfA1 = await prisma.shelf.upsert({ where: { id: 'shelf-a1' }, update: { name: 'A-1', storeId: storeA.id }, create: { id: 'shelf-a1', name: 'A-1', storeId: storeA.id } });
  const shelfB1 = await prisma.shelf.upsert({ where: { id: 'shelf-b1' }, update: { name: 'B-1', storeId: storeB.id }, create: { id: 'shelf-b1', name: 'B-1', storeId: storeB.id } });

  // Categories
  const laptopCat = await prisma.assetCategory.upsert({ where: { name: 'Laptop' }, update: {}, create: { name: 'Laptop', description: 'Portable computers' } });
  const monitorCat = await prisma.assetCategory.upsert({ where: { name: 'Monitor' }, update: {}, create: { name: 'Monitor', description: 'Display monitors' } });
  const chairCat = await prisma.assetCategory.upsert({ where: { name: 'Chair' }, update: {}, create: { name: 'Chair', description: 'Office chairs' } });

  // Assets
  const assets = await Promise.all([
    prisma.asset.upsert({ where: { serialNumber: 'SN-1001' }, update: {}, create: { name: 'Dell Latitude 7420', serialNumber: 'SN-1001', categoryId: laptopCat.id, storeId: storeA.id, shelfId: shelfA1.id, status: 'IN_USE' } }),
    prisma.asset.upsert({ where: { serialNumber: 'SN-1002' }, update: {}, create: { name: 'HP ProBook 450', serialNumber: 'SN-1002', categoryId: laptopCat.id, storeId: storeA.id, shelfId: shelfA1.id, status: 'AVAILABLE' } }),
    prisma.asset.upsert({ where: { serialNumber: 'SN-2001' }, update: {}, create: { name: 'Dell 24" Monitor', serialNumber: 'SN-2001', categoryId: monitorCat.id, storeId: storeB.id, shelfId: shelfB1.id, status: 'AVAILABLE' } }),
    prisma.asset.upsert({ where: { serialNumber: 'SN-3001' }, update: {}, create: { name: 'Ergonomic Chair', serialNumber: 'SN-3001', categoryId: chairCat.id, storeId: storeB.id, shelfId: shelfB1.id, status: 'IN_USE' } }),
  ]);

  // Assignments
  await prisma.assetAssignment.upsert({
    where: { id: 'assign-1' },
    update: {},
    create: { id: 'assign-1', assetId: assets[0].id, userId: userMap['employee@example.com'].id, assignedAt: new Date(), status: 'ACTIVE' },
  });

  // Transfers
  await prisma.assetTransfer.create({ data: { assetId: assets[2].id, fromStoreId: storeA.id, toStoreId: storeB.id, reason: 'Redistribution', status: 'COMPLETED' } });

  // Maintenance
  await prisma.maintenanceRecord.create({ data: { assetId: assets[0].id, type: 'PREVENTIVE', description: 'Battery replacement', cost: 120.0 } });

  // Audit logs
  await prisma.auditLog.create({ data: { action: 'SEED', entity: 'DATABASE', details: { seeded: true }, timestamp: new Date() } });

  // Notifications
  await prisma.notification.create({ data: { userId: userMap['employee@example.com'].id, title: 'Welcome', message: 'Your account and sample assets have been created' } });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
