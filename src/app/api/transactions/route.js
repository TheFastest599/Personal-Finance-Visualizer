import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('personal-finance');
    const transactions = await db.collection('transactions').find({}).toArray();

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('personal-finance');
    const transaction = await request.json();

    // Add timestamp
    transaction.createdAt = new Date();
    transaction.updatedAt = new Date();

    const result = await db.collection('transactions').insertOne(transaction);
    const newTransaction = await db
      .collection('transactions')
      .findOne({ _id: result.insertedId });

    return NextResponse.json({ transaction: newTransaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
