import { NextResponse } from 'next/server';
import pool from '../../../libs/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cs.is_applied, cs.is_favorite, cs.is_approached, cs.is_pending, 
             cs.in_interview_process, cs.is_rejected, cs.has_offer, cs.notes
      FROM companies c
      JOIN company_status cs ON c.id = cs.company_id
      WHERE cs.is_favorite = TRUE
    `);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching favorite companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorite companies', details: error.message },
      { status: 500 }
    );
  }
}