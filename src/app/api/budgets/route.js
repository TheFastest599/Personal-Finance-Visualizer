import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('personal-finance');
    const budgets = await db.collection('budgets').find({}).toArray();

    return NextResponse.json({ budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('personal-finance');
    const budget = await request.json();

    // Add timestamp
    budget.createdAt = new Date();
    budget.updatedAt = new Date();

    const result = await db.collection('budgets').insertOne(budget);
    const newBudget = await db
      .collection('budgets')
      .findOne({ _id: result.insertedId });

    return NextResponse.json({ budget: newBudget });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}
