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
      .collection('budgets')
      .updateOne({ id: id }, { $set: updates });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    const updatedBudget = await db.collection('budgets').findOne({ id: id });

    return NextResponse.json({ budget: updatedBudget });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('personal-finance');
    const { id } = params;

    const result = await db.collection('budgets').deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}
