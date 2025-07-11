import { NextResponse } from 'next/server';
import pool from '../../../libs/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cs.is_applied, cs.is_favorite, cs.is_approached, cs.is_pending, 
             cs.in_interview_process, cs.is_rejected, cs.has_offer, cs.notes
      FROM companies c
      JOIN company_status cs ON c.id = cs.company_id
      WHERE cs.in_interview_process = TRUE
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch interview companies' }, { status: 500 });
  }
}