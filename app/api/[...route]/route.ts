/* eslint-disable @typescript-eslint/no-explicit-any */
import { createData, getData, updateData, deleteData, getDataById } from '@/app/lib/database';
import { getCurrentUser } from '@/app/lib/jwt';
import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


// Helper to get slug parts
function getSlugParts(req: NextRequest) {
    // /api/predictions/[...slug]
    // req.nextUrl.pathname = /api/predictions, /api/predictions/123, etc.
    const base = '/api/';
    const path = req.nextUrl.pathname.slice(base.length);
    const slug = path.split('/').filter(Boolean);
    return slug;
}

export async function GET(req: NextRequest) {
    const slug = getSlugParts(req);
    if (slug.length === 1) {
        console.log('FIRST Slug:', slug);
        // GET /api/predictions
        const model = slug[0] as keyof typeof prisma;
        console.log('Model:', model);
        const result = await getData(model);
        if (!result.success) return NextResponse.json({ error: 'Failed to fetch ' + model.toString() }, { status: 500 });
        return NextResponse.json(result.data, { status: 200 });
    } else if (slug.length === 2) {
        console.log('SECOND Slug:', slug);
        // GET /api/predictions/[id]
        const model = slug[0] as keyof typeof prisma;
        const id = slug[1];
        const result = await getDataById(model, id);
        if (!result.success) return NextResponse.json({ error: model.toString() + ' not found' }, { status: 404 });
        return NextResponse.json(result.data, { status: 200 });
    } else return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(req: NextRequest) {
    const slug = getSlugParts(req);
    if (slug.length === 1) {
        // POST /api/predictions
        try {
            const user = await getCurrentUser();
            if (!user || user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            const model = slug[0] as keyof typeof prisma;
            console.log('User:', user);
            const body = await req.json();
            console.log('Request body:', body);
            if (!body.publishedAt) body.publishedAt = new Date().toISOString();
            if (model.toString() === 'prediction') {
                await createData('league', { name: body.league/*,  sporttype: body.sporttype  */});
            }
            const result = await createData(model, body);
            if (!result.success) {
                return NextResponse.json({ error: 'Failed to create ' + model.toString(), result }, { status: 500 });
            }
            return NextResponse.json(result.data, { status: 201 });
        } catch (error: any) {
            return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 });
        }
    }
    else return NextResponse.json({ error: 'Schema Not found' }, { status: 404 });
}

export async function PUT(req: NextRequest) {
    const slug = getSlugParts(req);
    if (slug.length === 2) {
        // PUT /api/predictions/[id]
        try {
            const user = await getCurrentUser();
            if (!user || user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const model = slug[0] as keyof typeof prisma;
            const id = slug[1];
            console.log('model ', model, 'id ', id);

            const body = await req.json();
            console.log('Request body:', body);


            const result = await updateData(model, { id  }, body);
            if (!result.success) {
                return NextResponse.json({ error: 'Failed to update ' + model.toString(), result }, { status: 500 });
            }
            return NextResponse.json(result.data, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
    const slug = getSlugParts(req);
    if (slug.length === 2) {
        // DELETE /api/predictions/[id]
        try {
            const user = await getCurrentUser();
            if (!user || user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const model = slug[0] as keyof typeof prisma;
            const id = slug[1];
            const result = await deleteData(model, { id });
            if (!result.success) {
                return NextResponse.json({ error: 'Failed to delete ' + model.toString(), result }, { status: 500 });
            }
            return NextResponse.json({ success: true });
        } catch (error) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
