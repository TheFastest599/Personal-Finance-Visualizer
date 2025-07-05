import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('personal-finance');
    const { id } = params;
    const updates = await request.json();

    // Add timestamp
    updates.updatedAt = new Date();

    const result = await db
      .collection('transactions')
      .updateOne({ id: id }, { $set: updates });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const updatedTransaction = await db
      .collection('transactions')
      .findOne({ id: id });

    return NextResponse.json({ transaction: updatedTransaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('personal-finance');
    const { id } = params;

    const result = await db.collection('transactions').deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
