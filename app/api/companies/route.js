import { NextResponse } from 'next/server';
import pool from '../../../libs/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cs.is_applied, cs.is_favorite, cs.is_approached, cs.is_pending, 
             cs.in_interview_process, cs.is_rejected, cs.has_offer, cs.notes
      FROM companies c
      LEFT JOIN company_status cs ON c.id = cs.company_id
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, location, google_maps_rating, number_of_reviews, services } = await request.json();
    const [result] = await pool.query(
      'INSERT INTO companies (name, location, google_maps_rating, number_of_reviews, services) VALUES (?, ?, ?, ?, ?)',
      [name, location, google_maps_rating, number_of_reviews, services]
    );
    await pool.query(
      'INSERT INTO company_status (company_id) VALUES (?)',
      [result.insertId]
    );
    return NextResponse.json({ id: result.insertId, name, location, google_maps_rating, number_of_reviews, services });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add company' }, { status: 500 });
  }
}