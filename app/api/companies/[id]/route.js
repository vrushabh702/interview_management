import { NextResponse } from 'next/server';
import pool from '../../../../libs/db';

export async function GET(request, { params }) {
  try {
    const [rows] = await pool.query(
      `
      SELECT c.*, cs.is_applied, cs.is_favorite, cs.is_approached, cs.is_pending, 
             cs.in_interview_process, cs.is_rejected, cs.has_offer, cs.notes
      FROM companies c
      LEFT JOIN company_status cs ON c.id = cs.company_id
      WHERE c.id = ?
      `,
      [params.id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { name, location, google_maps_rating, number_of_reviews, services } = await request.json();
    await pool.query(
      'UPDATE companies SET name = ?, location = ?, google_maps_rating = ?, number_of_reviews = ?, services = ? WHERE id = ?',
      [name, location, google_maps_rating, number_of_reviews, services, params.id]
    );
    return NextResponse.json({ id: params.id, name, location, google_maps_rating, number_of_reviews, services });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await pool.query('DELETE FROM companies WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Company deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}