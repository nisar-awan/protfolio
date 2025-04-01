import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany();
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const menuItem = await prisma.menuItem.update({
      where: { id: data.id },
      data: {
        label: data.label,
        path: data.path,
      },
    });
    return NextResponse.json(menuItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const menuItem = await prisma.menuItem.create({
      data: {
        label: data.label,
        path: data.path,
      },
    });
    return NextResponse.json(menuItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.menuItem.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}