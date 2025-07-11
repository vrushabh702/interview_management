import { NextResponse } from 'next/server';
import pool from '../../../../libs/db';

export async function PUT(request, { params }) {
  try {
    const { is_applied, is_favorite, is_approached, is_pending, in_interview_process, is_rejected, has_offer, notes } = await request.json();
    await pool.query(
      `UPDATE company_status SET 
        is_applied = ?, is_favorite = ?, is_approached = ?, is_pending = ?, 
        in_interview_process = ?, is_rejected = ?, has_offer = ?, notes = ?
       WHERE company_id = ?`,
      [is_applied, is_favorite, is_approached, is_pending, in_interview_process, is_rejected, has_offer, notes, params.id]
    );
    return NextResponse.json({ company_id: params.id, is_applied, is_favorite, is_approached, is_pending, in_interview_process, is_rejected, has_offer, notes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}